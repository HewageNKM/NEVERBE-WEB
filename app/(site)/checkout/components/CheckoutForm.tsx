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
} from "@/utils/bagCalculations";
import BillingDetails from "./BillingDetails";
import ShippingDetails from "./ShippingDetails";
import PaymentDetails from "@/app/(site)/checkout/components/PaymentDetails";
import CheckoutLoader from "@/components/CheckoutLoader";
import toast from "react-hot-toast";
import { Order, Customer } from "@/interfaces";
import { auth } from "@/firebase/firebaseClient";
import { usePayment } from "@/hooks/usePayment";
import usePromotions from "@/hooks/usePromotions";
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

  // Ensure promotions are calculated
  usePromotions();

  const bagItems = useSelector((state: RootState) => state.bag.bag);
  const couponDiscount = useSelector(
    (state: RootState) => state.bag.couponDiscount
  );
  const promotionDiscount =
    useSelector((state: RootState) => state.bag.promotionDiscount) || 0;
  const promotionIds = useSelector(
    (state: RootState) => state.bag.promotionIds
  );
  const user = auth?.currentUser;

  const [paymentType, setPaymentType] = useState<string>("");
  const [paymentTypeId, setPaymentTypeId] = useState<string>("");
  const [paymentFee, setPaymentFee] = useState<number>(0);
  const [shippingSameAsBilling, setShippingSameAsBilling] = useState(true);
  const [saveAddress, setSaveAddress] = useState(true);

  // Initialize billing customer with user data if available
  const initialCustomerState: Customer = {
    id: user?.uid || "", // Firebase user UID
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

  const [shippingCost, setShippingCost] = useState<number>(0);

  // Fetch dynamic shipping cost
  useEffect(() => {
    const fetchShipping = async () => {
      try {
        if (bagItems.length === 0) {
          setShippingCost(0);
          return;
        }
        const res = await fetch("/api/v1/shipping/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: bagItems }),
        });
        const data = await res.json();
        setShippingCost(data.cost || 0);
      } catch (error) {
        console.error("Failed to fetch shipping cost", error);
        // Fallback logic could go here, but API handles defaults
      }
    };
    fetchShipping();
  }, [bagItems]);

  // Initialize Payment Hook
  const {
    isProcessing,
    otpState,
    calculateTotals,
    buildOrderPayload,
    processPayment,
    handleOTPVerification,
    handleResendOTP,
    closeOTPModal,
  } = usePayment({
    paymentMethodId: paymentTypeId,
    paymentMethodName: paymentType,
    paymentFee: paymentFee,
  });

  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (user) {
      // Potentially fetch saved address here if not already in user object
    }
  }, [user]);

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate Logic
      const form = e.target as any;
      const newBilling = createCustomerFromForm(form);
      const userId = user?.uid || null;

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

      // 1. Calculate Totals
      const totals = calculateTotals(
        bagItems,
        couponDiscount,
        promotionDiscount,
        shippingCost
      );

      // 2. Build Order Payload
      const newOrder = buildOrderPayload(
        orderCustomer,
        bagItems,
        totals,
        userId,
        {
          appliedPromotionId: promotionIds[0] || null, // Assuming first is primary if needed
          appliedPromotionIds: promotionIds,
        }
      );

      console.log("New Order Payload:", newOrder);

      // 3. Process Payment (Delegated to hook)
      await processPayment(newOrder, orderCustomer);
    } catch (err: any) {
      console.error("Payment Submission Error:", err);
      toast.error("Failed to process order. Please try again.");
    }
  };

  return (
    <>
      <form
        onSubmit={handlePaymentSubmit}
        className="flex flex-col lg:flex-row w-full gap-8 lg:gap-16 px-4 md:px-8 py-8 bg-surface"
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
              shippingCost={shippingCost}
            />
          </div>
        </div>
      </form>

      {/* --- OTP MODAL - NEVERBE Performance Style --- */}
      {otpState.showModal && otpState.pendingOrder && (
        <div className="fixed inset-0 bg-surface/80 backdrop-blur-xl flex justify-center items-center z-50 p-4">
          <div className="relative bg-surface p-8 w-full max-w-sm border border-default rounded-2xl shadow-hover">
            <button
              onClick={() => {
                closeOTPModal();
                setOtp("");
              }}
              className="absolute top-4 right-4 text-primary hover:text-accent hover:scale-110 transition-all"
            >
              <FiX size={24} />
            </button>

            <h2 className="text-xl font-display font-black uppercase italic tracking-tighter mb-2 text-center text-primary">
              Verify Number
            </h2>
            <p className="text-center text-sm text-muted mb-6 font-medium">
              Enter the code sent to {otpState.pendingOrder.customer.phone}
            </p>

            <div className="flex flex-col gap-4">
              <input
                type="tel"
                value={otp}
                disabled={otpState.isVerifying}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full h-14 text-center text-2xl tracking-[0.5em] font-display font-black border-2 border-default bg-surface-2 rounded-xl focus:border-accent outline-none transition-colors text-primary"
                maxLength={6}
              />
              <button
                type="button"
                onClick={() => handleOTPVerification(otp)}
                disabled={otpState.isVerifying}
                className="w-full py-4 bg-dark text-inverse rounded-full font-display font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-dark transition-all shadow-custom hover:shadow-hover active:scale-95 disabled:bg-surface-3 disabled:text-muted disabled:shadow-none"
              >
                {otpState.isVerifying ? "Processing..." : "Confirm Order"}
              </button>

              <button
                type="button"
                onClick={() =>
                  handleResendOTP(otpState.pendingOrder!.customer.phone)
                }
                disabled={otpState.isResending || otpState.cooldown > 0}
                className="text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-all"
              >
                {otpState.cooldown > 0
                  ? `Resend in ${otpState.cooldown}s`
                  : otpState.isResending
                  ? "Sending..."
                  : "Resend Code"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isProcessing && <CheckoutLoader />}
    </>
  );
};

export default CheckoutForm;
