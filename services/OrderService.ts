import admin from "firebase-admin";
import { Item, Order } from "@/interfaces";
import { adminFirestore } from "@/firebase/firebaseAdmin";
import { verifyCaptchaToken } from "./CapchaService";
import {
  sendOrderConfirmedSMS,
} from "./NotificationService";

// Function to add a new order, update inventory, and handle stock checks
export const addNewOrder = async (order: Order, token: string) => {
  try {
    console.log("Adding new order:", order);
    const res = await verifyCaptchaToken(token);
    if (!res) {
      throw new Error("reCAPTCHA verification failed.");
    }

    await adminFirestore.runTransaction(async (transaction) => {
      const inventoryUpdates = [];

      for (const orderItem of order.items) {
        console.log(
          `Checking inventory for item: ${orderItem.itemId}, variant: ${orderItem.variantId}`
        );

        const itemRef = adminFirestore
          .collection("inventory")
          .doc(orderItem.itemId);
        const itemDoc = await transaction.get(itemRef);

        // Check if the item exists
        if (!itemDoc.exists) {
          throw new Error(`Item with ID ${orderItem.itemId} does not exist.`);
        }

        const inventoryItem = itemDoc.data() as Item;

        // Check if the variant exists
        const variant = inventoryItem.variants.find(
          (v) => v.variantId === orderItem.variantId
        );
        if (!variant) {
          throw new Error(
            `Variant with ID ${orderItem.variantId} does not exist for item ${orderItem.itemId}.`
          );
        }

        // Check if the size exists and has sufficient stock
        const size = variant.sizes.find((s) => s.size === orderItem.size);
        if (!size) {
          throw new Error(
            `Size ${orderItem.size} does not exist for variant ${orderItem.variantId}.`
          );
        }

        if (size.stock < orderItem.quantity) {
          throw new Error("Insufficient Stock");
        }

        console.log(
          `Sufficient stock found. Deducting ${orderItem.quantity} units from stock.`
        );

        // Deduct the stock
        size.stock -= orderItem.quantity;

        // Collect updates for transaction
        inventoryUpdates.push({ itemRef, inventoryItem });
      }

      // Update inventory within the transaction
      inventoryUpdates.forEach(({ itemRef, inventoryItem }) => {
        transaction.set(itemRef, inventoryItem);
      });

      console.log("Inventory updates queued.");

      // Add the order to the `orders` collection
      const orderRef = adminFirestore.collection("orders").doc(order.orderId);
      transaction.set(orderRef, {
        ...order,
        customer: {
          ...order.customer,
          createdAt: admin.firestore.Timestamp.fromDate(
            new Date(order.customer.createdAt)
          ),
          updatedAt: admin.firestore.Timestamp.fromDate(
            new Date(order.customer.updatedAt)
          ),
        },
        createdAt: admin.firestore.Timestamp.fromDate(
          new Date(order.createdAt)
        ),
        updatedAt: admin.firestore.Timestamp.fromDate(
          new Date(order.updatedAt)
        ),
      });

      console.log("Order queued for creation.");
    });

    console.log("Order and inventory updates successfully processed.");

    return {
      message: "Order successfully added.",
    };
  } catch (e) {
    console.error("Error adding new order:", e.message);
    throw e;
  }
};
// services/OrderService.ts
export const getOrderByIdForInvoice = async (orderId: string) => {
  try {
    console.log(`Fetching order by ID: ${orderId}`);
    const doc = await adminFirestore
      .collection("orders")
      .where("orderId", "==", orderId)
      .where("from", "==", "Website")
      .get();

    if (doc.empty) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }

    const order = doc.docs[0].data();
    const createdAtDate = order.createdAt.toDate();
    const updatedAtDate = order.updatedAt.toDate();

    // --- Check expiration (older than 7 days)
    const now = new Date();
    const diffDays = (now.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24);
    const expired = diffDays > 7;

    return {
      ...order,
      createdAt: createdAtDate.toLocaleString(),
      updatedAt: updatedAtDate.toLocaleString(),
      tracking: null,
      expired,
      customer: {
        ...order.customer,
        createdAt: order.customer.createdAt.toDate().toLocaleString(),
        updatedAt: order.customer.updatedAt.toDate().toLocaleString(),
      },
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};


// Function to update the payment status of an order
export const updatePayment = async (
  orderId: string,
  paymentId: string,
  status: string
) => {
  try {
    console.log(`Updating payment status for order: ${orderId} to ${status}`);
    await adminFirestore.collection("orders").doc(orderId).update({
      paymentId: paymentId,
      paymentStatus: status,
    });
    if (status.toLocaleLowerCase() === "paid") {
      console.log(
        `[OrderService] Attempting to send order confirmation SMS for order: ${orderId}`
      );
      await sendOrderConfirmedSMS(order.orderId);
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};
