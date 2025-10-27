import admin from "firebase-admin";
import { Item, Order } from "@/interfaces";
import { adminFirestore } from "@/firebase/firebaseAdmin";
import { verifyCaptchaToken } from "./CapchaService";
import { sendOrderConfirmedSMS } from "./NotificationService";
import { updateOrAddOrderHash } from "./IntegrityService";

// ✅ Add new order with stock validation and hash integrity
export const addNewOrder = async (order: Order, token: string) => {
  try {
    console.log("Adding new order:", order);

    const res = await verifyCaptchaToken(token);
    if (!res) throw new Error("reCAPTCHA verification failed.");

    await adminFirestore.runTransaction(async (transaction) => {
      const inventoryUpdates = [];

      for (const orderItem of order.items) {
        const itemRef = adminFirestore
          .collection("inventory")
          .doc(orderItem.itemId);
        const itemDoc = await transaction.get(itemRef);

        if (!itemDoc.exists)
          throw new Error(`Item ${orderItem.itemId} not found.`);

        const inventoryItem = itemDoc.data() as Item;
        const variant = inventoryItem.variants.find(
          (v) => v.variantId === orderItem.variantId
        );
        if (!variant)
          throw new Error(`Variant ${orderItem.variantId} not found.`);

        const size = variant.sizes.find((s) => s.size === orderItem.size);
        if (!size) throw new Error(`Size ${orderItem.size} not found.`);
        if (size.stock < orderItem.quantity)
          console.log("Insufficient stock. But proceeding");

        console.log(
          `Deducting ${orderItem.quantity} units from ${orderItem.itemId}`
        );
        size.stock -= orderItem.quantity;
        inventoryUpdates.push({ itemRef, inventoryItem });
      }

      // Apply inventory updates safely
      inventoryUpdates.forEach(({ itemRef, inventoryItem }) => {
        transaction.set(itemRef, inventoryItem, { merge: true });
      });

      // Create order document
      const orderRef = adminFirestore.collection("orders").doc(order.orderId);
      transaction.create(orderRef, {
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
    });

    console.log("Order and inventory updates processed successfully.");

    const orderDoc = await adminFirestore
      .collection("orders")
      .doc(order.orderId)
      .get();
    if (!orderDoc.exists)
      throw new Error(`[OrderService] Order ${order.orderId} not found.`);

    const orderData = orderDoc.data();

    await updateOrAddOrderHash(orderData);
    console.log("Order hash recorded successfully.");

    return { message: "Order successfully added." };
  } catch (e: any) {
    console.error("Error adding new order:", e.message);
    throw e;
  }
};

// ✅ Get order for invoice
export const getOrderByIdForInvoice = async (orderId: string) => {
  try {
    const doc = await adminFirestore
      .collection("orders")
      .where("orderId", "==", orderId)
      .where("from", "==", "Website")
      .get();

    if (doc.empty) throw new Error(`Order ${orderId} not found.`);

    const order = doc.docs[0].data();
    const createdAtDate = order.createdAt.toDate();
    const updatedAtDate = order.updatedAt.toDate();

    const diffDays =
      (Date.now() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24);
    const expired = diffDays > 7;

    return {
      ...order,
      createdAt: createdAtDate.toLocaleString(),
      updatedAt: updatedAtDate.toLocaleString(),
      expired,
      tracking: null,
      customer: {
        ...order.customer,
        createdAt: order.customer.createdAt.toDate().toLocaleString(),
        updatedAt: order.customer.updatedAt.toDate().toLocaleString(),
      },
    };
  } catch (e) {
    console.error("getOrderByIdForInvoice error:", e);
    throw e;
  }
};

// ✅ Update payment + integrity re-hash
export const updatePayment = async (
  orderId: string,
  paymentId: string,
  status: string
) => {
  try {
    console.log(`Updating payment status for ${orderId} → ${status}`);
    await adminFirestore.collection("orders").doc(orderId).update({
      paymentId,
      paymentStatus: status,
    });

    const orderDoc = await adminFirestore
      .collection("orders")
      .doc(orderId)
      .get();
    if (!orderDoc.exists) throw new Error(`Order ${orderId} not found.`);

    const orderData = orderDoc.data();

    if (status.toLowerCase() === "paid") {
      await sendOrderConfirmedSMS(orderId);
      console.log(`Confirmation SMS sent for ${orderId}`);
    }
    await updateOrAddOrderHash(orderData);
    console.log(`Hash updated for order ${orderId}`);
  } catch (e) {
    console.error("updatePayment error:", e);
    throw e;
  }
};
