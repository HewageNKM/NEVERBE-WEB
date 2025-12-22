"use client";
import React, { useMemo, useEffect } from "react";
import DropShadow from "@/components/DropShadow";
import { motion } from "framer-motion";
import {
  IoCloseOutline,
  IoBagHandleOutline,
  IoArrowForward,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  hideBag,
  removeFromBag,
  removeCoupon,
  removePromotion,
} from "@/redux/bagSlice/bagSlice";
import { useRouter } from "next/navigation";
import {
  calculateShippingCost,
  calculateSubTotal,
  calculateTotal,
  calculateTotalDiscount,
} from "@/utils/bagCalculations";
import { BagItem } from "@/interfaces/BagItem";
import Image from "next/image";
import usePromotions from "@/hooks/usePromotions";
import PromotionBanner from "@/components/PromotionBanner";

// --- Types ---
interface BundleGroup {
  comboId: string;
  comboName: string;
  items: BagItem[];
  totalPrice: number;
  totalDiscount: number;
}

// --- Sub-Components ---
const BundleGroupCard = ({
  bundle,
  onRemove,
}: {
  bundle: BundleGroup;
  onRemove: (item: BagItem) => void;
}) => {
  const netPrice = bundle.totalPrice - bundle.totalDiscount;

  return (
    <div className="border border-black bg-white">
      {/* Bundle Header */}
      <div className="bg-black text-white px-4 py-2 flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest">
          Bundle Deal
        </span>
        <span className="text-xs font-bold">{bundle.comboName}</span>
      </div>

      {/* Bundle Items */}
      <div className="divide-y divide-gray-100">
        {bundle.items.map((item, idx) => (
          <div key={idx} className="flex gap-3 p-3">
            {/* Thumbnail */}
            <div className="relative w-16 h-16 bg-surface-2 shrink-0">
              <Image
                src={item.thumbnail || ""}
                alt={item.name}
                fill
                className="object-cover mix-blend-multiply"
              />
              <span className="absolute top-0 left-0 bg-black text-white text-[8px] font-bold px-1">
                #{idx + 1}
              </span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase truncate">
                {item.name}
              </p>
              <p className="text-[10px] text-gray-500 uppercase">
                Size:{" "}
                <span className="text-black font-medium">{item.size}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bundle Footer */}
      <div className="border-t border-gray-200 px-4 py-3 flex justify-between items-center bg-gray-50">
        <button
          onClick={() => bundle.items.forEach((item) => onRemove(item))}
          className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-red-600 underline transition-colors"
        >
          Remove Bundle
        </button>
        <div className="text-right">
          {bundle.totalDiscount > 0 && (
            <p className="text-[10px] text-gray-400 line-through">
              Rs. {bundle.totalPrice.toLocaleString()}
            </p>
          )}
          <p className="text-sm font-black text-red-600">
            Rs. {netPrice.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

const SingleItemCard = ({
  item,
  onRemove,
}: {
  item: BagItem;
  onRemove: (item: BagItem) => void;
}) => {
  const totalPrice = item.price * item.quantity;
  const netPrice = totalPrice - item.discount;

  return (
    <div className="flex gap-4 w-full">
      {/* Image */}
      <div className="relative w-20 h-20 bg-surface-2 shrink-0">
        <Image
          src={item.thumbnail || ""}
          alt={item.name}
          fill
          className="object-cover mix-blend-multiply"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between py-0.5">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-sm uppercase leading-tight line-clamp-2 text-black">
              {item.name}
            </h3>
            <div className="text-right shrink-0">
              {item.discount > 0 ? (
                <>
                  <p className="font-bold text-sm text-black">
                    Rs. {netPrice.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-400 line-through">
                    Rs. {totalPrice.toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="font-bold text-sm">
                  Rs. {totalPrice.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="mt-1 text-[10px] text-gray-500 font-medium uppercase space-y-0.5">
            {item.variantName && (
              <p className="text-gray-800">{item.variantName}</p>
            )}
            <p>
              Size: <span className="text-black">{item.size}</span> | Qty:{" "}
              <span className="text-black">{item.quantity}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => onRemove(item)}
          className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-red-600 underline transition-colors mt-2 self-start"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---
const Bag = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  // Use the promotions hook to trigger calculation and updates
  usePromotions();

  const bagItems = useSelector((state: RootState) => state.bag.bag);
  const couponDiscount =
    useSelector((state: RootState) => state.bag.couponDiscount) || 0;
  const promotionDiscount =
    useSelector((state: RootState) => state.bag.promotionDiscount) || 0;

  // Group combo items by comboId, keep regular items separate
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

  const handleRemove = (item: BagItem) => {
    dispatch(removeFromBag(item));
  };

  // Clear discounts when cart becomes empty
  useEffect(() => {
    if (bagItems.length === 0) {
      if (couponDiscount > 0) {
        dispatch(removeCoupon());
      }
      if (promotionDiscount > 0) {
        dispatch(removePromotion());
      }
    }
  }, [bagItems.length, couponDiscount, promotionDiscount, dispatch]);

  // Dynamic Shipping Calculation
  const [shippingCost, setShippingCost] = React.useState(0);
  const [loadingShipping, setLoadingShipping] = React.useState(false);

  useEffect(() => {
    const fetchShipping = async () => {
      if (bagItems.length === 0) {
        setShippingCost(0);
        return;
      }
      setLoadingShipping(true);
      try {
        const payload = {
          items: bagItems.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
          })),
        };
        const res = await fetch("/api/v1/shipping/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setShippingCost(data.cost);
        }
      } catch (error) {
        console.error("Failed to fetch shipping", error);
      } finally {
        setLoadingShipping(false);
      }
    };

    fetchShipping();
  }, [bagItems]);

  const finalTotal =
    calculateSubTotal(bagItems, 0, shippingCost) -
    couponDiscount -
    promotionDiscount;

  const itemCount = bagItems.length;
  const bundleCount = bundles.length;

  return (
    <DropShadow containerStyle="flex justify-end">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
        className="w-full sm:w-[450px] bg-white h-screen flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header --- */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-black">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic">
              Your Bag
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
              {itemCount} Items
              {bundleCount > 0 &&
                ` · ${bundleCount} Bundle${bundleCount > 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => dispatch(hideBag())}
            className="p-2 border border-transparent hover:border-black transition-colors"
            aria-label="Close Bag"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        {/* --- Items List --- */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <PromotionBanner variant="inline" className="mb-6" />

          {bagItems.length > 0 ? (
            <div className="space-y-6">
              {/* Bundles First */}
              {bundles.map((bundle) => (
                <BundleGroupCard
                  key={bundle.comboId}
                  bundle={bundle}
                  onRemove={handleRemove}
                />
              ))}

              {/* Regular Items */}
              {regularItems.map((item, index) => (
                <SingleItemCard
                  key={`${item.itemId}-${item.variantId}-${item.size}-${index}`}
                  item={item}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <IoBagHandleOutline size={48} className="mb-4 text-gray-300" />
              <p className="font-black uppercase tracking-tighter text-lg text-gray-300 italic">
                Your bag is empty
              </p>
              <button
                onClick={() => dispatch(hideBag())}
                className="mt-4 text-xs font-bold uppercase tracking-widest underline hover:text-gray-500"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* --- Summary Footer --- */}
        {bagItems.length > 0 && (
          <div className="border-t-2 border-black p-6 bg-white space-y-4">
            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="font-bold font-mono">
                  Rs. {calculateTotal(bagItems).toLocaleString()}
                </span>
              </div>

              {calculateTotalDiscount(bagItems) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">Discounts</span>
                  <span className="font-bold font-mono">
                    - Rs. {calculateTotalDiscount(bagItems).toLocaleString()}
                  </span>
                </div>
              )}

              {promotionDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">Promotion</span>
                  <span className="font-bold font-mono">
                    - Rs. {promotionDiscount.toLocaleString()}
                  </span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">Coupon</span>
                  <span className="font-bold font-mono">
                    - Rs. {couponDiscount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Shipping</span>
                <span className="font-bold font-mono">
                  {loadingShipping ? (
                    <span className="text-gray-400 text-xs">...</span>
                  ) : shippingCost === 0 ? (
                    "FREE"
                  ) : (
                    `Rs. ${shippingCost.toLocaleString()}`
                  )}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-end border-t border-black pt-4">
              <span className="text-xs font-bold uppercase tracking-widest">
                Total Due
              </span>
              <span className="font-black text-2xl tracking-tight">
                Rs. {Math.max(0, finalTotal).toLocaleString()}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                dispatch(hideBag());
                router.push("/checkout");
              }}
              className="group w-full flex items-center justify-between px-6 py-4 bg-black text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span className="text-sm font-bold uppercase tracking-widest">
                Checkout
              </span>
              <div className="bg-white text-black rounded-full p-1 transition-transform group-hover:translate-x-1">
                <IoArrowForward size={16} />
              </div>
            </button>

            <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest">
              Secure Checkout · PayHere & KOKO
            </p>
          </div>
        )}
      </motion.div>
    </DropShadow>
  );
};

export default Bag;
