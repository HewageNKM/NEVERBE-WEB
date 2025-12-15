"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IoArrowForward, IoLockClosedOutline } from "react-icons/io5";
import BagItemCard from "@/components/BagItemCard";
import CouponInput from "@/components/CouponInput";
import PromotionBanner from "@/components/PromotionBanner";
import {
  calculateFee,
  calculateShippingCost,
  calculateSubTotal,
  calculateTotal,
  calculateTotalDiscount,
} from "@/util";
import { PaymentMethod } from "@/interfaces";
import { BagItem } from "@/interfaces/BagItem";
import PaymentOptions from "./PaymentOptions";
import Image from "next/image";

interface PaymentDetailsProps {
  paymentType: string;
  setPaymentType: React.Dispatch<React.SetStateAction<string>>;
  setPaymentTypeId: React.Dispatch<React.SetStateAction<string>>;
  setPaymentFee: React.Dispatch<React.SetStateAction<number>>;
  selectedPaymentFee: number;
}

interface BundleGroup {
  comboId: string;
  comboName: string;
  items: BagItem[];
  totalPrice: number;
  totalDiscount: number;
}

// Compact Bundle Card for Checkout
const BundleCard = ({ bundle }: { bundle: BundleGroup }) => {
  const netPrice = bundle.totalPrice - bundle.totalDiscount;

  return (
    <div className="border border-black bg-white">
      <div className="bg-black text-white px-3 py-1.5 flex justify-between items-center">
        <span className="text-[9px] font-bold uppercase tracking-widest">
          Bundle
        </span>
        <span className="text-[10px] font-bold">{bundle.comboName}</span>
      </div>

      <div className="divide-y divide-gray-100">
        {bundle.items.map((item, idx) => (
          <div key={idx} className="flex gap-2 p-2">
            <div className="relative w-10 h-10 bg-[#f6f6f6] shrink-0">
              <Image
                src={item.image || ""}
                alt={item.name}
                fill
                className="object-cover mix-blend-multiply"
              />
              <span className="absolute -top-1 -left-1 bg-black text-white text-[7px] font-bold px-0.5">
                {idx + 1}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase truncate">
                {item.name}
              </p>
              <p className="text-[9px] text-gray-500 uppercase">
                Size: {item.size}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 px-3 py-2 flex justify-between items-center bg-gray-50">
        <span className="text-[9px] text-gray-500 uppercase font-bold">
          {bundle.items.length} Items
        </span>
        <div className="text-right">
          {bundle.totalDiscount > 0 && (
            <span className="text-[9px] text-gray-400 line-through mr-2">
              Rs. {bundle.totalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-xs font-bold">
            Rs. {netPrice.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  paymentType,
  setPaymentType,
  setPaymentTypeId,
  setPaymentFee,
  selectedPaymentFee,
}) => {
  const bagItems = useSelector((state: RootState) => state.bagSlice.bag);
  const couponDiscount =
    useSelector((state: RootState) => state.bagSlice.couponDiscount) || 0;
  const promotionDiscount =
    useSelector((state: RootState) => state.bagSlice.promotionDiscount) || 0;

  const [paymentOptions, setPaymentOptions] = useState<PaymentMethod[]>([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  // Group combo items by comboId
  const { bundles, regularItems } = useMemo(() => {
    const bundleMap = new Map<string, BundleGroup>();
    const regular: BagItem[] = [];

    bagItems.forEach((item) => {
      if (item.isComboItem && item.comboId) {
        const existing = bundleMap.get(item.comboId);
        const itemTotal = item.price * item.quantity;

        if (existing) {
          existing.items.push(item);
          existing.totalPrice += itemTotal;
          existing.totalDiscount += item.discount;
        } else {
          bundleMap.set(item.comboId, {
            comboId: item.comboId,
            comboName: item.comboName || "Bundle Deal",
            items: [item],
            totalPrice: itemTotal,
            totalDiscount: item.discount,
          });
        }
      } else {
        regular.push(item);
      }
    });

    return {
      bundles: Array.from(bundleMap.values()),
      regularItems: regular,
    };
  }, [bagItems]);

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

  // Calculations
  const finalTotal =
    calculateSubTotal(bagItems, selectedPaymentFee) -
    couponDiscount -
    promotionDiscount;
  const shipping = calculateShippingCost(bagItems);
  const itemDiscount = calculateTotalDiscount(bagItems);
  const fee = calculateFee(selectedPaymentFee, bagItems);
  const rawSubTotal = calculateTotal(bagItems);

  const Divider = () => <div className="h-px bg-gray-200 w-full my-6" />;

  const bundleCount = bundles.length;
  const regularCount = regularItems.length;

  return (
    <div className="bg-white p-6 md:p-8 w-full border border-gray-200 h-fit sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-black">
          Order Summary
        </h2>
        <span className="text-xs font-bold bg-black text-white px-2 py-1 uppercase tracking-widest">
          {bagItems.length} Items
          {bundleCount > 0 && ` · ${bundleCount} Bundle`}
        </span>
      </div>

      {/* Promotion Banner */}
      <div className="mb-6">
        <PromotionBanner variant="inline" />
      </div>

      {/* Items - Grouped by Bundles and Regular */}
      <div className="mb-6 space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
        {/* Bundles First */}
        {bundles.map((bundle) => (
          <BundleCard key={bundle.comboId} bundle={bundle} />
        ))}

        {/* Regular Items */}
        {regularItems.map((item, index) => (
          <BagItemCard
            key={`${item.itemId}-${item.variantId}-${item.size}-${index}`}
            item={item}
            compact
          />
        ))}
      </div>

      <Divider />

      {/* Payment Selection */}
      <div className="mb-6">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
          Select Payment Method
        </h3>
        {isPaymentLoading ? (
          <div className="h-12 bg-gray-100 animate-pulse w-full"></div>
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

      <Divider />

      {/* Coupon Section */}
      <div className="mb-6">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
          Promo Code
        </h3>
        <CouponInput />
      </div>

      <Divider />

      {/* Financial Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 font-medium">Subtotal</span>
          <span className="font-bold text-black font-mono">
            Rs. {rawSubTotal.toLocaleString()}
          </span>
        </div>

        {itemDiscount > 0 && (
          <div className="flex justify-between items-center text-sm text-red-600">
            <span className="font-medium">Discounts</span>
            <span className="font-bold font-mono">
              - Rs. {itemDiscount.toLocaleString()}
            </span>
          </div>
        )}

        {promotionDiscount > 0 && (
          <div className="flex justify-between items-center text-sm text-black">
            <span className="font-medium">Promotion</span>
            <span className="font-bold font-mono">
              - Rs. {promotionDiscount.toLocaleString()}
            </span>
          </div>
        )}

        {couponDiscount > 0 && (
          <div className="flex justify-between items-center text-sm text-green-700">
            <span className="font-medium">Coupon</span>
            <span className="font-bold font-mono">
              - Rs. {couponDiscount.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 font-medium">Shipping</span>
          <span className="font-bold text-black font-mono">
            {shipping === 0 ? "FREE" : `Rs. ${shipping}`}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 font-medium">Handling Fee</span>
          <span className="font-bold text-black font-mono">
            Rs. {fee.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Total Section */}
      <div className="border-t-2 border-black pt-4 mb-8">
        <div className="flex justify-between items-end">
          <span className="text-sm font-bold uppercase tracking-widest text-black">
            Total Due
          </span>
          <span className="text-3xl font-black tracking-tighter text-black leading-none">
            Rs.{finalTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        disabled={bagItems.length === 0 || !paymentType}
        type="submit"
        className="group w-full flex items-center justify-between px-6 py-4 bg-black text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
      >
        <span className="font-bold uppercase tracking-widest text-sm">
          Complete Order
        </span>
        <div className="bg-white text-black rounded-full p-1 transition-transform group-hover:translate-x-1">
          <IoArrowForward size={18} />
        </div>
      </button>

      {/* Security Footer */}
      <div className="mt-6 flex flex-col items-center justify-center text-center gap-2">
        <div className="flex items-center gap-1.5 text-gray-400">
          <IoLockClosedOutline size={12} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Secure Checkout
          </span>
        </div>
        <p className="text-[9px] text-gray-400 leading-relaxed max-w-[250px]">
          By placing this order, you agree to the Terms of Service. Please do
          not close this window until the Invoice loads.
        </p>
      </div>
    </div>
  );
};

export default PaymentDetails;
