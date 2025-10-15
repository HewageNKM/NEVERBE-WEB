"use client";
import React from "react";
import DropShadow from "@/components/DropShadow";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { hideCart } from "@/redux/cartSlice/cartSlice";
import CartItemCard from "@/components/CartItemCard";
import { useRouter } from "next/navigation";
import { calculateShippingCost, calculateSubTotal } from "@/util";

const Cart = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cartSlice.cart);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = cartItems.reduce((acc, item) => acc + (item.discount || 0), 0);
  const subtotal = calculateSubTotal(cartItems);

  return (
    <DropShadow containerStyle="flex justify-end">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="w-full sm:w-[80vw] md:w-[60vw] lg:w-[28vw] bg-white h-screen flex flex-col shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-2xl font-display font-semibold tracking-wide">Your Cart</h2>
          <button
            onClick={() => dispatch(hideCart())}
            className="text-gray-600 hover:text-black transition-colors"
            aria-label="Close Cart"
          >
            <IoClose size={30} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => <CartItemCard key={index} item={item} />)
          ) : (
            <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>
          )}
        </div>

        {/* Summary */}
        <div className="border-t p-6 space-y-3 bg-gray-50">
          <div className="flex justify-between text-gray-700">
            <span>Total:</span>
            <span>Rs. {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Discount:</span>
            <span>-Rs. {discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Shipping:</span>
            <span>Rs. {calculateShippingCost(cartItems).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t pt-2">
            <span>Subtotal:</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => {
              dispatch(hideCart());
              router.push("/checkout");
            }}
            disabled={cartItems.length === 0}
            className="w-full mt-5 py-3 bg-primary text-white rounded-lg text-lg font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            Checkout
          </button>
        </div>
      </motion.div>
    </DropShadow>
  );
};

export default Cart;
