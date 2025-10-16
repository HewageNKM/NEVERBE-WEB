import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Order, OrderItem } from "@/interfaces";
import axios from "axios";
import crypto from "crypto";
import { getOrderById } from "./OrderService";

const TEXT_API_KEY = process.env.TEXT_API_KEY;
const OTP_COLLECTION = "otp_verifications";
const MAX_SMS_PER_DAY = 3;
const OTP_EXPIRY_MINUTES = 5;
const NOTIFICATION_TRACKER = "notifications_sent";
const OTP_TTL_DAYS = 1;
const MAIL_COLLECTION = "mail_queue";
const ORDER_CONFIRMED_TEMPLATE = "orderConfirmed";

/**
 * Generate a 6-digit OTP
 */
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash OTP using SHA256
 */
const hashOTP = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

/**
 * Helper: Generate SHA256 hash for content (consistent duplicate prevention)
 */
const generateHash = (input: string): string => {
  return crypto.createHash("sha256").update(input).digest("hex");
};

/**
 * Helper: Calculate subtotal
 */
export const calculateTotal = (items: OrderItem[]): number =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

/**
 * Send COD verification OTP (max 3/day, single active OTP)
 */
export const sendCODVerificationOTP = async (phone: string) => {
  try {
    if (!TEXT_API_KEY) throw new Error("Missing TEXT_API_KEY");
    if (!phone) throw new Error("Missing phone number");

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // Count OTPs sent today
    const otpQuery = await adminFirestore
      .collection(OTP_COLLECTION)
      .where("phone", "==", phone)
      .where("createdAt", ">=", startOfDay)
      .get();

    if (otpQuery.size >= MAX_SMS_PER_DAY) {
      console.log(`[OTP Service] Daily limit reached for ${phone}`);
      return { success: false, message: "Daily OTP limit reached." };
    }

    // Check for existing active OTP
    const activeOtpQuery = await adminFirestore
      .collection(OTP_COLLECTION)
      .where("phone", "==", phone)
      .where("verified", "==", false)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (!activeOtpQuery.empty) {
      const activeOtp = activeOtpQuery.docs[0].data();
      if (activeOtp.expiresAt.toDate() > now) {
        console.log(`[OTP Service] Active OTP already exists for ${phone}`);
        return {
          success: false,
          message: "An active OTP is already sent. Please check your SMS.",
        };
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60000);

    // Store OTP with TTL
    await adminFirestore.collection(OTP_COLLECTION).add({
      phone,
      otpHash,
      createdAt: now,
      expiresAt,
      verified: false,
      attempts: 0,
      ttl: new Date(now.getTime() + OTP_TTL_DAYS * 24 * 60 * 60 * 1000), // TTL field for automatic deletion
    });

    // Send SMS
    const text = `Your NEVERBE verification code is ${otp}. Valid for 5 minutes.`;
    await axios.post(
      "https://api.textit.biz/",
      { to: phone, text },
      {
        headers: {
          Authorization: `Basic ${TEXT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`[OTP Service] OTP sent successfully to ${phone}`);
    return { success: true, message: "OTP sent successfully." };
  } catch (error) {
    console.error(`[OTP Service] Failed to send OTP:`, error);
    return { success: false, message: "Failed to send OTP." };
  }
};

/**
 * Verify the latest OTP for a phone
 */
export const verifyCODOTP = async (phone: string, otp: string) => {
  try {
    if (!phone || !otp) throw new Error("Missing phone or OTP");

    const otpHash = hashOTP(otp);
    const now = new Date();

    // Get latest OTP for this phone
    const snapshot = await adminFirestore
      .collection(OTP_COLLECTION)
      .where("phone", "==", phone)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return { success: false, message: "No OTP found for this number." };
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    if (data.verified) {
      return { success: false, message: "OTP already verified." };
    }
    if (now > data.expiresAt.toDate()) {
      return { success: false, message: "OTP expired." };
    }
    if (data.otpHash !== otpHash) {
      const newAttempts = (data.attempts || 0) + 1;
      await doc.ref.update({ attempts: newAttempts });
      return { success: false, message: "Invalid OTP." };
    }

    // Mark as verified
    await doc.ref.update({
      verified: true,
      verifiedAt: now,
    });

    console.log(`[OTP Service] OTP verified for ${phone}`);
    return { success: true, message: "OTP verified successfully." };
  } catch (error) {
    console.error(`[OTP Service] OTP verification failed:`, error);
    return { success: false, message: "OTP verification failed." };
  }
};

/**
 * Send Order Confirmation Email (Prevents duplicates using hash)
 */
export const sendOrderConfirmationEmail = async (orderId: string) => {
  try {
    console.log(`[Notification Service] Checking email for order: ${orderId}`);

    //@ts-ignore
    const order: Order = await getOrderById(orderId);
    if (!order?.customer?.email) {
      console.log(
        `[Notification Service] Missing customer email for order: ${orderId}`
      );
      return false;
    }

    const customer = order.customer;
    const subTotal = calculateTotal(order.items);
    const total =
      subTotal +
      (order.fee || 0) +
      (order.shippingFee || 0) -
      (order.discount || 0);

    const address = `${customer.address || ""}, ${customer.city || ""}, ${
      customer.zip || ""
    }, ${customer.phone || ""}`.trim();

    const templateData = {
      name: customer.name,
      address,
      orderId: orderId.toUpperCase(),
      items: order.items || [],
      total,
      fee: order.fee || 0,
      shippingFee: order.shippingFee || 0,
      paymentMethod: order.paymentMethod || "",
      subTotal,
      discount: order.discount || 0,
    };

    const to = customer.email.toLowerCase().trim();
    const hashValue = generateHash(to + JSON.stringify(templateData));

    // Check duplicate
    const existing = await adminFirestore
      .collection(NOTIFICATION_TRACKER)
      .where("orderId", "==", orderId)
      .where("hashValue", "==", hashValue)
      .where("type", "==", "email")
      .get();

    if (!existing.empty) {
      console.log(
        `[Notification Service] Duplicate email detected for order: ${orderId}`
      );
      return false;
    }

    // Add to mail queue
    await adminFirestore.collection(MAIL_COLLECTION).add({
      to,
      template: {
        name: ORDER_CONFIRMED_TEMPLATE,
        data: templateData,
      },
    });

    // Log to tracking
    await adminFirestore.collection(NOTIFICATION_TRACKER).add({
      orderId,
      type: "email",
      to,
      hashValue,
      createdAt: new Date(),
    });

    console.log(
      `[Notification Service] Order confirmation email queued for ${orderId}`
    );
    return true;
  } catch (error) {
    console.error(
      `[Notification Service] Failed to send order confirmation email for ${orderId}:`,
      error
    );
    // Fail silently for frontend
    return false;
  }
};

/**
 * Send Predefined Order Confirmation SMS (Prevents duplicates using hash)
 */
export const sendOrderConfirmedSMS = async (orderId: string) => {
  try {
    if (!TEXT_API_KEY) {
      console.log(`[Notification Service] Missing TEXT_API_KEY`);
      return false;
    }

    console.log(`[Notification Service] Preparing SMS for order: ${orderId}`);

    //@ts-ignore
    const order: Order = await getOrderById(orderId);
    if (!order?.customer?.phone) {
      console.log(
        `[Notification Service] Missing customer phone for order: ${orderId}`
      );
      return false;
    }

    const phone = order.customer.phone.trim();
    const total =
      calculateTotal(order.items) +
      (order.fee || 0) +
      (order.shippingFee || 0) -
      (order.discount || 0);

    const text = `Order confirmed! 🛍️ Your order #${orderId.toUpperCase()} totaling Rs.${total.toFixed(
      2
    )} has been received by NEVERBE. Thank you for shopping with us!`;

    const hashValue = generateHash(phone + text);

    // Check duplicate
    const existing = await adminFirestore
      .collection(NOTIFICATION_TRACKER)
      .where("orderId", "==", orderId)
      .where("hashValue", "==", hashValue)
      .where("type", "==", "sms")
      .get();

    if (!existing.empty) {
      console.log(
        `[Notification Service] Duplicate SMS detected for order: ${orderId}`
      );
      return false;
    }

    // Send SMS
    try {
      await axios.post(
        "https://api.textit.biz/",
        { to: phone, text },
        {
          headers: {
            Authorization: `Basic ${TEXT_API_KEY}`,
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
      console.log(`[Notification Service] SMS sent for ${orderId} to ${phone}`);
    } catch (smsError) {
      console.error(
        `[Notification Service] Failed to send SMS for ${orderId}:`,
        smsError
      );
      // Fail silently
      return false;
    }

    // Log to Firestore
    await adminFirestore.collection(NOTIFICATION_TRACKER).add({
      orderId,
      type: "sms",
      to: phone,
      hashValue,
      createdAt: new Date(),
    });

    return true;
  } catch (error) {
    console.error(
      `[Notification Service] Failed to queue SMS for order ${orderId}:`,
      error
    );
    return false;
  }
};
