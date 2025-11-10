"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { Customer, Order } from "@/interfaces";
import { clearCart } from "@/redux/cartSlice/cartSlice";
import { FiX } from "react-icons/fi";
import {
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
import BillingDetails from "./BillingDetails"; // Billing (main)
import ShippingDetails from "./ShippingDetails"; // Shipping (optional)
import PaymentDetails from "@/app/checkout/components/PaymentDetails"; // <--- restored
import ComponentLoader from "@/components/ComponentLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

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
  const cartItems = useSelector((state: RootState) => state.cartSlice.cart);
  const user = useSelector((state: RootState) => state.authSlice.user);

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
        : toast.error(res.message || "Failed to send OTP");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to send OTP");
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

        dispatch(clearCart());
        toast.success("Order verified successfully!");
        router.replace(`/checkout/success/${pendingOrder.orderId}`);

        setShowOtpModal(false);
        setOtp("");
        setPendingOrder(null);
      } else toast.error(res.message || "Invalid OTP");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Invalid OTP");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handlePaymentSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!executeRecaptcha) return toast.error("reCAPTCHA not ready");
    if (cartItems.length === 0) return toast.error("Cart is empty");
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
      const amount = calculateSubTotal(cartItems);
      const discount = calculateTotalDiscount(cartItems);
      const transactionFeeCharge = calculateTransactionFeeCharge(cartItems,paymentFee)

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
        items: cartItems,
        total: parseFloat(amount),
        paymentMethod: paymentType,
        paymentMethodId: paymentTypeId,
        fee: 0,
        shippingFee: calculateShippingCost(cartItems),
        transactionFeeCharge,
        paymentStatus: "Pending",
        status:"Processing",
        from: "Website",
        discount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const token = await executeRecaptcha("new_order");

      switch (paymentTypeId?.toUpperCase()) {
        case "PM-006":
          //KOKO
          await addNewOrder(newOrder, token);
          dispatch(clearCart());
          await processKokoPayment(orderId, orderCustomer, amount);
          break;
        case "PM-001":
          //COD
          setPendingOrder(newOrder);
          await handleRequestOtp(newBilling.phone);
          setShowOtpModal(true);
          break;
        case "PM-003":
          //Payhere
          await addNewOrder(newOrder, token);
          dispatch(clearCart());
          await processPayherePayment(orderId, orderCustomer, amount);
          break;
        default:
          throw new Error("Invalid payment method");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Payment failed. Redirecting...");
      router.replace(`/checkout/fail?orderId=${orderId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Payment Process Helpers ---
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
      items: `${cartItems.length} Products`,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success/${orderId}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/fail?orderId=${orderId}`,
      notifyUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ipg/payhere/notify`,
    };

    const payherePayload = await initiatePayHerePayment(payload);
    const form = document.createElement("form");
    form.method = "POST";
    form.action = process.env.NEXT_PUBLIC_PAYHERE_URL || "";
    form.style.display = "none";

    Object.entries(payherePayload).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
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
      description: `${cartItems.length} products`,
    };

    const kokoPayload = await initiateKOKOPayment(payload);
    const form = document.createElement("form");
    form.method = "POST";
    form.action = process.env.NEXT_PUBLIC_KOKO_REDIRECT_URL || "";
    form.style.display = "none";

    Object.entries(kokoPayload).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handlePaymentSubmit}
        className="flex flex-row flex-wrap justify-center lg:flex-nowrap gap-6 mt-10 w-full"
      >
        <div className="flex flex-col">
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

        {/* Payment option UI */}
        <PaymentDetails
          setPaymentType={setPaymentType}
          paymentType={paymentType || ""}
          setPaymentTypeId={setPaymentTypeId}
          setPaymentFee={setPaymentFee}
        />
      </form>

      {/* OTP Modal */}
      {showOtpModal && pendingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
            <button
              onClick={() => {
                setShowOtpModal(false);
                setPendingOrder(null);
                setOtp("");
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Close OTP Modal"
            >
              <FiX size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Verify Your Order
            </h2>
            <p className="text-center text-gray-600 mb-6">
              An OTP has been sent to{" "}
              <span className="font-semibold">
                {pendingOrder.customer.phone}
              </span>
              .
            </p>

            <div className="flex flex-col gap-4">
              <input
                type="tel"
                value={otp}
                disabled={isVerifyingOtp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="p-3 border-2 border-gray-300 rounded-lg text-center tracking-widest text-lg focus:border-primary-300 focus:ring-1 focus:ring-primary-300 transition"
                maxLength={6}
                autoComplete="one-time-code"
              />
              <button
                onClick={handleOtpVerification}
                className="bg-primary text-white p-3 rounded-lg hover:bg-primary-200 transition-colors font-semibold disabled:bg-gray-400"
                disabled={isVerifyingOtp}
              >
                {isVerifyingOtp ? "Verifying..." : "Verify & Place Order"}
              </button>

              {resendCooldown === 0 ? (
                <button
                  onClick={() => handleRequestOtp(pendingOrder.customer.phone)}
                  className="text-sm text-primary hover:text-primary-100 transition-colors mt-2"
                  disabled={isResendingOtp}
                >
                  {isResendingOtp ? "Sending OTP..." : "Resend OTP"}
                </button>
              ) : (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Resend in {resendCooldown}s
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {isSubmitting && <ComponentLoader />}
    </div>
  );
};

export default CheckoutForm;
