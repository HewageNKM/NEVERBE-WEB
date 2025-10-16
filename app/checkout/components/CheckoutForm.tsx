"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { Customer, Order } from "@/interfaces";
import { clearCart } from "@/redux/cartSlice/cartSlice";
import {
  calculateShippingCost,
  calculateSubTotal,
  calculateTotalDiscount,
  generateOrderId,
} from "@/util";
import {
  addNewOrder,
  initiateKOKOPayment,
  initiatePayHerePayment,
  requestOTP,
  verifyOTP,
} from "@/actions/orderAction";
import { signUser } from "@/firebase/firebaseClient";
import AddressDetails from "@/app/checkout/components/AddressDetails";
import PaymentDetails from "@/app/checkout/components/PaymentDetails";
import ComponentLoader from "@/components/ComponentLoader";
import ReCAPTCHA from "react-google-recaptcha";

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

  // OTP state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const savedCustomer = window.localStorage.getItem("neverbeCustomer");
    if (savedCustomer) setCustomer(JSON.parse(savedCustomer));
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const formatSriLankanPhoneNumber = (phone: string): string => {
    let digits = phone.replace(/\D/g, "");
    if (digits.startsWith("07") && digits.length === 10) return `94${digits.substring(1)}`;
    if (digits.startsWith("7") && digits.length === 9) return `94${digits}`;
    return digits;
  };

  const handleRequestOtp = async (phoneNumber: string) => {
    setOtpError(null);
    try {
      await requestOTP(formatSriLankanPhoneNumber(phoneNumber));
      setResendCooldown(60);
    } catch (err: any) {
      console.error(err);
      setOtpError(err.message || "Failed to send OTP. Try again.");
    }
  };

  const handleOtpVerification = async () => {
    if (!pendingOrder || !otp) {
      setOtpError("Please enter the OTP.");
      return;
    }
    setLoading(true);
    setOtpError(null);
    try {
      await verifyOTP(formatSriLankanPhoneNumber(pendingOrder.customer.phone), otp);
      await addNewOrder(pendingOrder, captchaValue as string);
      dispatch(clearCart());
      router.replace(`/checkout/success?orderId=${pendingOrder.orderId}`);
      setShowOtpModal(false);
      setOtp("");
      setPendingOrder(null);
    } catch (err: any) {
      console.error(err);
      setOtpError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (cartItems.length === 0) return alert("Your cart is empty.");
    if (!paymentType) return alert("Please select a payment method.");
    if (!captchaValue) return setCaptchaError(true);

    setLoading(true);
    setCaptchaError(false);

    const form = evt.currentTarget;
    const orderId = generateOrderId();
    const newCustomer = createCustomerFromForm(form);

    if (saveAddress) {
      window.localStorage.setItem("neverbeCustomer", JSON.stringify(newCustomer));
    } else {
      window.localStorage.removeItem("neverbeCustomer");
    }

    try {
      const userId = user?.uid || (await signUser())?.uid;
      const amount = calculateSubTotal(cartItems);
      const discount = calculateTotalDiscount(cartItems);

      const newOrder: Order = {
        orderId,
        userId: userId || "anonymous-user",
        customer: newCustomer,
        items: cartItems,
        amount: parseFloat(amount),
        paymentMethod: paymentType,
        shippingFee: calculateShippingCost(cartItems),
        paymentStatus: "Pending",
        from: "Website",
        discount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      switch (paymentType) {
        case "KOKO":
          await addNewOrder(newOrder, captchaValue);
          dispatch(clearCart());
          await processKokoPayment(orderId, newCustomer, amount);
          break;
        case "COD":
          setPendingOrder(newOrder);
          await handleRequestOtp(newCustomer.phone);
          setShowOtpModal(true);
          setLoading(false);
          break;
        case "PAYHERE":
          await addNewOrder(newOrder, captchaValue);
          dispatch(clearCart());
          await processPayherePayment(orderId, newCustomer, amount);
          break;
        default:
          throw new Error("Please select a valid payment method.");
      }
    } catch (err) {
      console.error(err);
      router.replace(`/checkout/fail?orderId=${orderId}`);
    }
  };

  const processPayherePayment = async (orderId: string, customer: Customer, amount: string) => {
    const amountFormatted = parseFloat(amount).toLocaleString("en-US", { minimumFractionDigits: 2 }).replace(/,/g, "");
    const [firstName, ...lastNameParts] = customer.name.split(" ");
    const lastName = lastNameParts.join(" ") || firstName;

    const payload = {
      orderId,
      amount: amountFormatted,
      firstName,
      lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      items: `${cartItems.length} Products`,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?orderId=${orderId}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/fail?orderId=${orderId}`,
      notifyUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ipg/payhere/notify`,
    };

    const payherePayload = await initiatePayHerePayment(payload);
    const form = document.createElement("form");
    form.method = "POST";
    form.action = process.env.NEXT_PUBLIC_PAYHERE_URL || "";
    form.style.display = "none";

    Object.entries(payherePayload).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const processKokoPayment = async (orderId: string, customer: Customer, amount: string) => {
    const amountFormatted = parseFloat(amount).toLocaleString("en-us", { minimumFractionDigits: 2 }).replaceAll(",", "");
    const [firstName, ...lastNameParts] = customer.name.split(" ");
    const payload = {
      orderId,
      amount: amountFormatted,
      firstName,
      lastName: lastNameParts.join(" ") || firstName,
      email: customer.email,
      description: `${cartItems.length} products`,
    };

    const kokoPayload = await initiateKOKOPayment(payload);
    const form = document.createElement("form");
    form.method = "POST";
    form.action = process.env.NEXT_PUBLIC_KOKO_REDIRECT_URL || "";
    form.style.display = "none";

    Object.entries(kokoPayload).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handlePaymentSubmit} className="flex flex-row flex-wrap justify-evenly gap-5 mt-10">
        <AddressDetails saveAddress={saveAddress} setSaveAddress={setSaveAddress} customer={customer} />
        <PaymentDetails setPaymentType={setPaymentType} paymentType={paymentType} captchaError={captchaError} setCaptchaError={setCaptchaError} setCaptchaValue={setCaptchaValue} recaptchaRef={recaptchaRef} />
      </form>

      {/* OTP Modal */}
      {showOtpModal && pendingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Verify Your Order</h2>
            <p className="text-center text-gray-600 mb-6">
              An OTP has been sent to <span className="font-semibold">{pendingOrder.customer.phone}</span>.
            </p>
            <div className="flex flex-col gap-4">
              <input
                type="tel"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="p-3 border-2 border-gray-300 rounded-lg text-center tracking-widest text-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                maxLength={6}
                autoComplete="one-time-code"
              />
              {otpError && <p className="text-red-500 text-sm text-center -mt-2">{otpError}</p>}
              <button onClick={handleOtpVerification} className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Place Order"}
              </button>
              <button onClick={() => { setShowOtpModal(false); setPendingOrder(null); setOtpError(null); setOtp(""); }} className="text-sm text-gray-500 hover:text-gray-800 transition-colors" disabled={loading}>
                Cancel
              </button>
              {resendCooldown === 0 ? (
                <button onClick={() => handleRequestOtp(pendingOrder.customer.phone)} className="text-sm text-blue-600 hover:text-blue-800 transition-colors mt-2" disabled={loading}>
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-gray-500 text-center mt-2">Resend in {resendCooldown}s</p>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && <ComponentLoader />}
    </div>
  );
};

export default CheckoutForm;
