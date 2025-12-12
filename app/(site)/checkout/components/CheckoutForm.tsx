"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { Customer, Order } from "@/interfaces";
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
import { signUser } from "@/firebase/firebaseClient";
import BillingDetails from "./BillingDetails";
import ShippingDetails from "./ShippingDetails";
import PaymentDetails from "@/app/(site)/checkout/components/PaymentDetails";
import ComponentLoader from "@/components/ComponentLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

// ... (Keep your helper functions like createCustomerFromForm and formatSriLankanPhoneNumber exactly as they are)
const createCustomerFromForm = (form: any): Customer => {
  const name = `${form.first_name.value} ${form.last_name.value}`;
  return {
    name,
    email: form.email.value,
    phone: form.phone.value,
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
  const user = useSelector((state: RootState) => state.authSlice.user);

  // ... (Keep all your existing state: billingCustomer, paymentType, etc.)
  const [billingCustomer, setBillingCustomer] = useState<Customer | null>(null);
  const [shippingSameAsBilling, setShippingSameAsBilling] = useState(true);
  const [shippingCustomer, setShippingCustomer] =
    useState<Partial<Customer> | null>(null);
  const [paymentType, setPaymentType] = useState<string | null>(null);
  const [paymentTypeId, setPaymentTypeId] = useState<string | null>(null);
  const [paymentFee, setPaymentFee] = useState(0);
  const [saveAddress, setSaveAddress] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { executeRecaptcha } = useGoogleReCaptcha();

  // ... (Keep your useEffects and Handlers exactly as they are)
  useEffect(() => {
    const savedCustomer = window.localStorage.getItem("neverbeBillingCustomer");
    if (savedCustomer) setBillingCustomer(JSON.parse(savedCustomer));
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const formatSriLankanPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("07") && digits.length === 10)
      return `94${digits.substring(1)}`;
    if (digits.startsWith("7") && digits.length === 9) return `94${digits}`;
    return digits;
  };

  const handleRequestOtp = async (phoneNumber: string) => {
    if (!executeRecaptcha) return toast.error("reCAPTCHA not ready");
    setIsResendingOtp(true);
    try {
      const token = await executeRecaptcha("otp_request");
      const res = await requestOTP(
        formatSriLankanPhoneNumber(phoneNumber),
        token
      );
      setResendCooldown(60);
      res.success
        ? toast.success(`OTP sent to ${phoneNumber}`)
        : toast.error(res.message);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!pendingOrder || !otp) return toast.error("Invalid OTP");
    setIsVerifyingOtp(true);
    try {
      const res = await verifyOTP(
        formatSriLankanPhoneNumber(pendingOrder.customer.phone),
        otp
      );
      if (!executeRecaptcha) return toast.error("reCAPTCHA not ready");

      if (res.success) {
        const token = await executeRecaptcha("new_order");
        await addNewOrder(pendingOrder, token);
        const notifToken = await executeRecaptcha("cod_notification");
        await sendCODOrderNotifications(pendingOrder.orderId, notifToken);

        dispatch(clearBag());
        toast.success("Order verified successfully!");
        router.replace(`/checkout/success/${pendingOrder.orderId}`);
        setShowOtpModal(false);
      } else toast.error(res.message || "Invalid OTP");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handlePaymentSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!executeRecaptcha) return toast.error("reCAPTCHA not ready");
    if (bagItems.length === 0) return toast.error("Bag is empty");
    if (!paymentType) return toast.error("Select payment method");

    setIsSubmitting(true);
    const form = evt.currentTarget;
    const orderId = generateOrderId();
    const newBilling = createCustomerFromForm(form);

    if (saveAddress)
      localStorage.setItem(
        "neverbeBillingCustomer",
        JSON.stringify(newBilling)
      );
    else localStorage.removeItem("neverbeBillingCustomer");

    try {
      const userId = user?.uid || (await signUser())?.uid;
      const amount = calculateSubTotal(bagItems, paymentFee);
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
              shippingName: shippingCustomer?.shippingName,
              shippingAddress: shippingCustomer?.shippingAddress,
              shippingCity: shippingCustomer?.shippingCity,
              shippingZip: shippingCustomer?.shippingZip,
              shippingPhone: shippingCustomer?.shippingPhone,
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
        discount: calculateTotalDiscount(bagItems),
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
          await handleRequestOtp(newBilling.phone);
          setShowOtpModal(true);
          break;
        case "PM-003": // Payhere
          await addNewOrder(newOrder, token);
          dispatch(clearBag());
          await processPayherePayment(orderId, orderCustomer, amount);
          break;
        default:
          throw new Error("Invalid payment method");
      }
    } catch (err: any) {
      toast.error("Payment failed. Redirecting...");
      router.replace(`/checkout/fail?orderId=${orderId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (Keep processPayherePayment and processKokoPayment helpers)
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

  return (
    <>
      <form
        onSubmit={handlePaymentSubmit}
        className="flex flex-col lg:flex-row w-full gap-8 lg:gap-16 px-4 md:px-8 py-8"
      >
        {/* --- LEFT COLUMN: FORMS (Scrollable) --- */}
        <div className="w-full lg:w-[60%] flex flex-col gap-10">
          {!user && (
            <div className="bg-gray-50 border border-gray-200 p-4 flex justify-between items-center text-sm">
              <span className="text-gray-600">Already have an account?</span>
              <button
                type="button"
                onClick={() => router.push("/account/login?redirect=/checkout")}
                className="font-bold underline hover:text-gray-600 transition-colors"
              >
                Log in for faster checkout
              </button>
            </div>
          )}
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
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
                onClick={handleOtpVerification}
                disabled={isVerifyingOtp}
                className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-400 transition"
              >
                {isVerifyingOtp ? "Processing..." : "Confirm Order"}
              </button>

              <button
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
