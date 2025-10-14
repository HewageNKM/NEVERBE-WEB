"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IoLockClosed } from "react-icons/io5";
import CartItemCard from "@/components/CartItemCard";
import ReCAPTCHA from "react-google-recaptcha";
import { calculateShipping, calculateShippingCost, calculateSubTotal } from "@/util";
import PaymentOptions from "@/app/checkout/components/PaymentOptions";

const PaymentDetails = ({
  setPaymentType,
  paymentType,
  captchaError,
  setCaptchaError,
  setCaptchaValue,
  recaptchaRef,
}: {
  setPaymentType: React.Dispatch<React.SetStateAction<string>>;
  paymentType: string;
  recaptchaRef: React.RefObject<ReCAPTCHA>;
  setCaptchaValue: React.Dispatch<React.SetStateAction<string | null>>;
  setCaptchaError: React.Dispatch<React.SetStateAction<boolean>>;
  captchaError: boolean;
}) => {
  const cartItems = useSelector((state: RootState) => state.cartSlice.cart);

  const calculateTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const calculateDiscount = () =>
    cartItems.reduce((acc, item) => acc + (item.discount || 0), 0);

  return (
    <div className="flex flex-col max-w-3xl mx-auto px-6 py-8 bg-white">
      <h1 className="text-3xl lg:text-4xl font-bold tracking-wide text-gray-900 mb-6">
        Payment Details
      </h1>

      {/* Cart Items */}
      <ul className="space-y-4 max-h-[55vh] overflow-y-auto w-full">
        {cartItems.map((item, index) => (
          <li key={index}>
            <CartItemCard item={item} />
          </li>
        ))}
      </ul>

      {/* Summary */}
      <div className="mt-8 w-full flex flex-col items-end gap-2 text-lg border-t border-gray-200 pt-4">
        <h3>Total Items: {cartItems.length}</h3>
        <div className="flex flex-col items-end space-y-1 w-full md:w-auto">
          <p className="text-gray-700">
            Total: <span className="font-medium">Rs. {calculateTotal().toFixed(2)}</span>
          </p>
          <p className="text-gray-700">
            Shipping: <span className="font-medium">{calculateShippingCost(cartItems).toFixed(2)}</span>
          </p>
          <p className="text-gray-700">
            Discount: <span className="font-medium text-red-500">-Rs. {calculateDiscount().toFixed(2)}</span>
          </p>
          <div className="w-full border-t border-gray-300 my-1" />
          <p className="text-lg font-semibold">
            Subtotal: Rs. {calculateSubTotal(cartItems).toFixed(2)}
          </p>
          <div className="w-full border-t border-gray-300 my-1" />
        </div>
      </div>

      {/* Payment Options */}
      <div className="mt-8 w-full">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Payment Method</h2>
        <PaymentOptions paymentType={paymentType} setPaymentType={setPaymentType} />
      </div>

      {/* Terms */}
      <p className="mt-6 text-center text-gray-600 text-sm">
        By clicking <strong>&quot;Proceed to Payment&quot;</strong>, you agree to our Terms of Service and Privacy Policy.
      </p>

      {/* CAPTCHA */}
      <div className="mt-4 flex justify-center">
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
          ref={recaptchaRef}
          onChange={(value) => {
            setCaptchaValue(value);
            setCaptchaError(false);
          }}
          onExpired={() => {
            setCaptchaValue(null);
            setCaptchaError(true);
          }}
          className={captchaError ? "border-red-500 rounded-md" : ""}
        />
      </div>
      {captchaError && (
        <p className="text-red-500 text-sm mt-2 text-center">
          Please verify that you are not a robot
        </p>
      )}

      {/* Proceed Button */}
      <button
        disabled={cartItems.length === 0 || !paymentType}
        type="submit"
        className={`mt-6 w-full flex items-center justify-center gap-3 bg-primary text-white text-xl py-3 rounded-lg transition-all duration-300 ${
          cartItems.length === 0 ? "bg-opacity-50 cursor-not-allowed" : "hover:bg-primary-dark"
        }`}
      >
        <span>Proceed to Payment</span>
        <IoLockClosed size={20} />
      </button>
    </div>
  );
};

export default PaymentDetails;
