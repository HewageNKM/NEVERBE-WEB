import { Order } from "@/interfaces";
import { getIdToken } from "@/firebase/firebaseClient";
import axios from "axios";

/**
 * Add new order
 */
export const addNewOrder = async (newOrder: Order, captchaToken: string) => {
  try {
    const token = await getIdToken();
    const response = await axios.post(
      "https://erp.neverbe.lk/api/v2/orders",
      JSON.stringify(newOrder),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
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
    const response = await axios.post("/api/v1/ipg/koko/initiate", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
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
    const response = await axios.post("/api/v1/ipg/payhere/initiate", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
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
    const response = await axios.post("/api/v1/otp",
      { phoneNumber, captchaToken },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
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
    const response = await axios.post(
      "/api/v1/otp/verify",
      { phoneNumber, otp },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
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
    const response = await axios.get(
      `/api/v1/orders/${orderId}/cod/notifications?capchaToken=${capchaToken}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (e) {
    throw e;
  }
};
