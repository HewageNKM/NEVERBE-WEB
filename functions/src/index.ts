import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import {adminNotify, getOrderFailed, getOrderSuccess} from "./SMSTemplates";

admin.initializeApp();

const db = admin.firestore();

// Interfaces
interface OrderItem {
    itemId: string;
    variantId: string;
    name: string;
    variantName: string;
    size: string;
    quantity: number;
    price: number;
}

export interface Order {
    orderId: string,
    paymentId: string,
    items: OrderItem[],
    paymentStatus: string,
    paymentMethod: string,
    shippingCost: number,
    customer: Customer,
    createdAt: Date,
    updatedAt: Date,
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Variant {
    variantId: string;
    variantName: string;
    images: string[];
    sizes: Size[];
}

export interface Item {
    itemId: string;
    type: string;
    brand: string;
    thumbnail: string;
    variants: Variant[];
    manufacturer: string;
    name: string;
    sellingPrice: number;
    discount: number;
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
}

export interface Size {
    size: string;
    stock: number;
}

// Cloud Function scheduled to run every hour
// Cloud Function scheduled to run every hour
exports.scheduledOrdersCleanup = functions.pubsub
  .schedule("every 1 hours")
  .onRun(async (context) => {
    try {
      const orderCollectionRef = db.collection("orders");
      const inventoryCollectionRef = db.collection("inventory");

      const twoHoursAgo = admin.firestore.Timestamp
        .fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000));

      // Fetch PayHere failed and pending orders
      const payhereFailedOrdersQuery = orderCollectionRef
        .where("paymentMethod", "==", "PayHere")
        .where("createdAt", "<=", twoHoursAgo)
        .where("paymentStatus", "in", ["Failed", "Pending"]);

      // Fetch COD failed orders
      const codFailedOrdersQuery = orderCollectionRef
        .where("paymentMethod", "==", "COD")
        .where("createdAt", "<=", twoHoursAgo)
        .where("paymentStatus", "==", "Failed");

      // Execute both queries in parallel
      const [payhereFailedOrders, codFailedOrders] = await Promise.all([
        payhereFailedOrdersQuery.get(),
        codFailedOrdersQuery.get(),
      ]);

      // Combine both query results
      const allFailedOrders =
                [...payhereFailedOrders.docs, ...codFailedOrders.docs];

      if (allFailedOrders.length === 0) {
        console.log("No failed orders to restock.");
        return null;
      }

      console.log(`Found ${allFailedOrders.length} 
      failed orders to restock and delete.`);

      let batch = db.batch();
      let opCounts = 0;
      const BATCH_LIMIT = 450;

      for (const orderDoc of allFailedOrders) {
        const orderData = orderDoc.data() as Order;
        const orderItems = orderData.items;

        for (const orderItem of orderItems) {
          const inventoryDocRef = inventoryCollectionRef.doc(orderItem.itemId);
          const inventoryDoc = await inventoryDocRef.get();

          if (inventoryDoc.exists) {
            const inventoryData = inventoryDoc.data() as Item;

            let variantFound = false;
            inventoryData.variants.forEach((variant) => {
              if (variant.variantId === orderItem.variantId) {
                variant.sizes.forEach((size) => {
                  if (size.size === orderItem.size) {
                    size.stock += orderItem.quantity;
                    variantFound = true;
                  }
                });
              }
            });

            if (variantFound) {
              batch.set(inventoryDocRef, inventoryData);
              opCounts += 1;

              if (opCounts >= BATCH_LIMIT) {
                // Commit the current batch and start a new one
                await batch.commit();
                console.log(`Committed a batch of ${opCounts} operations.`);
                batch = db.batch();
                opCounts = 0;
              }
            } else {
              console.warn(`Variant or size not found for itemId: 
              ${orderItem.itemId}, variantId: ${orderItem.variantId}, 
              size: ${orderItem.size}`);
            }
          } else {
            console.warn(`Inventory document not found for itemId:
             ${orderItem.itemId}`);
          }
        }

        // After restocking, delete the order
        batch.delete(orderDoc.ref); // Delete the order
        opCounts += 1;

        if (opCounts >= BATCH_LIMIT) {
          // Commit the current batch and start a new one
          await batch.commit();
          console.log(`Committed a batch of ${opCounts} operations.`);
          batch = db.batch();
          opCounts = 0;
        }
      }

      // Commit any remaining operations in the batch
      if (opCounts > 0) {
        await batch.commit();
        console.log(`Committed the final batch of ${opCounts} operations.`);
      }

      console.log("Scheduled Firestore cleanup and " +
                "deletion completed successfully.");
      return null;
    } catch (error) {
      console.error("Error during scheduledOrdersCleanup:", error);
      return null;
    }
  });


// Helper function to send email using the Firestore template
const sendClientEmail = async (
  to: string, templateName: string, templateData: object
) => {
  await db.collection("mail").add({
    to: to,
    template: {
      name: templateName,
      data: templateData,
    },
  });
};

const sendClientSMS = async (
  to: string, templateData: string
) => {
  await axios({
    method: "POST",
    url: "https://api.textit.biz/",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${process.env.TEXTITBIZ_API_KEY}`,
    },
    data: {
      to: to,
      text: templateData,
    },
  });
};

const sendAdminSMS = async (templateData:string) => {
  await axios({
    method: "POST",
    url: "https://api.textit.biz/",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${process.env.TEXTITBIZ_API_KEY}`,
    },
    data: {
      to: "94705208999",
      text: templateData,
    },
  });
};
const sendAdminEmail = async (templateData:object, templateName:string) => {
  await db.collection("mail").add({
    to: "info.neverbe@gmail.com",
    template: {
      name: templateName,
      data: templateData,
    },
  });
};
const getTotal = (items: OrderItem[]): number => {
  return items.reduce((total, item) => total + item.price, 0);
};

exports.onOrderPaymentStateChanges = functions.firestore
  .document("orders/{orderId}")
  .onWrite(async (change, context) => {
    const orderId = context.params.orderId;
    let orderData = null;
    let previousOrderData = null;

    try {
      orderData = change.after.exists ?
        (change.after.data() as Order) : null;
      previousOrderData = change.before.exists ?
        (change.before.data() as Order) : null;
    } catch (error) {
      console.error(`Error retrieving order data for orderId:
       ${orderId}`, error);
      return null; // Early exit if data retrieval fails
    }

    // If the order was deleted or there's no new data, exit
    if (!orderData) {
      return null;
    }

    const {
      paymentMethod, paymentStatus, items,
      customer, shippingCost,
    } = orderData;
    const customerEmail = customer.email.trim();

    const templateData = {
      name: customer.name,
      orderId: orderId,
      items: items,
      shippingCost: shippingCost,
      total: getTotal(items) + shippingCost,
      paymentMethod: paymentMethod,
    };

    try {
      // 1. Handle new COD order creation
      if (!previousOrderData && paymentMethod === "COD" &&
                paymentStatus === "Pending") {
        // New COD order created, send order confirmation email
        await sendClientEmail(customerEmail, "orderConfirmed", templateData);
        await sendClientSMS(customer.phone, getOrderSuccess(orderId,
          getTotal(items)+shippingCost, customer.address, paymentMethod));
        await sendAdminSMS(adminNotify(orderId, paymentMethod,
          getTotal(items)+shippingCost));
        await sendAdminEmail(templateData, "adminOrderNotify");
        console.log(`Order confirmation email sent for COD order ${orderId}`);
      }

      // 2. Handle COD order payment status update to Failed
      if (
        previousOrderData &&
                paymentMethod === "COD" &&
                previousOrderData.paymentStatus === "Pending" &&
                paymentStatus === "Failed"
      ) {
        // COD order payment status updated to 'Failed', send failed order email
        await sendClientEmail(customerEmail, "orderFailed", templateData);
        await sendClientSMS(customer.phone,
          getOrderFailed(orderId, getTotal(items)+shippingCost, paymentMethod));
        console.log(`Order failed email sent for COD order ${orderId}`);
      }

      // 3. Handle PayHere payment update to Paid
      if (
        previousOrderData &&
                paymentMethod === "PayHere" &&
                previousOrderData.paymentStatus === "Pending" &&
                paymentStatus === "Paid"
      ) {
        // PayHere order payment status updated to 'Paid',
        // send order confirmation email
        await sendClientEmail(customerEmail,
          "orderConfirmed", templateData);
        await sendClientSMS(customer.phone, getOrderSuccess(orderId,
          getTotal(items)+shippingCost, customer.address, paymentMethod));
        await sendAdminSMS(adminNotify(orderId, paymentMethod,
          getTotal(items)+shippingCost));
        await sendAdminEmail(templateData, "adminOrderNotify");
        console.log(`Order confirmation email sent for PayHere order
         ${orderId}`);
      }

      // 4. Handle PayHere payment update to Failed
      if (
        previousOrderData &&
                paymentMethod === "PayHere" &&
                previousOrderData.paymentStatus === "Pending" &&
                paymentStatus === "Failed"
      ) {
        // PayHere order payment status updated to 'Failed',
        // send failed order email
        await sendClientEmail(customerEmail, "orderFailed", templateData);
        await sendClientSMS(customer.phone,
          getOrderFailed(orderId, getTotal(items)+shippingCost, paymentMethod));
        console.log(`Order failed email sent for PayHere order ${orderId}`);
      }
    } catch (error) {
      console.error(`Error processing order ${orderId}:`, error);
      return null; // Ensures the function doesn't break on error
    }

    return null;
  });

