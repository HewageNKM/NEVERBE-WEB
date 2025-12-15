"use client";

import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import toast from "react-hot-toast";

import { AppDispatch, RootState } from "@/redux/store";
import { clearBag } from "@/redux/bagSlice/bagSlice";
import { BagItem } from "@/interfaces/BagItem";
import { Customer, Order } from "@/interfaces";
import {
  addNewOrder,
  initiateKOKOPayment,
  initiatePayHerePayment,
  requestOTP,
  verifyOTP,
  sendCODOrderNotifications,
} from "@/actions/orderAction";
import {
  calculateFee,
  calculateShippingCost,
  calculateSubTotal,
  calculateTotalDiscount,
  calculateTransactionFeeCharge,
  generateOrderId,
} from "@/util";

// Payment method IDs
const PAYMENT_METHOD_IDS = {
  COD: "PM-001",
  PAYHERE: "PM-003",
  KOKO: "PM-006",
} as const;

interface PaymentTotals {
  subtotal: number;
  itemDiscount: number;
  couponDiscount: number;
  shippingFee: number;
  paymentFee: number;
  total: number;
}

interface OTPState {
  showModal: boolean;
  pendingOrder: Order | null;
  isVerifying: boolean;
  isResending: boolean;
  cooldown: number;
}

interface UsePaymentOptions {
  paymentMethodId: string;
  paymentMethodName: string;
  paymentFee: number;
}

interface UsePaymentReturn {
  // State
  isProcessing: boolean;
  error: string | null;
  orderId: string;
  otpState: OTPState;

  // Totals
  calculateTotals: (
    bagItems: BagItem[],
    couponDiscount: number
  ) => PaymentTotals;

  // Order building
  buildOrderPayload: (
    customer: Customer,
    bagItems: BagItem[],
    totals: PaymentTotals,
    userId: string | null
  ) => Order;

  // Payment processing
  processPayment: (order: Order, customer: Customer) => Promise<void>;

  // OTP handlers
  handleOTPVerification: (otp: string) => Promise<void>;
  handleResendOTP: (phoneNumber: string) => Promise<void>;
  closeOTPModal: () => void;
}

/**
 * usePayment - Centralized hook for all checkout payment logic
 * Handles PayHere, KOKO, and COD payment flows
 */
export const usePayment = (options: UsePaymentOptions): UsePaymentReturn => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const couponDiscount = useSelector(
    (state: RootState) => state.bagSlice.couponDiscount
  );
  const couponCode = useSelector(
    (state: RootState) => state.bagSlice.couponCode
  );

  // State
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId] = useState(generateOrderId());

  // OTP state for COD
  const [otpState, setOtpState] = useState<OTPState>({
    showModal: false,
    pendingOrder: null,
    isVerifying: false,
    isResending: false,
    cooldown: 0,
  });

  /**
   * Calculate all order totals
   */
  const calculateTotals = useCallback(
    (bagItems: BagItem[], couponDisc: number): PaymentTotals => {
      const itemDiscount = calculateTotalDiscount(bagItems);
      const shippingFee = calculateShippingCost(bagItems);
      const paymentFee = calculateFee(options.paymentFee, bagItems);
      const subtotal = calculateSubTotal(bagItems, options.paymentFee);
      const total = subtotal - couponDisc;

      return {
        subtotal: subtotal - couponDisc,
        itemDiscount,
        couponDiscount: couponDisc,
        shippingFee,
        paymentFee,
        total,
      };
    },
    [options.paymentFee]
  );

  /**
   * Build order payload for submission
   */
  const buildOrderPayload = useCallback(
    (
      customer: Customer,
      bagItems: BagItem[],
      totals: PaymentTotals,
      userId: string | null
    ): Order => ({
      orderId,
      paymentId: "",
      userId: userId || "anonymous-user",
      customer,
      items: bagItems as any, // BagItem is compatible with OrderItem at runtime
      total: totals.total,
      paymentMethod: options.paymentMethodName,
      paymentMethodId: options.paymentMethodId,
      fee: totals.paymentFee,
      shippingFee: totals.shippingFee,
      transactionFeeCharge: calculateTransactionFeeCharge(
        bagItems,
        options.paymentFee
      ),
      paymentStatus: "Pending",
      status: "Processing",
      from: "Website",
      discount: totals.itemDiscount + totals.couponDiscount,
      couponCode: couponCode || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    [orderId, options, couponCode]
  );

  /**
   * Submit form to external payment gateway
   */
  const submitExternalForm = (
    action: string,
    payload: Record<string, string>
  ) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;
    form.style.display = "none";

    Object.entries(payload).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  /**
   * Process PayHere Payment
   */
  const processPayHere = async (order: Order, customer: Customer) => {
    const amountFormatted = parseFloat((order.total ?? 0).toString())
      .toLocaleString("en-US", { minimumFractionDigits: 2 })
      .replace(/,/g, "");

    const [firstName, ...lastNameParts] = customer.name.split(" ");
    const payload = {
      orderId: order.orderId,
      amount: amountFormatted,
      firstName,
      lastName: lastNameParts.join(" ") || firstName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      items: `${order.items.length} Products`,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success/${order.orderId}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/fail?orderId=${order.orderId}`,
      notifyUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ipg/payhere/notify`,
    };

    const payherePayload = await initiatePayHerePayment(payload);
    submitExternalForm(
      process.env.NEXT_PUBLIC_PAYHERE_URL || "",
      payherePayload
    );
  };

  /**
   * Process KOKO Payment
   */
  const processKOKO = async (order: Order, customer: Customer) => {
    const amountFormatted = parseFloat((order.total ?? 0).toString())
      .toLocaleString("en-US", { minimumFractionDigits: 2 })
      .replace(/,/g, "");

    const [firstName, ...lastNameParts] = customer.name.split(" ");
    const payload = {
      orderId: order.orderId,
      amount: amountFormatted,
      firstName,
      lastName: lastNameParts.join(" ") || firstName,
      email: customer.email,
      description: `${order.items.length} products`,
    };

    const kokoPayload = await initiateKOKOPayment(payload);
    submitExternalForm(
      process.env.NEXT_PUBLIC_KOKO_REDIRECT_URL || "",
      kokoPayload
    );
  };

  /**
   * Process COD Payment - initiates OTP flow
   */
  const processCOD = async (order: Order, customer: Customer) => {
    if (!executeRecaptcha) {
      throw new Error("Recaptcha not ready");
    }

    const token = await executeRecaptcha("request_otp");
    await requestOTP(customer.phone, token);

    setOtpState({
      showModal: true,
      pendingOrder: order,
      isVerifying: false,
      isResending: false,
      cooldown: 60,
    });

    // Start cooldown timer
    const timer = setInterval(() => {
      setOtpState((prev) => {
        if (prev.cooldown <= 1) {
          clearInterval(timer);
          return { ...prev, cooldown: 0 };
        }
        return { ...prev, cooldown: prev.cooldown - 1 };
      });
    }, 1000);

    toast.success("OTP sent successfully!");
  };

  /**
   * Main payment processor - routes to appropriate handler
   */
  const processPayment = useCallback(
    async (order: Order, customer: Customer) => {
      if (!executeRecaptcha) {
        setError("Recaptcha not ready");
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        const token = await executeRecaptcha("new_order");

        switch (options.paymentMethodId?.toUpperCase()) {
          case PAYMENT_METHOD_IDS.KOKO:
            await addNewOrder(order, token);
            dispatch(clearBag());
            await processKOKO(order, customer);
            break;

          case PAYMENT_METHOD_IDS.COD:
            await processCOD(order, customer);
            break;

          case PAYMENT_METHOD_IDS.PAYHERE:
            await addNewOrder(order, token);
            dispatch(clearBag());
            await processPayHere(order, customer);
            break;

          default:
            throw new Error("Invalid payment method selected");
        }
      } catch (err: any) {
        console.error("Payment Error:", err);
        setError(err.message || "Payment failed");
        toast.error("Payment failed. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    },
    [executeRecaptcha, options.paymentMethodId, dispatch]
  );

  /**
   * Handle OTP verification for COD
   */
  const handleOTPVerification = useCallback(
    async (otp: string) => {
      if (!otpState.pendingOrder || !executeRecaptcha) return;

      setOtpState((prev) => ({ ...prev, isVerifying: true }));

      try {
        await verifyOTP(otpState.pendingOrder.customer.phone, otp);

        const token = await executeRecaptcha("finalize_cod");
        await addNewOrder(otpState.pendingOrder, token);
        await sendCODOrderNotifications(otpState.pendingOrder.orderId!, token);

        dispatch(clearBag());
        router.replace(`/checkout/success/${otpState.pendingOrder.orderId}`);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Invalid OTP");
      } finally {
        setOtpState((prev) => ({ ...prev, isVerifying: false }));
      }
    },
    [otpState.pendingOrder, executeRecaptcha, dispatch, router]
  );

  /**
   * Handle OTP resend
   */
  const handleResendOTP = useCallback(
    async (phoneNumber: string) => {
      if (!executeRecaptcha) {
        toast.error("Recaptcha not ready");
        return;
      }

      setOtpState((prev) => ({ ...prev, isResending: true }));

      try {
        const token = await executeRecaptcha("request_otp");
        await requestOTP(phoneNumber, token);
        setOtpState((prev) => ({ ...prev, cooldown: 60 }));

        // Start cooldown timer
        const timer = setInterval(() => {
          setOtpState((prev) => {
            if (prev.cooldown <= 1) {
              clearInterval(timer);
              return { ...prev, cooldown: 0 };
            }
            return { ...prev, cooldown: prev.cooldown - 1 };
          });
        }, 1000);

        toast.success("OTP sent successfully!");
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to send OTP");
      } finally {
        setOtpState((prev) => ({ ...prev, isResending: false }));
      }
    },
    [executeRecaptcha]
  );

  /**
   * Close OTP modal
   */
  const closeOTPModal = useCallback(() => {
    setOtpState({
      showModal: false,
      pendingOrder: null,
      isVerifying: false,
      isResending: false,
      cooldown: 0,
    });
  }, []);

  return {
    isProcessing,
    error,
    orderId,
    otpState,
    calculateTotals,
    buildOrderPayload,
    processPayment,
    handleOTPVerification,
    handleResendOTP,
    closeOTPModal,
  };
};

export default usePayment;
