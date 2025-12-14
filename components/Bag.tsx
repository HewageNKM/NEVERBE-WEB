"use client";
import React from "react";
import DropShadow from "@/components/DropShadow";
import { motion } from "framer-motion";
import { IoCloseOutline, IoBagHandleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { hideBag, applyCoupon, removeCoupon } from "@/redux/bagSlice/bagSlice";
import BagItemCard from "@/components/BagItemCard";
import { useRouter } from "next/navigation";
import {
  calculateShippingCost,
  calculateSubTotal,
  calculateTotal,
  calculateTotalDiscount,
} from "@/util";

const Bag = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  // State
  const bagItems = useSelector((state: RootState) => state.bagSlice.bag);
  const couponDiscount = useSelector(
    (state: RootState) => state.bagSlice.couponDiscount
  );
  const savedCouponCode = useSelector(
    (state: RootState) => state.bagSlice.couponCode
  );
  const { user } = useSelector((state: RootState) => state.authSlice); // Assuming authSlice has user

  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  React.useEffect(() => {
    if (savedCouponCode) setCode(savedCouponCode);
  }, [savedCouponCode]);

  const handleApplyCoupon = async () => {
    if (!code) return;
    setLoading(true);
    setMsg(null);

    try {
      // Calculate total before discount for validation
      const cartTotal = calculateTotal(bagItems);

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

  // Derived Totals
  const subTotalBeforeCoupon = calculateTotal(bagItems);
  const itemDiscounts = calculateTotalDiscount(bagItems);
  const shipping = calculateShippingCost(bagItems);

  // Final Total = (Price - ItemDisc) + Shipping + Fee - CouponDisc
  // Note: calculateSubTotal includes item disc and shipping.
  // Let's rely on standard calc but subtract coupon.
  const finalTotal = calculateSubTotal(bagItems, 0) - couponDiscount;

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
        <div className="flex justify-between items-center px-6 py-6 border-b border-gray-100">
          <h2 className="text-xl font-black uppercase tracking-tight">
            Your Bag ({bagItems.length})
          </h2>
          <button
            onClick={() => dispatch(hideBag())}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close Bag"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        {/* --- Items List --- */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {bagItems.length > 0 ? (
            <div className="space-y-6">
              {bagItems.map((item, index) => (
                <BagItemCard key={index} item={item} />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <IoBagHandleOutline size={48} className="mb-4 text-gray-400" />
              <p className="font-bold uppercase tracking-wide text-sm">
                Your bag is empty
              </p>
              <button
                onClick={() => dispatch(hideBag())}
                className="mt-4 text-xs font-bold underline hover:text-gray-500"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* --- Summary Footer --- */}
        {bagItems.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-white space-y-4">
            {/* Coupon Input */}
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="COUPON CODE"
                  disabled={!!savedCouponCode}
                  className="flex-1 border border-gray-300 px-3 py-2 text-sm uppercase placeholder:normal-case focus:outline-none focus:border-black disabled:bg-gray-50 disabled:text-gray-500"
                />
                {savedCouponCode ? (
                  <button
                    onClick={handleRemoveCoupon}
                    className="bg-gray-200 text-gray-800 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-300 transition-colors"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!code || loading}
                    className="bg-black text-white px-4 py-2 text-xs font-bold uppercase hover:bg-gray-800 disabled:opacity-50 transition-colors min-w-[80px]"
                  >
                    {loading ? "..." : "Apply"}
                  </button>
                )}
              </div>
              {msg && (
                <p
                  className={`text-[10px] mt-1 ${
                    msg.type === "error" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {msg.text}
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm pt-2 border-t border-dashed border-gray-200">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-black font-medium">
                  Rs. {calculateTotal(bagItems).toLocaleString()}
                </span>
              </div>

              {calculateTotalDiscount(bagItems) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Item Discount</span>
                  <span>
                    - Rs. {calculateTotalDiscount(bagItems).toLocaleString()}
                  </span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Coupon Discount</span>
                  <span>- Rs. {couponDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500">
                <span>Estimated Shipping</span>
                <span className="text-black font-medium">
                  {calculateShippingCost(bagItems) === 0
                    ? "Free"
                    : `Rs. ${calculateShippingCost(bagItems).toLocaleString()}`}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-end border-t border-gray-100 pt-4 pb-2">
              <span className="font-bold uppercase tracking-wide">Total</span>
              <span className="font-black text-xl">
                Rs. {Math.max(0, finalTotal).toLocaleString()}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                dispatch(hideBag());
                router.push("/checkout");
              }}
              className="w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-[0.98]"
            >
              Checkout
            </button>

            <p className="text-[10px] text-gray-400 text-center uppercase tracking-wide">
              Secure Checkout via PayHere
            </p>
          </div>
        )}
      </motion.div>
    </DropShadow>
  );
};

export default Bag;
