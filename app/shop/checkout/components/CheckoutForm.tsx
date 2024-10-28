"use client"
import md5 from 'crypto-js/md5';
import React, {useEffect, useState} from 'react';
import AddressDetails from "@/app/shop/checkout/components/AddressDetails";
import PaymentDetails from "@/app/shop/checkout/components/PaymentDetails";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {CartItem, Customer, Order, OrderItem} from "@/interfaces";
import {addNewOrder, calculateShipping, generateOrderId} from "@/util";
import {paymentMethods} from "@/constants";
import {clearCart} from "@/redux/cartSlice/cartSlice";
import {redirect, useRouter} from "next/navigation";
import {Timestamp} from "@firebase/firestore";


const CheckoutForm = () => {
    const dispatch: AppDispatch = useDispatch();
    const [paymentType, setPaymentType] = useState("payhere")
    const [saveAddress, setSaveAddress] = useState(true)
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const [customer, setCustomer] = useState({
        address: "",
        city: "",
        createdAt: Timestamp.now(),
        email: "",
        id: "",
        name: "",
        phone: "",
        updatedAt: Timestamp.now()
    })

    const cartItems: CartItem[] = useSelector((state: RootState) => state.cartSlice.cart);
    const onPaymentFormSubmit = async (evt: any) => {
        setLoading(true)
        evt.preventDefault()

        try {
            const form = evt.target;
            const formData = new FormData(form);
            const merchantSecret = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET;

            const hashedSecret = md5(merchantSecret).toString().toUpperCase();
            const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
            const orderId = generateOrderId(paymentType.toUpperCase());

            const currency = 'LKR';
            const amount = await getTotal();
            const amountFormated = parseFloat(amount).toLocaleString('en-us', {minimumFractionDigits: 2}).replaceAll(',', '');
            const hash = md5(merchantId + orderId + amountFormated + currency + hashedSecret).toString().toUpperCase();

            if (!/^947\d{8}$/.test(evt.target.phone.value)) {
                alert("Invalid Format")
                return;
            }

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
                createdAt: Timestamp.now(),
                items: cartItems as OrderItem[],
                orderId: orderId,
                paymentId: "",
                paymentStatus: "Pending",
                paymentMethod: "",
                shippingCost: calculateShipping(cartItems),
                customer: customer,
                updatedAt: Timestamp.now()
            }

            const newCustomer: Customer = {
                address: evt.target.address.value,
                city: evt.target.city.value,
                createdAt: Timestamp.now(),
                email: evt.target.email.value,
                id: window.crypto.randomUUID().toLowerCase(),
                name: evt.target.first_name.value + " " + evt.target.last_name.value,
                phone: evt.target.phone.value,
                updatedAt: Timestamp.now()
            }
            newOrder.customer = newCustomer;
            setCustomer(newCustomer)
            if (cartItems.length !== 0) {
                if (paymentType == "payhere") {
                    newOrder.paymentMethod = paymentMethods.PayHere;
                    const response = await addNewOrder(newOrder);
                    if (response.status === 200) {
                        dispatch(clearCart())
                        setLoading(false)
                        saveAddressToLocalStorage()
                        submitForm.submit();
                    } else {
                        console.log("Error adding order")
                    }

                } else if (paymentType == "cod") {
                    newOrder.paymentMethod = paymentMethods.COD;
                    const response = await addNewOrder(newOrder);
                    if (response.status === 200) {
                        dispatch(clearCart())
                        setLoading(false)
                        saveAddressToLocalStorage()
                        router.replace("/shop/checkout/success?order_id=" + orderId)
                    } else {
                        console.log("Error adding order")
                    }
                } else {
                    new Error("Payment type not found")
                }
            } else {
                console.log("Cart is empty")
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
            saveAddressToLocalStorage()
        }
    }
    useEffect(() => {
        const customer = window.localStorage.getItem("neverbeCustomer");
        if (customer) {
            setCustomer(JSON.parse(customer as string) as Customer)
        }
    }, []);

    const getTotal = async () => {
        let total = 0;
        cartItems.forEach((item: CartItem) => {
            total += item.price * item.quantity;
        })
        return total + calculateShipping(cartItems);
    }

    const saveAddressToLocalStorage = () => {
        if (saveAddress) {
            window.localStorage.setItem("neverbeCustomer", JSON.stringify(customer))
        } else {
            window.localStorage.removeItem("neverbeCustomer")
        }
    }
    return (
        <div className="flex justify-center items-center">
            <form onSubmit={(evt) => onPaymentFormSubmit(evt)}
                  className="flex flex-row flex-wrap justify-evenly lg:gap-32 gap-10 md:gap-20 mt-10">
                <AddressDetails saveAddress={saveAddress} setSaveAddress={setSaveAddress} customer={customer}/>
                <PaymentDetails setPaymentType={setPaymentType} paymentType={paymentType}/>
            </form>
            {loading && <div
                className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                <div className='flex space-x-2 justify-center items-center h-screen'>
                    <span className='sr-only'>Loading...</span>
                    <div className='h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                    <div className='h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                    <div className='h-8 w-8 bg-white rounded-full animate-bounce'></div>
                </div>
            </div>}
        </div>
    )
        ;
}

export default CheckoutForm;