"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon, removeCoupon } from "@/redux/bagSlice/bagSlice";
import { RootState } from "@/redux/store";
import { IoArrowForward } from "react-icons/io5";
import BagItemCard from "@/components/BagItemCard";
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
  const dispatch = useDispatch();
  const bagItems = useSelector((state: RootState) => state.bagSlice.bag);
  const couponDiscount = useSelector(
    (state: RootState) => state.bagSlice.couponDiscount
  );
  const savedCouponCode = useSelector(
    (state: RootState) => state.bagSlice.couponCode
  );
  const { user } = useSelector((state: RootState) => state.authSlice);

  const [paymentOptions, setPaymentOptions] = useState<PaymentMethod[]>([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  // Coupon State
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (savedCouponCode) setCode(savedCouponCode);
  }, [savedCouponCode]);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setIsPaymentLoading(true);
        const res = await fetch("/api/v1/payment-methods");
        const methods = await res.json();
        setPaymentOptions(methods || []);
        if (methods.length > 0 && !paymentType) {
          setPaymentType(methods[0].name);
          setPaymentTypeId(methods[0].paymentId);
          setPaymentFee(methods[0].fee);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsPaymentLoading(false);
      }
    };
    fetchMethods();
  }, []);

  const handleApplyCoupon = async () => {
    if (!code) return;
    setLoading(true);
    setMsg(null);

    try {
      const cartTotal =
        calculateTotal(bagItems) - calculateTotalDiscount(bagItems);

      const res = await fetch("/api/v1/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          userId: user?.userId,
          cartTotal,
          cartItems: bagItems.map((item) => ({
            itemId: item.itemId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
          })),
        }),
      });

      const data = await res.json();

      if (data.valid) {
        dispatch(
          applyCoupon({ code: data.coupon.code, discount: data.discount })
        );
        setMsg({
          type: "success",
          text: `Coupon applied! You saved Rs. ${data.discount}`,
        });
      } else {
        setMsg({ type: "error", text: data.message || "Invalid coupon" });
        dispatch(removeCoupon());
      }
    } catch (error) {
      console.error(error);
      setMsg({ type: "error", text: "Failed to validate coupon" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCode("");
    setMsg(null);
  };

  const subtotal =
    calculateSubTotal(bagItems, selectedPaymentFee) - couponDiscount;
  const shipping = calculateShippingCost(bagItems);
  const discount = calculateTotalDiscount(bagItems);
  const fee = calculateFee(selectedPaymentFee, bagItems);

  return (
    <div className="bg-[#f6f6f6] p-6 md:p-8 w-full border border-gray-200">
      <h2 className="text-xl font-black uppercase tracking-tight mb-6">
        Order Summary
      </h2>

      {/* Bag Mini List */}
      <div className="mb-6 space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {bagItems.map((item, index) => (
          <BagItemCard key={index} item={item} />
        ))}
      </div>

      <div className="h-px bg-gray-200 w-full mb-6"></div>

      {/* Payment Selection */}
      <div className="mb-8">
        <h3 className="text-sm font-bold uppercase tracking-wide mb-3">
          Payment Method
        </h3>
        {isPaymentLoading ? (
          <div className="h-10 bg-gray-200 animate-pulse rounded-sm"></div>
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

      <div className="h-px bg-gray-200 w-full mb-6"></div>

      {/* Coupon Section */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wide mb-3">
          Coupon Code
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ENTER CODE"
            disabled={!!savedCouponCode}
            className="flex-1 h-10 px-3 bg-white border border-gray-300 focus:border-black focus:outline-none text-sm uppercase placeholder:normal-case font-medium disabled:bg-gray-100 disabled:text-gray-500"
          />
          {savedCouponCode ? (
            <button
              onClick={handleRemoveCoupon}
              className="px-4 bg-gray-200 text-gray-800 text-xs font-bold uppercase hover:bg-gray-300 transition-colors h-10"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={handleApplyCoupon}
              disabled={!code || loading}
              className="px-4 bg-black text-white text-xs font-bold uppercase hover:bg-gray-800 disabled:opacity-50 transition-colors h-10 min-w-[80px]"
            >
              {loading ? "..." : "Apply"}
            </button>
          )}
        </div>
        {msg && (
          <p
            className={`text-[11px] font-medium mt-2 ${
              msg.type === "error" ? "text-red-500" : "text-green-600"
            }`}
          >
            {msg.text}
          </p>
        )}
      </div>

      <div className="h-px bg-gray-200 w-full mb-6"></div>

      {/* Totals */}
      <div className="space-y-3 text-sm font-medium text-gray-600 mb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-black">
            Rs. {calculateTotal(bagItems).toLocaleString()}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Item Discount</span>
            <span>- Rs. {discount.toLocaleString()}</span>
          </div>
        )}

        {couponDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount</span>
            <span>- Rs. {couponDiscount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="text-black">
            {shipping === 0 ? "Free" : `Rs. ${shipping}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Payment Fee</span>
          <span className="text-black">Rs. {fee.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-end border-t border-gray-200 pt-4 mb-8">
        <span className="text-lg font-bold uppercase">Total</span>
        <span className="text-2xl font-black">
          Rs. {subtotal.toLocaleString()}
        </span>
      </div>

      {/* Submit Button */}
      <button
        disabled={bagItems.length === 0 || !paymentType}
        type="submit"
        className="w-full flex items-center justify-center gap-2 py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-400 transition-all"
      >
        <span>Complete Order</span>
        <IoArrowForward />
      </button>

      {/* Fine Print / Warning */}
      <div className="mt-4 text-[10px] text-gray-400 text-center leading-relaxed">
        <p>⚠️ Do not close this window until the Invoice page loads.</p>
        <p className="mt-1">
          Secure payment via PayHere / KOKO. Protected by reCAPTCHA.
        </p>
      </div>
    </div>
  );
};

export default PaymentDetails;
