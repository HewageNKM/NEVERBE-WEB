import { adminFirestore } from "@/firebase/firebaseAdmin";
import { sendOrderConfirmedSMS } from "./NotificationService";
import { updateOrAddOrderHash } from "./IntegrityService";
import { toSafeLocaleString } from "./UtilService";
import { FieldValue } from "firebase-admin/firestore";

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

    const diffDays =
      (Date.now() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24);
    const expired = diffDays > 7;

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
    console.error("getOrderByIdForInvoice error:", e);
    throw e;
  }
};

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
      updatedAtL: FieldValue.serverTimestamp(),
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
