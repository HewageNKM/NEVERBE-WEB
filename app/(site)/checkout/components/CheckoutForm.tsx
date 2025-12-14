"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { clearBag } from "@/redux/bagSlice/bagSlice";
import { FiX } from "react-icons/fi";
import {
  calculateFee,
  calculateShippingCost,
  calculateSubTotal,
  calculateTotalDiscount,
  calculateTransactionFeeCharge,
  generateOrderId,
} from "@/util";
import {
  addNewOrder,
  initiateKOKOPayment,
  initiatePayHerePayment,
  requestOTP,
  sendCODOrderNotifications,
  verifyOTP,
} from "@/actions/orderAction";
import BillingDetails from "./BillingDetails";
import ShippingDetails from "./ShippingDetails";
import PaymentDetails from "@/app/(site)/checkout/components/PaymentDetails";
import ComponentLoader from "@/components/ComponentLoader";
import toast from "react-hot-toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Order, Customer } from "@/interfaces";
const formatSriLankanPhoneNumber = (phone: string) => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // If it starts with 0 (e.g., 0771234567), replace 0 with +94
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return `+94${cleaned.slice(1)}`;
  }

  // If it's already in 94 format (e.g., 94771234567), add +
  if (cleaned.startsWith("94") && cleaned.length === 11) {
    return `+${cleaned}`;
  }

  // If it's a 9 digit number without prefix (e.g. 771234567), add +94
  if (cleaned.length === 9) {
    return `+94${cleaned}`;
  }

  return phone;
};

const createCustomerFromForm = (form: any): Customer => {
  const name = `${form.first_name.value} ${form.last_name.value}`;
  return {
    name,
    email: form.email.value,
    phone: formatSriLankanPhoneNumber(form.phone.value),
    address: form.address.value,
    city: form.city.value,
    zip: form.zip.value || "",
    id: window.crypto.randomUUID().toLowerCase(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const CheckoutForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const bagItems = useSelector((state: RootState) => state.bagSlice.bag);
  const couponDiscount = useSelector(
    (state: RootState) => state.bagSlice.couponDiscount
  );
  const couponCode = useSelector(
    (state: RootState) => state.bagSlice.couponCode
  );
  const user = useSelector((state: RootState) => state.authSlice.user);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [paymentType, setPaymentType] = useState<string>("");
  const [paymentTypeId, setPaymentTypeId] = useState<string>("");
  const [paymentFee, setPaymentFee] = useState<number>(0);
  const [shippingSameAsBilling, setShippingSameAsBilling] = useState(true);
  const [saveAddress, setSaveAddress] = useState(true);

  // Initialize billing customer with user data if available
  const initialCustomerState: Customer = {
    id: user?.uid || "",
    name: user?.displayName || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    address: "",
    city: "",
    zip: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [billingCustomer, setBillingCustomer] =
    useState<Customer>(initialCustomerState);
  const [shippingCustomer, setShippingCustomer] =
    useState<Partial<Customer> | null>(null);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [orderId] = useState(generateOrderId());

  useEffect(() => {
    if (user) {
      // Potentially fetch saved address here if not already in user object
    }
  }, [user]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleRequestOtp = async (phoneNumber: string) => {
    if (!executeRecaptcha) {
      toast.error("Recaptcha not ready");
      return;
    }

    try {
      setIsResendingOtp(true);
      const token = await executeRecaptcha("request_otp");
      await requestOTP(phoneNumber, token);
      setResendCooldown(60);
      toast.success("OTP sent successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!pendingOrder) return;

    try {
      setIsVerifyingOtp(true);
      await verifyOTP(pendingOrder.customer.phone, otp);

      // If OTP verified, finalize the order
      if (!executeRecaptcha) throw new Error("Recaptcha failed");
      const token = await executeRecaptcha("finalize_cod");

      await addNewOrder(pendingOrder, token);
      await sendCODOrderNotifications(pendingOrder.orderId, token);

      dispatch(clearBag());
      router.replace(`/checkout/success/${pendingOrder.orderId}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Invalid OTP");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const processPayherePayment = async (
    orderId: string,
    customer: Customer,
    amount: string
  ) => {
    const amountFormatted = parseFloat(amount)
      .toLocaleString("en-US", { minimumFractionDigits: 2 })
      .replace(/,/g, "");
    const [firstName, ...lastNameParts] = customer.name.split(" ");
    const payload = {
      orderId,
      amount: amountFormatted,
      firstName,
      lastName: lastNameParts.join(" ") || firstName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      items: `${bagItems.length} Products`,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success/${orderId}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/fail?orderId=${orderId}`,
      notifyUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ipg/payhere/notify`,
    };
    const payherePayload = await initiatePayHerePayment(payload);
    submitForm(process.env.NEXT_PUBLIC_PAYHERE_URL || "", payherePayload);
  };

  const processKokoPayment = async (
    orderId: string,
    customer: Customer,
    amount: string
  ) => {
    const amountFormatted = parseFloat(amount)
      .toLocaleString("en-US", { minimumFractionDigits: 2 })
      .replace(/,/g, "");
    const [firstName, ...lastNameParts] = customer.name.split(" ");
    const payload = {
      orderId,
      amount: amountFormatted,
      firstName,
      lastName: lastNameParts.join(" ") || firstName,
      email: customer.email,
      description: `${bagItems.length} products`,
    };
    const kokoPayload = await initiateKOKOPayment(payload);
    submitForm(process.env.NEXT_PUBLIC_KOKO_REDIRECT_URL || "", kokoPayload);
  };

  const submitForm = (action: string, payload: any) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;
    form.style.display = "none";
    Object.entries(payload).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value as string;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  };

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!executeRecaptcha) return;
    setIsSubmitting(true);

    try {
      // Validate Logic
      const form = e.target as any;
      const newBilling = createCustomerFromForm(form);
      const userId = user?.id || null; // Ensure User ID is captured if exists

      const amount = (
        calculateSubTotal(bagItems, paymentFee) - couponDiscount
      ).toFixed(2);
      const fee = calculateFee(paymentFee, bagItems);

      const orderCustomer: Customer = {
        ...newBilling,
        ...(shippingSameAsBilling
          ? {
              shippingName: newBilling.name,
              shippingAddress: newBilling.address,
              shippingCity: newBilling.city,
              shippingZip: newBilling.zip,
              shippingPhone: newBilling.phone,
            }
          : {
              shippingName: shippingCustomer?.shippingName || "",
              shippingAddress: shippingCustomer?.shippingAddress || "",
              shippingCity: shippingCustomer?.shippingCity || "",
              shippingZip: shippingCustomer?.shippingZip || "",
              shippingPhone: shippingCustomer?.shippingPhone || "",
            }),
      };

      const newOrder: Order = {
        orderId,
        userId: userId || "anonymous-user",
        customer: orderCustomer,
        items: bagItems,
        total: parseFloat(amount),
        paymentMethod: paymentType,
        paymentMethodId: paymentTypeId,
        fee: fee,
        shippingFee: calculateShippingCost(bagItems),
        transactionFeeCharge: calculateTransactionFeeCharge(
          bagItems,
          paymentFee
        ),
        paymentStatus: "Pending",
        status: "Processing",
        from: "Website",
        discount: calculateTotalDiscount(bagItems) + couponDiscount,
        couponCode: couponCode || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const token = await executeRecaptcha("new_order");

      switch (paymentTypeId?.toUpperCase()) {
        case "PM-006": // KOKO
          await addNewOrder(newOrder, token);
          dispatch(clearBag());
          await processKokoPayment(orderId, orderCustomer, amount);
          break;
        case "PM-001": // COD
          setPendingOrder(newOrder);
          // Request OTP
          await handleRequestOtp(newBilling.phone);
          setShowOtpModal(true);
          break;
        case "PM-003": // Payhere
          await addNewOrder(newOrder, token);
          dispatch(clearBag());
          await processPayherePayment(orderId, orderCustomer, amount);
          break;
        default:
          throw new Error("Invalid payment method selected");
      }
    } catch (err: any) {
      console.error("Payment Error:", err);
      toast.error("Payment failed. Please try again.");
      if (err.message && err.message.length < 50) {
        toast.error(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handlePaymentSubmit}
        className="flex flex-col lg:flex-row w-full gap-8 lg:gap-16 px-4 md:px-8 py-8"
      >
        {/* --- LEFT COLUMN: FORMS (Scrollable) --- */}
        <div className="w-full lg:w-[60%] flex flex-col gap-10">
          <BillingDetails
            saveAddress={saveAddress}
            setSaveAddress={setSaveAddress}
            customer={billingCustomer}
          />

          <ShippingDetails
            shippingSameAsBilling={shippingSameAsBilling}
            setShippingSameAsBilling={setShippingSameAsBilling}
            shippingCustomer={shippingCustomer}
            setShippingCustomer={setShippingCustomer}
          />
        </div>

        {/* --- RIGHT COLUMN: SUMMARY & PAYMENT (Sticky) --- */}
        <div className="w-full lg:w-[40%] relative">
          <div className="sticky top-10">
            <PaymentDetails
              setPaymentType={setPaymentType}
              paymentType={paymentType || ""}
              setPaymentTypeId={setPaymentTypeId}
              setPaymentFee={setPaymentFee}
              selectedPaymentFee={paymentFee}
            />
          </div>
        </div>
      </form>

      {/* --- OTP MODAL (Redesigned) --- */}
      {showOtpModal && pendingOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="relative bg-white p-8 w-full max-w-sm border border-gray-200 shadow-2xl">
            <button
              onClick={() => {
                setShowOtpModal(false);
                setPendingOrder(null);
                setOtp("");
              }}
              className="absolute top-4 right-4 text-black hover:scale-110 transition"
            >
              <FiX size={24} />
            </button>

            <h2 className="text-xl font-black uppercase tracking-tight mb-2 text-center">
              Verify Number
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6 font-medium">
              Enter the code sent to {pendingOrder.customer.phone}
            </p>

            <div className="flex flex-col gap-4">
              <input
                type="tel"
                value={otp}
                disabled={isVerifyingOtp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full h-14 text-center text-2xl tracking-[0.5em] font-bold border-2 border-gray-200 focus:border-black outline-none transition-colors"
                maxLength={6}
              />
              <button
                type="button"
                onClick={handleOtpVerification}
                disabled={isVerifyingOtp}
                className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-400 transition"
              >
                {isVerifyingOtp ? "Processing..." : "Confirm Order"}
              </button>

              <button
                type="button"
                onClick={() => handleRequestOtp(pendingOrder.customer.phone)}
                disabled={isResendingOtp || resendCooldown > 0}
                className="text-xs font-bold uppercase tracking-wide text-gray-400 hover:text-black transition"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : isResendingOtp
                  ? "Sending..."
                  : "Resend Code"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isSubmitting && <ComponentLoader />}
    </>
  );
};

export default CheckoutForm;
