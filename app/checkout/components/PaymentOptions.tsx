"use client";
import React, { useEffect, useState } from "react";
import { PaymentMethod } from "@/interfaces";
import { getWebsitePaymentMethods } from "@/actions/paymentMethodsAction";

const PaymentOptions = ({
  setPaymentType,
  paymentType,
}: {
  setPaymentType: React.Dispatch<React.SetStateAction<string>>;
  paymentType: string;
}) => {
  const [paymentOptions, setPaymentOptions] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const methods: PaymentMethod[] = await getWebsitePaymentMethods();
      setPaymentOptions(methods);
      if (methods.length > 0) setPaymentType(methods[0].name || "");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ul className="mt-5 flex flex-col gap-4">
      {paymentOptions.map((option, index) => (
        <li
          key={index}
          onClick={() => setPaymentType(option.name)}
          className={`flex items-center gap-4 p-4 border rounded-lg transition-all cursor-pointer 
            ${
              paymentType === option.name
                ? "border-primary bg-primary/10 shadow-md"
                : "border-gray-200 hover:shadow hover:bg-gray-50"
            }`}
        >
          <input
            type="radio"
            name="payment"
            value={option.name}
            checked={option.name === paymentType}
            onChange={() => setPaymentType(option.name)}
            className="form-radio h-5 w-5 text-primary focus:ring focus:ring-primary/50"
          />
          <div className="flex flex-col">
            <label className="text-gray-900 font-semibold text-lg cursor-pointer">
              {option.name}
            </label>
            {option.description && (
              <p className="text-gray-500 text-sm mt-1">{option.description}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PaymentOptions;
