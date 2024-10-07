"use client"
import React from 'react';
import DropShadow from "@/components/DropShadow";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {IoClose} from "react-icons/io5";
import {motion} from "framer-motion";
import {hideCart, removeFromCart} from "@/redux/cartSlice/cartSlice";
import Image from "next/image";
import {useRouter} from "next/navigation";
const Cart = () => {
    const cartItems = useSelector((state:RootState) => state.cartSlice.cart);
    const dispatch:AppDispatch = useDispatch();
    const router = useRouter();

    return (
        <DropShadow containerStyle="flex justify-end items-end">
            <motion.div
                initial={{ opacity: 0, x: "100vw" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100vw" }}
                transition={{ type: "tween" ,duration: 0.4,delay: 0.1}}
                className="px-8 py-4 w-full lg:w-[40vw] rounded-l-lg bg-white h-screen relative shadow-lg"
            >
                <h1 className="text-4xl font-bold tracking-wider border-b pb-4">Cart</h1>
                <div className="overflow-auto h-[70vh] mt-5">
                    <table className="w-full border-separate border-spacing-2">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-3 border-b">Item</th>
                            <th className="text-left p-3 border-b">Description</th>
                            <th className="text-left p-3 border-b">Quantity</th>
                            <th className="text-left p-3 border-b">Price</th>
                            <th className="text-left p-3 border-b">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartItems.map((item, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="p-3 border-b"><div>
                                    <div><Image src={item.thumbnail} alt={item.variantName} width={40} height={40} className="md:w-[6rem] w-16 h-12 md:h-[7rem] rounded-lg bg-cover"/></div>
                                </div>
                                </td>
                                <td className="p-3 border-b capitalize text-sm md:text-lg">
                                    {item.name + " | " + item.variantName + " | SizeChart " + item.size}
                                </td>
                                <td className="p-3 border-b text-sm md:text-lg">{item.quantity}</td>
                                <td className="p-3 border-b text-sm md:text-lg">{item.price * item.quantity}</td>
                                <td className="p-3 border-b text-sm md:text-lg">
                                    <button onClick={()=> dispatch(removeFromCart(item))} className="text-red-500 hover:underline">
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <button
                    onClick={() => dispatch(hideCart())}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <IoClose size={40} />
                </button>
                <div className="mt-5 w-full">
                    <div className="mt-3 flex justify-between">
                        <h1 className="md:text-2xl text-lg font-bold">Total Items: {cartItems.length}</h1>
                        <h1 className="md:text-2xl text-lg font-bold">Total: Rs. {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}</h1>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 mt-5 rounded-lg w-full" onClick={()=>{
                        if(cartItems.length == 0 ) return;

                        dispatch(hideCart());
                        router.push("/shop/checkout");
                    }}>Checkout</button>
                </div>
            </motion.div>
        </DropShadow>

    );
};

export default Cart;