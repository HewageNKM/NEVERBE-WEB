"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { Customer, Order } from "@/interfaces";
import { clearCart } from "@/redux/cartSlice/cartSlice";
import { calculateSubTotal, generateOrderId } from "@/util";
import { addNewOrder } from "@/actions/orderAction";
import { signUser } from "@/firebase/firebaseClient";
import AddressDetails from "@/app/checkout/components/AddressDetails";
import PaymentDetails from "@/app/checkout/components/PaymentDetails";
import ComponentLoader from "@/components/ComponentLoader";
import ReCAPTCHA from "react-google-recaptcha";

// Helper to create a customer object from form data
const createCustomerFromForm = (form: any): Customer => {
  const name = `${form.first_name.value} ${form.last_name.value}`;
  return {
    name,
    email: form.email.value,
    phone: form.phone.value,
    address: form.address.value,
    city: form.city.value,
    zip: form.zip.value || "",
    id: window.crypto.randomUUID().toLowerCase(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const CheckoutForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cartSlice.cart);
  const user = useSelector((state: RootState) => state.authSlice.user);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [paymentType, setPaymentType] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(true);
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);
  const recaptchaRef = React.createRef<ReCAPTCHA>();

  useEffect(() => {
    const savedCustomer = window.localStorage.getItem("neverbeCustomer");
    if (savedCustomer) {
      setCustomer(JSON.parse(savedCustomer));
    }
  }, []);

  const handlePaymentSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    if (!captchaValue) {
      setCaptchaError(true);
      return;
    }
    setLoading(true);

    const form = evt.currentTarget;
    const orderId = generateOrderId();
    const newCustomer = createCustomerFromForm(form);

    if (saveAddress) {
      window.localStorage.setItem(
        "neverbeCustomer",
        JSON.stringify(newCustomer)
      );
    } else {
      window.localStorage.removeItem("neverbeCustomer");
    }

    try {
      const userId = user?.uid || (await signUser())?.uid;
      const amount = calculateSubTotal(cartItems);

      const newOrder: Order = {
        orderId,
        userId,
        customer: newCustomer,
        items: cartItems,
        amount: parseFloat(amount),
        paymentMethod: paymentType || "Unknown",
        paymentStatus: "Pending",
        from: "Website",
        discount: cartItems.reduce(
          (acc, item) => acc + (item.discount || 0),
          0
        ),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addNewOrder(newOrder, captchaValue);
      dispatch(clearCart());

      switch (paymentType) {
        case "KOKO":
          await processKokoPayment(orderId, newCustomer, amount);
          break;
        case "COD":
          router.replace(`/checkout/success?orderId=${orderId}`);
          break;
        default:
          setLoading(false);
          throw new Error("Please select a valid payment method.");
      }
    } catch (error) {
      console.error("Payment processing failed:", error);
      router.replace(`/checkout/fail?orderId=${orderId}`);
    } finally {
      if (paymentType === "COD") {
        setLoading(false);
      }
    }
  };

  const processKokoPayment = async (
    orderId: string,
    customer: Customer,
    amount: string
  ) => {
    const amountFormatted = parseFloat(amount)
      .toLocaleString("en-us", { minimumFractionDigits: 2 })
      .replaceAll(",", "");
    const [firstName, ...lastNameParts] = customer.name.split(" ");

    // Call your Next.js API route that signs and prepares Koko payload
    const response = await fetch("/api/v1/koko/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        amount: amountFormatted,
        firstName,
        lastName: lastNameParts.join(" ") || firstName,
        email: customer.email,
        description: `${cartItems.length} products`,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to initialize Koko payment.");
    }

    const kokoPayload = await response.json();

    // Convert JSON payload into application/x-www-form-urlencoded
    const formBody = new URLSearchParams();
    for (const key in kokoPayload) {
      if (Object.prototype.hasOwnProperty.call(kokoPayload, key)) {
        formBody.append(key, kokoPayload[key]);
      }
    }

    // Create and submit an HTML form for redirection
    const form = document.createElement("form");
    form.method = "POST";
    form.action = process.env.NEXT_PUBLIC_KOKO_REDIRECT_URL || "";
    form.style.display = "none";

    for (const [key, value] of formBody.entries()) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handlePaymentSubmit}
        className="flex flex-row flex-wrap justify-evenly lg:gap-32 gap-10 md:gap-20 mt-10"
      >
        <AddressDetails
          saveAddress={saveAddress}
          setSaveAddress={setSaveAddress}
          customer={customer}
        />
        <PaymentDetails
          setPaymentType={setPaymentType}
          paymentType={paymentType}
          captchaError={captchaError}
          setCaptchaError={setCaptchaError}
          setCaptchaValue={setCaptchaValue}
          recaptchaRef={recaptchaRef}
        />
      </form>
      {loading && <ComponentLoader />}
    </div>
  );
};

export default CheckoutForm;
