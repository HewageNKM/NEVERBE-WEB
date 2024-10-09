"use client"
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import Image from "next/image";
import {IoLockClosed} from "react-icons/io5";
import {paymentOptions} from "@/constants";
import {calculateShipping} from "@/util";
import {removeFromCart} from "@/redux/cartSlice/cartSlice";

const PaymentDetails = ({
                            setPaymentType,
                            paymentType
                        }: {
    setPaymentType: React.Dispatch<React.SetStateAction<string>>,
    paymentType: string
}) => {
    const cartItems = useSelector((state: RootState) => state.cartSlice.cart);
    const dispatch:AppDispatch = useDispatch();

    return (
        <div className="flex flex-col justify-center items-start">
            <h1 className="lg:text-4xl text-3xl font-bold tracking-wide">Payment Details</h1>
            <div className="max-h-[60vh] w-[80vw] overflow-auto mt-10 lg:w-full">
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
                            <td className="p-3 border-b">
                                <div>
                                    <div><Image src={item.thumbnail} alt={item.variantName} width={40} height={40}
                                                className="md:w-[6rem] w-16 h-12 md:h-[7rem] rounded-lg bg-cover"/>
                                    </div>
                                </div>
                            </td>
                            <td className="p-3 border-b capitalize text-sm md:text-lg">
                                {item.name + " | " + item.variantName + " | SizeChart " + item.size}
                            </td>
                            <td className="p-3 border-b text-sm md:text-lg">{item.quantity}</td>
                            <td className="p-3 border-b text-sm md:text-lg">{item.price * item.quantity}</td>
                            <td className="p-3 border-b text-sm md:text-lg">
                                <button
                                    type="button"
                                    onClick={() => {
                                        dispatch(removeFromCart(item))
                                    }}
                                    className="text-red-500 hover:underline">
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-5 flex flex-col justify-end items-end w-full md:text-2xl text-xl lg:text-3xl font-bold">
                <h3>Total Items: {cartItems.length}</h3>
                <div className="flex flex-col mt-5 justify-end items-end">
                    <h3>Shipping: Rs. {calculateShipping(cartItems)}</h3>
                    <h3>
                        Total: Rs. {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + calculateShipping(cartItems)}
                    </h3>
                </div>
            </div>
            <div className="mt-10">
                <h2 className="md:text-2xl text-xl font-bold tracking-wide">Payment Method</h2>
                <ul className="mt-5 flex flex-col gap-6">
                    {paymentOptions.map((option, index) => (
                        <li
                            onClick={() => {
                            }}
                            key={index}
                            className="flex flex-row items-center gap-4 p-4 border rounded-lg shadow-sm transition-all hover:shadow-md hover:bg-gray-100"
                        >
                            <input
                                defaultChecked={option.value == paymentType}
                                type="radio"
                                name="payment"
                                value={option.value}
                                onChange={() => setPaymentType(option.value)}
                                className="form-radio h-5 w-5 text-primary focus:ring focus:ring-primary/50"
                            />
                            <div className="flex flex-col gap-2">
                                {option.image ? (
                                    <Image
                                        src={option.image}
                                        alt={option.name}
                                        width={200}
                                        height={200}
                                        className="object-contain"
                                    />
                                ) : (
                                    <label className="text-lg md:text-xl font-semibold tracking-wide text-gray-800">
                                        {option.name}
                                    </label>
                                )}
                                {option.description && (
                                    <p className="font-medium flex flex-wrap">{option.description}</p>)}
                            </div>
                        </li>
                    ))}
                </ul>

            </div>
            <div className="w-full justify-center items-center mt-5 flex">
                <button
                    disabled={cartItems.length == 0}
                    type="submit"
                    className={`bg-primary flex justify-center items-center gap-2 text-xl w-full p-2 rounded-lg text-white ${cartItems.length === 0 && "bg-opacity-60"}`}>
                    <p>Proceed to Payment</p>
                    <IoLockClosed/>
                </button>
            </div>
        </div>
    );
};

export default PaymentDetails;