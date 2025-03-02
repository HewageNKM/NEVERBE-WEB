"use client";
import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {IoLockClosed} from "react-icons/io5";
import CartItemCard from "@/components/CartItemCard";
import ReCAPTCHA from "react-google-recaptcha";
import {calculateSubTotal} from "@/util";
import PaymentOptions from "@/app/checkout/components/PaymentOptions";

const PaymentDetails = ({
                            setPaymentType,
                            paymentType,
                            captchaError,
                            setCaptchaError,
                            setCaptchaValue,
                            recaptchaRef,
                        }: {
    setPaymentType: React.Dispatch<React.SetStateAction<string>>;
    paymentType: string;
    recaptchaRef: React.RefObject<ReCAPTCHA>;
    setCaptchaValue: React.Dispatch<React.SetStateAction<string | null>>;
    setCaptchaError: React.Dispatch<React.SetStateAction<boolean>>;
    captchaError: boolean;
}) => {
    const cartItems = useSelector((state: RootState) => state.cartSlice.cart);

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }
    const calculateDiscount = () => {
        return cartItems.reduce((acc, item) => acc + (item.discount || 0), 0);
    }
    return (
        <div className="flex flex-col justify-start items-start max-w-3xl mx-auto px-4 py-8">
            <h1 className="lg:text-4xl text-3xl font-bold tracking-wide mb-8">Payment Details</h1>

            <ul className="mt-5 w-full space-y-4 overflow-auto max-h-[60vh]">
                {cartItems.map((item, index) => (
                    <li key={index} className="w-full">
                        <CartItemCard item={item}/>
                    </li>
                ))}
            </ul>

            <div className="mt-8 w-full flex flex-col items-end text-lg">
                <h3>Total Items: {cartItems.length}</h3>
                <div className="mt-4 flex flex-col font-medium items-end space-y-2 text-lg">
                    <h3 className="md:text-xl text-lg">
                        Total:
                        Rs. {calculateTotal().toFixed(2)}
                    </h3>
                    <h3 className="md:text-xl text-lg">
                        Shipping: Rs. 0.00
                    </h3>
                    <h3 className="md:text-xl text-lg">
                        Discount: -Rs. {calculateDiscount().toFixed(2)}
                    </h3>
                    <div className={"w-full border-b-2 border-gray-300"}/>
                    <h3 className="md:text-xl text-lg font-semibold">
                        Subtotal: Rs. {calculateSubTotal(cartItems).toFixed(2)}
                    </h3>
                    <div className={
                        "w-full border-b-2 border-gray-300"
                    }/>
                    <div className={"w-full border-b-2 border-gray-300"}/>
                    <h4
                        className={"text-sm text-red-500 font-medium capitalize text-center w-full"}>
                        ** Pay For Shipping Charges at the time of delivery **
                    </h4>
                </div>
            </div>

            <div className="mt-10 w-full">
                <h2 className="text-xl md:text-2xl font-bold tracking-wide">Payment Method</h2>
                <PaymentOptions paymentType={paymentType} setPaymentType={setPaymentType}/>
            </div>

            <div className="mt-8 text-sm text-center text-gray-600 w-full">
                <p>
                    By clicking the <strong>&quot;Proceed to Payment&quot;</strong> button, you agree to our Terms of
                    Service and Privacy Policy.
                </p>
            </div>
            <div>
                <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                    ref={recaptchaRef}
                    onChange={(value) => {
                        setCaptchaValue(value);
                        setCaptchaError(false); // Clear error on valid input
                    }}
                    onExpired={() => {
                        setCaptchaValue(null);
                        setCaptchaError(true); // Show error on expiration
                    }}
                    className={`${
                        captchaError ? "border-red-500" : ""
                    }`}
                />
            </div>
            <div>
                {captchaError && (<p className="text-red-500 text-sm mt-2">Please verify that you are not a robot</p>)}
            </div>
            <div className="w-full mt-5">
                <button
                    disabled={cartItems.length === 0 || !paymentType}
                    type="submit"
                    className={`w-full flex items-center justify-center gap-2 bg-primary text-white text-xl py-3 rounded-lg transition-all duration-300 ${
                        cartItems.length === 0 ? "bg-opacity-50 cursor-not-allowed" : "hover:bg-primary-dark"
                    }`}
                >
                    <p>Proceed to Payment</p>
                    <IoLockClosed size={20}/>
                </button>
            </div>
        </div>
    );
};

export default PaymentDetails;
