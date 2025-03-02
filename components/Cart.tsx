"use client";
import React from 'react';
import DropShadow from "@/components/DropShadow";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import { hideCart } from "@/redux/cartSlice/cartSlice";
import { useRouter } from "next/navigation";
import CartItemCard from "@/components/CartItemCard";
import {calculateSubTotal} from "@/util";

const Cart = () => {
    const cartItems = useSelector((state: RootState) => state.cartSlice.cart);
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();

    return (
        <DropShadow containerStyle="flex justify-end items-end">
            <motion.div
                initial={{ opacity: 0, x: "100vw" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100vw" }}
                transition={{
                    type: "tween",
                    duration: 0.6,
                }}
                className="px-6 py-4 overflow-x-auto w-full lg:w-[25vw] flex flex-col justify-between lg:rounded-l-lg bg-white h-screen relative shadow-lg overflow-y-auto"
            >
                <div className="flex flex-col">
                    <h2 className="md:text-2xl text-lg font-bold tracking-wider border-b pb-4">Cart</h2>
                    <ul className="mt-5 flex overflow-x-auto max-h-screen flex-col justify-start gap-4">
                        {cartItems.map((item, index) => (
                            <li key={index}>
                                <CartItemCard item={item} />
                            </li>
                        ))}
                    </ul>
                </div>
                <button
                    onClick={() => dispatch(hideCart())}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <IoClose size={40} />
                </button>
                <div className="mt-5 px-2 w-full">
                    <div className="flex justify-between border-t-2 font-medium border-b-2 py-2">
                        <h1 className="md:text-xl text-lg">Total:</h1>
                        <h1 className="md:text-xl text-lg">Rs. {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</h1>
                    </div>
                    <div>
                        <h1 className="md:text-xl text-lg">Discount:</h1>
                        <h1 className="md:text-xl text-lg">Rs. {cartItems.reduce((acc, item) => acc + item.discount, 0).toFixed(2)}</h1>
                    </div>
                    <div>
                        <h1 className="md:text-xl text-lg">Shipping:</h1>
                        <h1 className="md:text-xl text-lg">Rs. {(0).toFixed(2)}</h1>
                    </div>
                    <div>
                        <h1 className="md:text-xl text-lg">Sub Total:</h1>
                        <h1 className="md:text-xl text-lg">Rs. {calculateSubTotal(cartItems).toFixed(2)}</h1>
                    </div>
                    <button
                        className="bg-primary disabled:cursor-not-allowed disabled:bg-opacity-60 text-white p-2 mt-5 tracking-wide md:text-lg lg:text-xl rounded-lg w-full"
                        onClick={() => {
                            dispatch(hideCart());
                            router.push("/checkout");
                        }}
                        disabled={cartItems.length === 0}
                    >
                        <strong>Checkout</strong>
                    </button>
                </div>
            </motion.div>
        </DropShadow>
    );
};

export default Cart;
