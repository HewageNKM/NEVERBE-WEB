import { Order } from "@/interfaces";
import { getIdToken } from "@/firebase/firebaseClient";
import axios from "axios";
import {
  getOrdersURL,
  KOKOInitiateURL,
  PAYHEREInitiateURL,
  postOrderURL,
  OTPRequestURL,
  OTPVerifyURL,
} from "@/app/urls";

/**
 * Add new order
 */
export const addNewOrder = async (newOrder: Order, captchaToken: string) => {
  try {
    const token = await getIdToken();
    const response = await axios.post(
      postOrderURL + "?captchaToken=" + captchaToken,
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
 * Get orders for a specific user
 */
export const getOrdersByUserId = async (userId: string) => {
  try {
    const token = await getIdToken();
    const response = await axios.get(getOrdersURL + "?userId=" + userId, {
      headers: { Authorization: `Bearer ${token}` },
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
    const response = await axios.post(KOKOInitiateURL, payload, {
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
    const response = await axios.post(PAYHEREInitiateURL, payload, {
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
    const response = await axios.post(
      OTPRequestURL,
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
      OTPVerifyURL,
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
