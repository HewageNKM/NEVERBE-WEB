"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IoLockClosed } from "react-icons/io5";
import CartItemCard from "@/components/CartItemCard";
import {
  calculateShippingCost,
  calculateSubTotal,
  calculateTotal,
  calculateTotalDiscount,
} from "@/util";
import { PaymentMethod } from "@/interfaces";
import { getWebsitePaymentMethods } from "@/actions/paymentMethodsAction";
import PaymentOptions from "./PaymentOptions";

interface PaymentDetailsProps {
  paymentType: string;
  setPaymentType: React.Dispatch<React.SetStateAction<string>>;
  setPaymentTypeId: React.Dispatch<React.SetStateAction<string>>;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  paymentType,
  setPaymentType,
  setPaymentTypeId,
}) => {
  const cartItems = useSelector((state: RootState) => state.cartSlice.cart);
  const [paymentOptions, setPaymentOptions] = useState<PaymentMethod[]>([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setIsPaymentLoading(true);
        const methods = await getWebsitePaymentMethods();
        setPaymentOptions(methods);

        // If no paymentType selected yet, default to first
        if (methods.length > 0 && !paymentType) {
          setPaymentType(methods[0].name || "");
          setPaymentTypeId(methods[0].paymentId || "");
        }
      } catch (e) {
        console.error("Failed to fetch payment methods:", e);
      } finally {
        setIsPaymentLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

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
            Total:{" "}
            <span className="font-medium">
              Rs. {calculateTotal(cartItems).toFixed(2)}
            </span>
          </p>
          <p className="text-gray-700">
            Shipping:{" "}
            <span className="font-medium">
              Rs. {calculateShippingCost(cartItems).toFixed(2)}
            </span>
          </p>
          <p className="text-gray-700">
            Discount:{" "}
            <span className="font-medium text-red-500">
              -Rs. {calculateTotalDiscount(cartItems).toFixed(2)}
            </span>
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
        {isPaymentLoading ? (
          <p className="text-gray-500 italic">Loading payment methods...</p>
        ) : (
          <PaymentOptions
            paymentOptions={paymentOptions}
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            setPaymentTypeId={setPaymentTypeId}
          />
        )}
      </div>

      {/* Terms */}
      <p className="mt-6 text-center text-gray-600 text-sm">
        By clicking <strong>&quot;Proceed to Payment&quot;</strong>, you agree
        to our Terms of Service and Privacy Policy.
      </p>

      {/* Proceed Button */}
      <button
        disabled={cartItems.length === 0 || !paymentType}
        type="submit"
        className={`mt-6 w-full flex items-center justify-center gap-3 bg-primary text-white text-xl py-3 rounded-lg transition-all duration-300 ${
          cartItems.length === 0 || !paymentType
            ? "bg-opacity-50 cursor-not-allowed"
            : "hover:bg-primary-dark"
        }`}
      >
        <span>Proceed to Payment</span>
        <IoLockClosed size={20} />
      </button>
    </div>
  );
};

export default PaymentDetails;
