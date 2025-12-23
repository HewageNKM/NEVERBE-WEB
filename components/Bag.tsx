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
    <div className="border border-dark bg-surface overflow-hidden shadow-custom">
      {/* Bundle Header */}
      <div className="bg-dark text-inverse px-4 py-2 flex justify-between items-center">
        <span className="text-xs font-black uppercase tracking-widest text-accent">
          Bundle Deal
        </span>
        <span className="text-xs font-bold font-display">
          {bundle.comboName}
        </span>
      </div>

      {/* Bundle Items */}
      <div className="divide-y border-b border-default divide-default">
        {bundle.items.map((item, idx) => (
          <div key={idx} className="flex gap-3 p-3 bg-surface">
            {/* Thumbnail */}
            <div className="relative w-16 h-16 bg-surface-2 shrink-0">
              <Image
                src={item.thumbnail || ""}
                alt={item.name}
                fill
                className="object-cover mix-blend-multiply"
              />
              <span className="absolute top-0 left-0 bg-dark text-inverse text-[9px] font-bold px-1.5">
                {idx + 1}
              </span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold uppercase truncate text-primary">
                {item.name}
              </p>
              <p className="text-xs text-secondary uppercase">
                Size:{" "}
                <span className="text-primary font-medium">{item.size}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bundle Footer */}
      <div className="px-4 py-3 flex justify-between items-center bg-surface-3">
        <button
          onClick={() => bundle.items.forEach((item) => onRemove(item))}
          className="text-xs font-bold uppercase tracking-wider text-muted hover:text-error underline underline-offset-4 transition-colors"
        >
          Remove Bundle
        </button>
        <div className="text-right">
          {bundle.totalDiscount > 0 && (
            <p className="text-xs text-muted line-through">
              Rs. {bundle.totalPrice.toLocaleString()}
            </p>
          )}
          <p className="text-md font-black text-primary">
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
    <div className="flex gap-4 w-full group">
      {/* Image */}
      <div className="relative w-20 h-20 bg-surface-2 shrink-0 overflow-hidden">
        <Image
          src={item.thumbnail || ""}
          alt={item.name}
          fill
          className="object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between py-0.5">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-base uppercase leading-tight line-clamp-2 text-primary">
              {item.name}
            </h3>
            <div className="text-right shrink-0">
              {item.discount > 0 ? (
                <>
                  <p className="font-bold text-base text-primary">
                    Rs. {netPrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted line-through">
                    Rs. {totalPrice.toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="font-bold text-base text-primary">
                  Rs. {totalPrice.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="mt-1 text-xs text-secondary font-medium uppercase space-y-0.5">
            {item.variantName && (
              <p className="text-primary">{item.variantName}</p>
            )}
            <p>
              Size: <span className="text-primary">{item.size}</span> | Qty:{" "}
              <span className="text-primary">{item.quantity}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => onRemove(item)}
          className="text-xs font-bold uppercase tracking-wider text-muted hover:text-error underline underline-offset-4 transition-colors mt-2 self-start"
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

  usePromotions();

  const bagItems = useSelector((state: RootState) => state.bag.bag);
  const couponDiscount =
    useSelector((state: RootState) => state.bag.couponDiscount) || 0;
  const promotionDiscount =
    useSelector((state: RootState) => state.bag.promotionDiscount) || 0;

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

    return { bundles: Array.from(bundleMap.values()), regularItems: regular };
  }, [bagItems]);

  const handleRemove = (item: BagItem) => {
    dispatch(removeFromBag(item));
  };

  useEffect(() => {
    if (bagItems.length === 0) {
      if (couponDiscount > 0) dispatch(removeCoupon());
      if (promotionDiscount > 0) dispatch(removePromotion());
    }
  }, [bagItems.length, couponDiscount, promotionDiscount, dispatch]);

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

  return (
    <DropShadow containerStyle="flex justify-end">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
        className="w-full sm:w-[450px] bg-surface h-screen flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header --- */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-dark">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic text-primary">
              Your Bag
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-muted mt-0.5">
              {bagItems.length} Items
              {bundles.length > 0 &&
                ` · ${bundles.length} Bundle${bundles.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => dispatch(hideBag())}
            className="p-2 border border-transparent hover:border-dark text-primary transition-all rounded-full"
            aria-label="Close Bag"
          >
            <IoCloseOutline size={28} />
          </button>
        </div>

        {/* --- Items List --- */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          <PromotionBanner variant="inline" className="mb-6" />

          {bagItems.length > 0 ? (
            <div className="space-y-8 animate-fade">
              {bundles.map((bundle) => (
                <BundleGroupCard
                  key={bundle.comboId}
                  bundle={bundle}
                  onRemove={handleRemove}
                />
              ))}
              {regularItems.map((item, index) => (
                <SingleItemCard
                  key={`${item.itemId}-${item.variantId}-${index}`}
                  item={item}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <IoBagHandleOutline size={64} className="mb-4 text-accent" />
              <p className="font-black uppercase tracking-tighter text-xl text-muted italic">
                Your bag is empty
              </p>
              <button
                onClick={() => dispatch(hideBag())}
                className="mt-6 text-sm font-bold uppercase tracking-widest text-primary underline underline-offset-8 decoration-accent hover:decoration-primary transition-all"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* --- Summary Footer --- */}
        {bagItems.length > 0 && (
          <div className="border-t-2 border-dark p-6 bg-surface-2 space-y-4">
            <div className="space-y-2 text-base">
              <div className="flex justify-between">
                <span className="text-secondary font-medium">Subtotal</span>
                <span className="font-bold text-primary">
                  Rs. {calculateTotal(bagItems).toLocaleString()}
                </span>
              </div>

              {(calculateTotalDiscount(bagItems) > 0 ||
                promotionDiscount > 0 ||
                couponDiscount > 0) && (
                <div className="space-y-2">
                  {calculateTotalDiscount(bagItems) > 0 && (
                    <div className="flex justify-between text-success">
                      <span className="font-medium">Discount</span>
                      <span className="font-bold">
                        - Rs.{" "}
                        {calculateTotalDiscount(bagItems).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {promotionDiscount > 0 && (
                    <div className="flex justify-between text-success">
                      <span className="font-medium">Promotion</span>
                      <span className="font-bold">
                        - Rs. {promotionDiscount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-success">
                      <span className="font-medium">Coupon Applied</span>
                      <span className="font-bold">
                        - Rs. {couponDiscount.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-secondary font-medium">Shipping</span>
                <span className="font-bold text-primary">
                  {loadingShipping ? (
                    <span className="animate-pulse">...</span>
                  ) : shippingCost === 0 ? (
                    "FREE"
                  ) : (
                    `Rs. ${shippingCost.toLocaleString()}`
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-dark pt-4">
              <span className="text-sm font-black uppercase tracking-widest text-primary">
                Total Due
              </span>
              <span className="font-black text-3xl tracking-tight text-primary">
                Rs. {Math.max(0, finalTotal).toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => {
                dispatch(hideBag());
                router.push("/checkout");
              }}
              className="group w-full flex items-center justify-between px-6 py-5 bg-dark text-inverse transition-all shadow-lg hover:shadow-hover hover:-translate-y-0.5"
            >
              <span className="text-base font-black uppercase tracking-widest">
                Checkout Now
              </span>
              <div className="bg-accent text-primary rounded-full p-1.5 transition-transform group-hover:translate-x-2">
                <IoArrowForward size={18} />
              </div>
            </button>

            <div className="flex items-center justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all">
              {/* Minimal placeholder for payment icons */}
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                PayHere
              </span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                KOKO
              </span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                Mintpay
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </DropShadow>
  );
};

export default Bag;
