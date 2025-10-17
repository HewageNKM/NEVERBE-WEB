import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Order, OrderItem } from "@/interfaces";
import axios from "axios";
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
 * Send COD verification OTP with CAPTCHA and time-based rate limiting.
 * The function now requires a captchaToken from the frontend.
 */
export const sendCODVerificationOTP = async (
  phone: string,
  captchaToken: string
) => {
  try {
    if (!TEXT_API_KEY) throw new Error("Missing TEXT_API_KEY");
    if (!phone || !captchaToken)
      throw new Error("Missing phone number or CAPTCHA token");

    const captchaResponse = verifyCaptchaToken(captchaToken);
    if (!captchaResponse) {
      console.log(`[OTP Service] CAPTCHA verification failed for ${phone}`);
      return {
        success: false,
        message: "CAPTCHA verification failed. Please try again.",
      };
    }

    const now = new Date();

    // Get the most recent OTP request for this number to check the cooldown
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

      // 2. Enforce a cooldown period to prevent rapid requests
      if (secondsSinceLastRequest < COOLDOWN_SECONDS) {
        console.log(`[OTP Service] Cooldown active for ${phone}`);
        return {
          success: false,
          message: `Please wait ${Math.ceil(
            COOLDOWN_SECONDS - secondsSinceLastRequest
          )} seconds before requesting a new code.`,
        };
      }

      // 3. Check for an existing *active* OTP (same logic as before)
      if (!lastOtpData.verified && lastOtpData.expiresAt.toDate() > now) {
        console.log(`[OTP Service] Active OTP already exists for ${phone}`);
        return {
          success: false,
          message:
            "An active OTP has already been sent. Please check your SMS.",
        };
      }
    }

    // All checks passed, generate and send a new OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60000);

    await adminFirestore.collection(OTP_COLLECTION).add({
      phone,
      otpHash,
      createdAt: now,
      expiresAt,
      verified: false,
      attempts: 0,
      ttl: new Date(now.getTime() + OTP_TTL_DAYS * 24 * 60 * 60 * 1000),
    });

    const text = `Your order verification code is ${otp}. Valid for 5 minutes.`;
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
    const order: Order = await getOrderByIdForInvoice(orderId);
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

    const customerName = order.customer.name.split(" ")[0];

    const invoiceDownloadUrl = `${BASE_URL}/checkout/success?orderId=${orderId}`;
    const text = `✅ Hi ${customerName}, your order #${orderId.toUpperCase()} totaling Rs.${total.toFixed(
      2
    )} has been received by NEVERBE to be processed. Download your invoice (valid 7 days): ${invoiceDownloadUrl}`;

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
