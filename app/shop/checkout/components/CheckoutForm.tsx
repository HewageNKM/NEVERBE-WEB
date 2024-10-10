"use client"
import md5 from 'crypto-js/md5';
import React, {useEffect, useState} from 'react';
import AddressDetails from "@/app/shop/checkout/components/AddressDetails";
import PaymentDetails from "@/app/shop/checkout/components/PaymentDetails";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {CartItem, Order} from "@/interfaces";
import {calculateShipping} from "@/util";
import {redirect} from "next/navigation";

const CheckoutForm = () => {
    const [paymentType, setPaymentType] = useState("payhere")
    const [saveAddress, setSaveAddress] = useState(false)

    useEffect(() => {
        redirect("/down")
    }, []);
    const cartItems: CartItem[] = useSelector((state: RootState) => state.cartSlice.cart);
    const onPaymentFormSubmit = async (evt: any) => {
        evt.preventDefault()
        try {
            const form = evt.target;
            const formData = new FormData(form);
            const merchantSecret = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET;

            const hashedSecret = md5(merchantSecret).toString().toUpperCase();
            const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
            const orderId = window.crypto.randomUUID().toLowerCase();

            const currency = 'LKR';
            const amount = await getTotal();
            const amountFormated = parseFloat(amount).toLocaleString('en-us', {minimumFractionDigits: 2}).replaceAll(',', '');
            const hash = md5(merchantId + orderId + amountFormated + currency + hashedSecret).toString().toUpperCase();


            formData.set("merchant_id", merchantId);
            formData.set("return_url", `${process.env.NEXT_PUBLIC_BASE_URL}/shop/checkout/success`);
            formData.set("cancel_url", `${process.env.NEXT_PUBLIC_BASE_URL}/shop/checkout/fail`);
            formData.set("notify_url", `${process.env.NEXT_PUBLIC_BASE_URL}/api/payhere`);
            formData.set("first_name", evt.target.first_name.value);
            formData.set("last_name", evt.target.last_name.value);
            formData.set("email", evt.target.email.value);
            formData.set("phone", evt.target.phone.value);
            formData.set("address", evt.target.address.value);
            formData.set("city", evt.target.city.value);
            formData.set("country", "Sri Lanka");
            formData.set("order_id", orderId);
            formData.set("items", "Shoes and Accessories")
            formData.set("currency", currency);
            formData.set("amount", amount);
            formData.set("hash", hash);


            const submitForm = document.createElement('form');
            submitForm.method = 'POST';
            submitForm.action = process.env.NEXT_PUBLIC_PAYHERE_URL;

            // Append hidden input fields to the new form
            for (const [key, value] of formData.entries()) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                submitForm.appendChild(input);
            }

            document.body.appendChild(submitForm);

            const newOrder: Order = {
                createdAt: new Date(),
                items: cartItems,
                orderId: orderId,
                paymentId: "",
                status: "Pending",
                updatedAt: new Date()
            }
            if (cartItems.length !== 0) {
                if (paymentType == "payhere") {
                    //submitForm.submit();
                    console.log("Payhere")
                } else if (paymentType == "cod") {
                    console.log("COD")
                } else {
                    new Error("Payment type not found")
                }
            } else {
                console.log("Cart is empty")
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getTotal = async () => {
        let total = 0;
        cartItems.forEach((item: CartItem) => {
            total += item.price * item.quantity;
        })
        return total + calculateShipping(cartItems);
    }
    return (
        <div className="flex justify-center items-center">
            <form onSubmit={(evt) => onPaymentFormSubmit(evt)}
                  className="flex flex-row flex-wrap justify-evenly lg:gap-32 gap-10 md:gap-20 mt-10">
                <AddressDetails saveAddress={saveAddress} setSaveAddress={setSaveAddress}/>
                <PaymentDetails setPaymentType={setPaymentType} paymentType={paymentType}/>
            </form>
        </div>
    )
        ;
}

export default CheckoutForm;