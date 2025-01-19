"use client"
import md5 from 'crypto-js/md5';
import React, {useEffect, useState} from 'react';
import AddressDetails from "@/app/checkout/components/AddressDetails";
import PaymentDetails from "@/app/checkout/components/PaymentDetails";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {CartItem, Customer, Order, OrderItem} from "@/interfaces";
import {clearCart} from "@/redux/cartSlice/cartSlice";
import {useRouter} from "next/navigation";
import {calculateSubTotal, generateOrderId} from "@/util";
import {addNewOrder} from "@/actions/orderAction";
import ComponentLoader from "@/components/ComponentLoader";
import ReCAPTCHA from "react-google-recaptcha";
import {auth} from "@/firebase/firebaseClient";


const CheckoutForm = () => {
    const dispatch: AppDispatch = useDispatch();
    const [paymentType, setPaymentType] = useState(null)
    const [saveAddress, setSaveAddress] = useState(true)
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const [captchaValue, setCaptchaValue] = useState<string | null>(null);
    const [captchaError, setCaptchaError] = useState(false);
    const recaptchaRef = React.createRef<ReCAPTCHA>();

    const [customer, setCustomer] = useState({
        address: "",
        city: "",
        createdAt: new Date().toLocaleString(),
        email: "",
        id: "",
        name: "",
        phone: "",
        updatedAt: new Date().toLocaleString()
    })

    const cartItems: CartItem[] = useSelector((state: RootState) => state.cartSlice.cart);
    const onPaymentFormSubmit = async (evt: any) => {
        let orderId = "";
        try {
            setLoading(true)
            evt.preventDefault()

            if (!captchaValue) {
                setCaptchaError(true)
                setLoading(false)
                return;
            }
            const userId = auth.currentUser?.uid || null;
            const form = evt.target;
            const formData = new FormData(form);
            const merchantSecret = process.env.NEXT_PUBLIC_IPG_MERCHANT_SECRET;

            const hashedSecret = md5(merchantSecret).toString().toUpperCase();
            const merchantId = process.env.NEXT_PUBLIC_IPG_MERCHANT_ID;
            orderId = generateOrderId("Website");

            const currency = 'LKR';
            const amount = calculateSubTotal(cartItems)
            const amountFormated = parseFloat(amount).toLocaleString('en-us', {minimumFractionDigits: 2}).replaceAll(',', '');
            const hash = md5(merchantId + orderId + amountFormated + currency + hashedSecret).toString().toUpperCase();

            if (!/^07\d{8}$/.test(evt.target.phone.value)) {
                alert("Invalid mobile number")
                return;
            }

            formData.set("merchant_id", merchantId);
            formData.set("return_url", `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`);
            formData.set("cancel_url", `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/fail`);
            formData.set("notify_url", `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ipg`);
            formData.set("first_name", evt.target.first_name.value);
            formData.set("last_name", evt.target.last_name.value);
            formData.set("email", evt.target.email.value);
            formData.set("phone", evt.target.phone.value.replace(/^0/, '94').trim());
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
            submitForm.action = process.env.NEXT_PUBLIC_IPG_URL;

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
                userId: userId,
                feesAndCharges: 0,
                from: "Website",
                items: cartItems as OrderItem[],
                orderId: orderId,
                paymentId: null,
                paymentStatus: "Pending",
                paymentMethod: "",
                customer: customer,
                updatedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
            }

            const newCustomer: Customer = {
                zip: evt.target.zip.value,
                address: evt.target.address.value,
                city: evt.target.city.value,
                email: evt.target.email.value,
                id: window.crypto.randomUUID().toLowerCase(),
                name: evt.target.first_name.value + " " + evt.target.last_name.value,
                phone: evt.target.phone.value,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            newOrder.customer = newCustomer;
            setCustomer(newCustomer)
            if (cartItems.length !== 0) {
                if (paymentType == "PAYHERE") {
                    newOrder.paymentMethod = paymentType;
                    console.log(newOrder)
                    await addNewOrder(newOrder, captchaValue);
                    dispatch(clearCart())
                    setLoading(false)
                    submitForm.submit();
                } else if (paymentType == "COD") {
                    newOrder.paymentMethod = paymentType;
                    console.log(newOrder)
                    await addNewOrder(newOrder, captchaValue);
                    dispatch(clearCart())
                    router.replace("/checkout/success?order_id=" + orderId)
                } else if ("KOKO") {
                    // Implement KOKO payment method
                } else {
                    new Error("Payment type not found")
                }
            } else {
                console.log("Cart is empty")
            }
        } catch (e) {
            console.log(e)
            router.replace("/checkout/fail?order_id=" + orderId)
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
                <PaymentDetails setPaymentType={setPaymentType} paymentType={paymentType} captchaError={captchaError}
                                setCaptchaError={setCaptchaError} setCaptchaValue={setCaptchaValue}
                                recaptchaRef={recaptchaRef}
                />
            </form>
            {loading && <ComponentLoader/>}
        </div>
    )
}

export default CheckoutForm;