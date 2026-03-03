import { Order } from "@/interfaces/Order";
import { getIdToken } from "@/firebase/firebaseClient";
import axiosInstance from "./axiosInstance";

/**
 * Add new order
 */
export const addNewOrder = async (newOrder: Order, captchaToken: string) => {
  try {
    const token = await getIdToken();
    const response = await axiosInstance.post("/web/orders", newOrder, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
    const response = await axiosInstance.post(
      "/web/ipg/koko/initiate",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

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
    const response = await axiosInstance.post(
      "/web/ipg/payhere/initiate",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

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
    const response = await axiosInstance.post(
      "/web/otp",
      { phoneNumber, captchaToken },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
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
    const response = await axiosInstance.post(
      "/web/otp/verify",
      { phoneNumber, otp },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
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
  capchaToken: string,
) => {
  try {
    const token = await getIdToken();
    const response = await axiosInstance.get(
      `/web/orders/${orderId}/cod/notifications?capchaToken=${capchaToken}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (e) {
    throw e;
  }
};

export const getOrderByIdForInvoice = async (orderId: string) => {
  try {
    const res = await axiosInstance.get(`/web/orders/${orderId}`);
    const data = res.data;
    return data.data || data;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    return null;
  }
};
