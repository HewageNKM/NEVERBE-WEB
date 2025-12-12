"use client";
import React from "react";
import DropShadow from "@/components/DropShadow";
import { motion } from "framer-motion";
import { IoCloseOutline, IoBagHandleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { hideCart } from "@/redux/cartSlice/cartSlice";
import CartItemCard from "@/components/CartItemCard";
import { useRouter } from "next/navigation";
import {
  calculateShippingCost,
  calculateSubTotal,
  calculateTotal,
  calculateTotalDiscount,
} from "@/util";

const Cart = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cartSlice.cart);

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
            Your Bag ({cartItems.length})
          </h2>
          <button
            onClick={() => dispatch(hideCart())}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close Cart"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        {/* --- Items List --- */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <CartItemCard key={index} item={item} />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <IoBagHandleOutline size={48} className="mb-4 text-gray-400" />
              <p className="font-bold uppercase tracking-wide text-sm">
                Your bag is empty
              </p>
              <button
                onClick={() => dispatch(hideCart())}
                className="mt-4 text-xs font-bold underline hover:text-gray-500"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* --- Summary Footer --- */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-white space-y-4">
            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-black font-medium">
                  Rs. {calculateTotal(cartItems).toLocaleString()}
                </span>
              </div>

              {calculateTotalDiscount(cartItems) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount</span>
                  <span>
                    - Rs. {calculateTotalDiscount(cartItems).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-gray-500">
                <span>Estimated Shipping</span>
                <span className="text-black font-medium">
                  {calculateShippingCost(cartItems) === 0
                    ? "Free"
                    : `Rs. ${calculateShippingCost(
                        cartItems
                      ).toLocaleString()}`}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-end border-t border-gray-100 pt-4 pb-2">
              <span className="font-bold uppercase tracking-wide">Total</span>
              <span className="font-black text-xl">
                Rs. {calculateSubTotal(cartItems, 0).toLocaleString()}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                dispatch(hideCart());
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

export default Cart;
