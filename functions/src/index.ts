// src/index.ts

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {adminNotify, getOrderFailed, getOrderSuccess} from "./templates";
import {
  BATCH_LIMIT,
  Item,
  Order,
  PaymentMethod,
  PaymentStatus,
} from "./constant";
import {sendEmail, sendSMS} from "./notifications";
import {
  calculateTotal,
  commitBatch,
  sendAdminEmail,
  sendAdminSMS} from "./util";

// Initialize Firebase Admin
admin.initializeApp();
export const db = admin.firestore();


// Cloud Functions

/**
 * Scheduled function to clean up failed orders and restock inventory.
 */
exports.scheduledOrdersCleanup = functions.pubsub
  .schedule("every 1 hours")
  .onRun(async () => {
    try {
      const orderCollection = db.collection("orders");
      const inventoryCollection = db.collection("inventory");

      const twoHoursAgo = admin.firestore.Timestamp
        .fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000));

      // Fetch failed and pending PayHere orders
      const payhereFailedOrders = await orderCollection
        .where("paymentMethod", "==", PaymentMethod.PayHere)
        .where("createdAt", "<=", twoHoursAgo)
        .where("paymentStatus", "in",
          [PaymentStatus.Failed, PaymentStatus.Pending])
        .get();

      // Fetch failed COD orders
      const codFailedOrders = await orderCollection
        .where("paymentMethod", "==", PaymentMethod.COD)
        .where("createdAt", "<=", twoHoursAgo)
        .where("paymentStatus", "==", PaymentStatus.Failed)
        .get();

      const allFailedOrders =
                [...payhereFailedOrders.docs, ...codFailedOrders.docs];

      if (allFailedOrders.length === 0) {
        console.log("No failed orders to restock.");
        return null;
      }

      console.log(`Found ${allFailedOrders.length} failed orders to 
      restock and delete.`);

      let batch = db.batch();
      let opCounts = 0;

      for (const orderDoc of allFailedOrders) {
        const orderData = orderDoc.data() as Order;

        for (const orderItem of orderData.items) {
          const inventoryDocRef = inventoryCollection.doc(orderItem.itemId);
          const inventoryDoc = await inventoryDocRef.get();

          if (inventoryDoc.exists) {
            const inventoryData = inventoryDoc.data() as Item;

            const variant = inventoryData.variants.find(
              (v) => v.variantId === orderItem.variantId
            );

            if (variant) {
              const size = variant.sizes.find((s) => s.size === orderItem.size);
              if (size) {
                size.stock += orderItem.quantity;
                batch.set(inventoryDocRef, inventoryData);
                opCounts++;

                if (opCounts >= BATCH_LIMIT) {
                  batch = await commitBatch(batch, opCounts);
                  opCounts = 0;
                }
              } else {
                console.warn(
                  `Size not found for itemId: ${orderItem.itemId},
                   variantId: ${orderItem.variantId}, size: ${orderItem.size}`
                );
              }
            } else {
              console.warn(
                `Variant not found for itemId: ${orderItem.itemId},
                 variantId: ${orderItem.variantId}`
              );
            }
          } else {
            console.warn(`Inventory document not found for itemId:
             ${orderItem.itemId}`);
          }
        }

        // Delete the order after restocking
        batch.delete(orderDoc.ref);
        opCounts++;

        if (opCounts >= BATCH_LIMIT) {
          batch = await commitBatch(batch, opCounts);
          opCounts = 0;
        }
      }

      // Commit any remaining operations
      if (opCounts > 0) {
        await batch.commit();
        console.log(`Committed the final batch of ${opCounts} operations.`);
      }

      console.log("Scheduled Firestore cleanup and" +
                " deletion completed successfully.");
      return null;
    } catch (error) {
      console.error("Error during scheduledOrdersCleanup:", error);
      return null;
    }
  });

/**
 * Triggered function to handle order payment state changes.
 */
exports.onOrderPaymentStateChanges = functions.firestore
  .document("orders/{orderId}")
  .onWrite(async (change, context) => {
    const orderId = context.params.orderId;
    const orderData = change.after.exists ?
      (change.after.data() as Order) : null;
    const previousOrderData = change.before.exists ?
      (change.before.data() as Order) : null;

    if (!orderData) {
      return null; // Exit if order is deleted or no new data
    }

    const {paymentMethod, paymentStatus,
      items, customer, shippingCost} = orderData;
    const customerEmail = customer.email.trim();
    const total = calculateTotal(items, shippingCost);

    const templateData = {
      name: customer.name,
      orderId,
      items,
      shippingCost,
      total,
      paymentMethod,
    };

    try {
      // New COD order with Pending status
      if (!previousOrderData && paymentMethod ===
          PaymentMethod.COD && paymentStatus === PaymentStatus.Pending) {
        await Promise.all([
          sendEmail(customerEmail, "orderConfirmed", templateData),
          sendSMS(customer.phone, getOrderSuccess(orderId, total,
            customer.address, paymentMethod)),
          sendAdminSMS(adminNotify(orderId, paymentMethod, total)),
          sendAdminEmail("adminOrderNotify", templateData),
        ]);
        console.log(`Order confirmation sent for COD order ${orderId}`);
      }

      // Check if paymentStatus has changed from Pending to Failed
      if (
        previousOrderData &&
            paymentMethod === PaymentMethod.COD &&
            previousOrderData.paymentStatus === PaymentStatus.Pending &&
            paymentStatus === PaymentStatus.Failed
      ) {
        await Promise.all([
          sendEmail(customerEmail, "orderFailed", templateData),
          sendSMS(customer.phone,
            getOrderFailed(orderId, total, paymentMethod)),
        ]);
        console.log(`Order failed notification sent for COD order ${orderId}`);
      }

      // PayHere order updated to Paid
      if (
        previousOrderData &&
            paymentMethod === PaymentMethod.PayHere &&
            previousOrderData.paymentStatus === PaymentStatus.Pending &&
            paymentStatus === PaymentStatus.Paid
      ) {
        await Promise.all([
          sendEmail(customerEmail, "orderConfirmed", templateData),
          sendSMS(customer.phone,
            getOrderSuccess(orderId, total, customer.address, paymentMethod)),
          sendAdminSMS(adminNotify(orderId, paymentMethod, total)),
          sendAdminEmail("adminOrderNotify", templateData),
        ]);
        console.log(`Order confirmation sent for PayHere order ${orderId}`);
      }

      // PayHere order updated to Failed,
      // only if the status was previously Pending
      if (
        previousOrderData &&
            paymentMethod === PaymentMethod.PayHere &&
            previousOrderData.paymentStatus === PaymentStatus.Pending &&
            paymentStatus === PaymentStatus.Failed
      ) {
        await Promise.all([
          sendEmail(customerEmail, "orderFailed", templateData),
          sendSMS(customer.phone,
            getOrderFailed(orderId, total, paymentMethod)),
        ]);
        console.log(`Order failed notification
         sent for PayHere order ${orderId}`);
      }

      // Avoid sending duplicate notifications
      // if the payment status remains unchanged (e.g., already failed)
      if (
        previousOrderData &&
            paymentStatus === previousOrderData.paymentStatus
      ) {
        console.log(`No change in payment status for order ${orderId}. 
        No notification sent.`);
        return null;
      }
    } catch (error) {
      console.error(`Error processing order ${orderId}:`, error);
    }

    return null;
  });

