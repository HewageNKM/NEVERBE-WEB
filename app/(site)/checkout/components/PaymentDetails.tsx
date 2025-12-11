"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IoLockClosed } from "react-icons/io5";
import CartItemCard from "@/components/CartItemCard";
import {
  calculateFee,
  calculateShippingCost,
  calculateSubTotal,
  calculateTotal,
  calculateTotalDiscount,
} from "@/util";
import { PaymentMethod } from "@/interfaces";
import PaymentOptions from "./PaymentOptions";

interface PaymentDetailsProps {
  paymentType: string;
  setPaymentType: React.Dispatch<React.SetStateAction<string>>;
  setPaymentTypeId: React.Dispatch<React.SetStateAction<string>>;
  setPaymentFee: React.Dispatch<React.SetStateAction<number>>;
  selectedPaymentFee: number;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  paymentType,
  setPaymentType,
  setPaymentTypeId,
  setPaymentFee,
  selectedPaymentFee,
}) => {
  const cartItems = useSelector((state: RootState) => state.cartSlice.cart);
  const [paymentOptions, setPaymentOptions] = useState<PaymentMethod[]>([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setIsPaymentLoading(true);
      const response = await fetch("/api/v1/payment-methods");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const methods = await response.json();
      setPaymentOptions(methods || []);
      if (methods.length > 0 && !paymentType) {
        setPaymentType(methods[0].name || "");
        setPaymentTypeId(methods[0].paymentId || "");
        setPaymentFee(methods[0].fee || 0);
      }
    } catch (e) {
      console.error("Failed to fetch payment methods:", e);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const subtotal = calculateSubTotal(cartItems, selectedPaymentFee);
  const shipping = calculateShippingCost(cartItems);
  const discount = calculateTotalDiscount(cartItems);
  const total = calculateTotal(cartItems);
  const fee = calculateFee(selectedPaymentFee, cartItems);

  return (
    <div className="flex flex-col w-full md:max-w-2xl mx-auto px-3 md:px-6 py-10 bg-white">
      {/* Header */}
      <div className="mb-8 text-left">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Details
        </h1>
        <p className="text-gray-500 mt-1">
          Review your order and select a payment method
        </p>
      </div>
      {/* Cart Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🛒 Your Cart ({cartItems.length})
        </h2>

        <ul className="space-y-4 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          {cartItems.map((item, index) => (
            <li key={index}>
              <CartItemCard item={item} />
            </li>
          ))}
        </ul>
      </div>
      {/* Payment Options */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          💳 Payment Method
        </h2>
        {isPaymentLoading ? (
          <p className="text-gray-500 italic">Loading payment methods...</p>
        ) : (
          <PaymentOptions
            paymentOptions={paymentOptions}
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            setPaymentTypeId={setPaymentTypeId}
            setPaymentFee={setPaymentFee}
          />
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 mb-8">
        {/* Summary */}
        <div className="mt-6 border-t border-gray-200 pt-4 text-right text-gray-700">
          <div className="flex justify-between text-sm sm:text-base">
            <span>Total:</span>
            <span className="font-medium">Rs. {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base">
            <span>Shipping:</span>
            <span className="font-medium">Rs. {shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base">
            <span>Fee:</span>
            <span className="font-medium">Rs. {fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base text-red-500">
            <span>Discount:</span>
            <span>-Rs. {discount.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-300 mt-2 mb-2" />
          <div className="flex justify-between text-lg font-semibold text-gray-900">
            <span>Subtotal:</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {/* Warning Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6 text-sm text-yellow-800 space-y-1">
        <p className="font-semibold">
          ⚠️ කරුණාකර ගනුදෙනුව සම්පූර්ණ වන තුරු (Invoice පිටුව පෙන්වෙන තුරු) මෙම
          කවුළුව හෝ බ්‍රව්සරය වසන්න එපා.
        </p>
        <p className="font-semibold">
          ⚠️ Please don’t close or refresh this window until you reach the
          invoice download page.
        </p>
        <p className="font-semibold">
          ⚠️ தயவுசெய்து விலைப்பட்டியல் பதிவிறக்கப் பக்கத்தை அடையும் வரை இந்த
          சாளரத்தை மூடவோ அல்லது புதுப்பிக்கவோ வேண்டாம்.
        </p>
      </div>
      {/* Terms & reCAPTCHA Notice */}
      <div className="text-xs text-gray-500 mb-1 text-center capitalize">
        <p className="mb-1">
          This site is protected by Google reCAPTCHA and the Google{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary-dark"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary-dark"
          >
            Terms of Service
          </a>{" "}
          apply.
        </p>
      </div>
      {/* Proceed Button */}
      <button
        disabled={cartItems.length === 0 || !paymentType}
        type="submit"
        className={`w-full flex items-center justify-center gap-2 text-lg font-semibold py-3 rounded-lg transition-all duration-300 shadow-sm ${
          cartItems.length === 0 || !paymentType
            ? "bg-gray-300 cursor-not-allowed text-gray-600"
            : "bg-primary text-white hover:bg-primary-dark"
        }`}
      >
        <IoLockClosed size={20} />
        <span>Proceed to Payment</span>
      </button>
    </div>
  );
};

export default PaymentDetails;
