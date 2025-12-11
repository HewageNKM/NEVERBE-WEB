import { Order } from "@/interfaces";
import { getIdToken } from "@/firebase/firebaseClient";

/**
 * Add new order
 */
export const addNewOrder = async (newOrder: Order, captchaToken: string) => {
  try {
    const token = await getIdToken();
    const response = await fetch("https://erp.neverbe.lk/api/v2/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    throw e;
  }
};

/**
 * Initiate KOKO Payment
 */
export const initiateKOKOPayment = async (payload: any) => {
  try {
    const token = await getIdToken();
    const response = await fetch("/api/v1/ipg/koko/initiate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    throw e;
  }
};

/**
 * Initiate PayHere Payment
 */
export const initiatePayHerePayment = async (payload: any) => {
  try {
    const token = await getIdToken();
    const response = await fetch("/api/v1/ipg/payhere/initiate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    throw e;
  }
};

/**
 * Request OTP for COD verification
 */
export const requestOTP = async (phoneNumber: string, captchaToken: string) => {
  try {
    const token = await getIdToken();
    const response = await fetch("/api/v1/otp", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, captchaToken }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    throw e;
  }
};

/**
 * Verify OTP for COD
 */
export const verifyOTP = async (phoneNumber: string, otp: string) => {
  try {
    const token = await getIdToken();
    const response = await fetch("/api/v1/otp/verify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, otp }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    throw e;
  }
};

/**
 * Send Notifications for COD
 */

export const sendCODOrderNotifications = async (
  orderId: string,
  capchaToken: string
) => {
  try {
    const token = await getIdToken();
    const response = await fetch(
      `/api/v1/orders/${orderId}/cod/notifications?capchaToken=${capchaToken}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    throw e;
  }
};
