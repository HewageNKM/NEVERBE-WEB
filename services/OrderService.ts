import { adminFirestore } from "@/firebase/firebaseAdmin";
import {
  sendOrderConfirmedEmail,
  sendOrderConfirmedSMS,
} from "./NotificationService";
import { updateOrAddOrderHash } from "./IntegrityService";
import { toSafeLocaleString } from "./UtilService";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Fetch an order by ID for invoice purposes
 */
export const getOrderByIdForInvoice = async (orderId: string) => {
  try {
    console.log(`[OrderService] Fetching order by ID: ${orderId}`);

    const doc = await adminFirestore
      .collection("orders")
      .where("orderId", "==", orderId)
      .where("from", "==", "Website")
      .get();

    if (doc.empty) {
      console.warn(`[OrderService] Order ${orderId} not found.`);
      throw new Error(`Order ${orderId} not found.`);
    }

    const order = doc.docs[0].data();
    console.log(`[OrderService] Order fetched:`, order);

    const createdAtDate = order.createdAt.toDate();
    const diffDays =
      (Date.now() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24);
    const expired = diffDays > 7;
    console.log(`[OrderService] Order expired: ${expired}`);

    return {
      ...order,
      createdAt: toSafeLocaleString(order.createdAt),
      updatedAt: toSafeLocaleString(order.updatedAt),
      expired,
      customer: {
        ...order.customer,
        createdAt: toSafeLocaleString(order.customer.createdAt),
        updatedAt: toSafeLocaleString(order.customer.updatedAt),
      },
    };
  } catch (e) {
    console.error(
      `[OrderService] getOrderByIdForInvoice error for ${orderId}:`,
      e
    );
    throw e;
  }
};

/**
 * Update payment status and handle post-payment actions
 */
export const updatePayment = async (
  orderId: string,
  paymentId: string,
  status: string
) => {
  try {
    console.log(
      `[OrderService] Updating payment for order ${orderId} → ${status}`
    );

    await adminFirestore.collection("orders").doc(orderId).update({
      paymentId,
      paymentStatus: status,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const orderDoc = await adminFirestore
      .collection("orders")
      .doc(orderId)
      .get();
    if (!orderDoc.exists) {
      console.warn(`[OrderService] Order ${orderId} not found after update.`);
      throw new Error(`Order ${orderId} not found.`);
    }

    const orderData = orderDoc.data();
    console.log(`[OrderService] Payment updated in Firestore for ${orderId}`);

    if (status.toLowerCase() === "paid") {
      console.log(`[OrderService] Sending confirmation SMS for ${orderId}`);
      await sendOrderConfirmedSMS(orderId);
      console.log(`[OrderService] Confirmation SMS sent for ${orderId}`);
      await sendOrderConfirmedEmail(orderId);
      console.log(`[OrderService] Confirmation Email sent for ${orderId}`);
    }

    console.log(`[OrderService] Updating order hash for ${orderId}`);
    await updateOrAddOrderHash(orderData);
    console.log(`[OrderService] Hash updated successfully for ${orderId}`);
  } catch (e) {
    console.error(`[OrderService] updatePayment error for ${orderId}:`, e);
    throw e;
  }
};
