import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Order, OrderItem } from "@/interfaces";

import crypto from "crypto";
import { getOrderByIdForInvoice } from "./OrderService";
import { verifyCaptchaToken } from "./CapchaService";

const TEXT_API_KEY = process.env.TEXT_API_KEY;
const OTP_COLLECTION = "otp_verifications";
const OTP_EXPIRY_MINUTES = 5;
const NOTIFICATION_TRACKER = "notifications_sent";
const OTP_TTL_DAYS = 1;
const COOLDOWN_SECONDS = 60;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/** Generate a 6-digit OTP */
const generateOTP = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("[OTP] Generated OTP:", otp);
  return otp;
};

/** Hash OTP using SHA256 */
const hashOTP = (otp: string): string => {
  const hashed = crypto.createHash("sha256").update(otp).digest("hex");
  console.log("[OTP] Hashed OTP:", hashed);
  return hashed;
};

/** Generate SHA256 hash for content (duplicate prevention) */
const generateHash = (input: string): string => {
  const hashed = crypto.createHash("sha256").update(input).digest("hex");
  console.log("[Hash] Generated hash for input:", input, "Hash:", hashed);
  return hashed;
};

/** Calculate subtotal */
export const calculateTotal = (items: OrderItem[]): number =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

/** Send COD verification OTP with CAPTCHA and rate limiting */
export const sendCODVerificationOTP = async (
  phone: string,
  captchaToken: string
) => {
  try {
    console.log(`[OTP Service] sendCODVerificationOTP called for ${phone}`);

    if (!TEXT_API_KEY) throw new Error("Missing TEXT_API_KEY");
    if (!phone || !captchaToken)
      throw new Error("Missing phone number or CAPTCHA token");

    const captchaResponse = await verifyCaptchaToken(captchaToken);
    console.log("[OTP Service] CAPTCHA verification result:", captchaResponse);
    if (!captchaResponse) {
      console.warn(`[OTP Service] CAPTCHA verification failed for ${phone}`);
      return {
        success: false,
        message: "CAPTCHA verification failed. Please try again.",
      };
    }

    const now = new Date();

    const latestOtpQuery = await adminFirestore
      .collection(OTP_COLLECTION)
      .where("phone", "==", phone)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (!latestOtpQuery.empty) {
      const lastOtpData = latestOtpQuery.docs[0].data();
      const lastRequestTime = lastOtpData.createdAt.toDate();
      const secondsSinceLastRequest =
        (now.getTime() - lastRequestTime.getTime()) / 1000;

      if (secondsSinceLastRequest < COOLDOWN_SECONDS) {
        console.warn(`[OTP Service] Cooldown active for ${phone}`);
        return {
          success: false,
          message: `Please wait ${Math.ceil(
            COOLDOWN_SECONDS - secondsSinceLastRequest
          )} seconds before requesting a new code.`,
        };
      }

      if (!lastOtpData.verified && lastOtpData.expiresAt.toDate() > now) {
        console.warn(`[OTP Service] Active OTP already exists for ${phone}`);
        return {
          success: false,
          message:
            "An active OTP has already been sent. Please check your SMS.",
        };
      }
    }

    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60000);

    console.log(`[OTP Service] Storing OTP in Firestore for ${phone}`);
    await adminFirestore.collection(OTP_COLLECTION).add({
      phone,
      otpHash,
      createdAt: now,
      expiresAt,
      verified: false,
      attempts: 0,
      ttl: new Date(now.getTime() + OTP_TTL_DAYS * 24 * 60 * 60 * 1000),
    });

    const text = `Your verification code is ${otp}. Valid for 5 minutes.`;
    console.log(`[OTP Service] Sending SMS via API to ${phone}: ${text}`);

    const response = await fetch("https://api.textit.biz/", {
      method: "POST",
      headers: {
        Authorization: `Basic ${TEXT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: phone, text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`[OTP Service] OTP sent successfully to ${phone}`);
    return { success: true, message: "OTP sent successfully." };
  } catch (error) {
    console.error(`[OTP Service] Failed to send OTP for ${phone}:`, error);
    return { success: false, message: "Failed to send OTP." };
  }
};

/** Verify the latest OTP for a phone */
export const verifyCODOTP = async (phone: string, otp: string) => {
  try {
    console.log(`[OTP Service] verifyCODOTP called for ${phone}`);

    if (!phone || !otp) throw new Error("Missing phone or OTP");

    const otpHash = hashOTP(otp);
    const now = new Date();

    const snapshot = await adminFirestore
      .collection(OTP_COLLECTION)
      .where("phone", "==", phone)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.warn(`[OTP Service] No OTP found for ${phone}`);
      return { success: false, message: "No OTP found for this number." };
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    if (data.verified) {
      console.warn(`[OTP Service] OTP already verified for ${phone}`);
      return { success: false, message: "OTP already verified." };
    }
    if (now > data.expiresAt.toDate()) {
      console.warn(`[OTP Service] OTP expired for ${phone}`);
      return { success: false, message: "OTP expired." };
    }
    if (data.otpHash !== otpHash) {
      const newAttempts = (data.attempts || 0) + 1;
      await doc.ref.update({ attempts: newAttempts });
      console.warn(
        `[OTP Service] Invalid OTP entered for ${phone}, attempts: ${newAttempts}`
      );
      return { success: false, message: "Invalid OTP." };
    }

    await doc.ref.update({ verified: true, verifiedAt: now });
    console.log(`[OTP Service] OTP verified successfully for ${phone}`);
    return { success: true, message: "OTP verified successfully." };
  } catch (error) {
    console.error(`[OTP Service] OTP verification failed for ${phone}:`, error);
    return { success: false, message: "OTP verification failed." };
  }
};

/** Send Predefined Order Confirmation SMS (Prevents duplicates using hash) */
export const sendOrderConfirmedSMS = async (orderId: string) => {
  try {
    console.log(
      `[Notification Service] sendOrderConfirmedSMS called for order: ${orderId}`
    );

    if (!TEXT_API_KEY) {
      console.warn(`[Notification Service] Missing TEXT_API_KEY`);
      return false;
    }

    const order: Order = await getOrderByIdForInvoice(orderId);
    if (!order?.customer?.phone) {
      console.warn(
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

    const customerName = order.customer.name.split(" ")[0];
    const invoiceDownloadUrl = `${BASE_URL}/checkout/success/${orderId}`;
    const text = `✅ Hi ${customerName}, your order #${orderId.toUpperCase()} totaling Rs.${total.toFixed(
      2
    )} has been received by NEVERBE to be processed. Download your invoice (valid 7 days): ${invoiceDownloadUrl}`;

    const hashValue = generateHash(phone + text);

    const existing = await adminFirestore
      .collection(NOTIFICATION_TRACKER)
      .where("orderId", "==", orderId)
      .where("hashValue", "==", hashValue)
      .where("type", "==", "sms")
      .get();

    if (!existing.empty) {
      console.warn(
        `[Notification Service] Duplicate SMS detected for order: ${orderId}`
      );
      return false;
    }

    const response = await fetch("https://api.textit.biz/", {
      method: "POST",
      headers: {
        Authorization: `Basic ${TEXT_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({ to: phone, text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(
      `[Notification Service] SMS sent for order ${orderId} to ${phone}`
    );

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
