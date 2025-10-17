"use client";

import React from "react";
import { PaymentMethod } from "@/interfaces";

interface PaymentOptionsProps {
  paymentOptions: PaymentMethod[];
  paymentType: string;
  setPaymentType: React.Dispatch<React.SetStateAction<string>>;
  setPaymentTypeId: React.Dispatch<React.SetStateAction<string>>;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  paymentOptions,
  paymentType,
  setPaymentType,
  setPaymentTypeId,
}) => {
  const handleSelect = (option: PaymentMethod) => {
    setPaymentType(option.name);
    setPaymentTypeId(option.paymentId);
  };

  return (
    <ul className="mt-5 flex flex-col gap-4">
      {paymentOptions.map((option) => (
        <li
          key={option.paymentId}
          onClick={() => handleSelect(option)}
          className={`flex items-start gap-4 p-4 border rounded-lg transition-all cursor-pointer
            ${
              paymentType === option.name
                ? "border-primary bg-primary/10 shadow-md"
                : "border-gray-200 hover:shadow hover:bg-gray-50"
            }`}
        >
          <input
            id={`payment-${option.paymentId}`}
            type="radio"
            name="payment"
            value={option.name}
            checked={option.name === paymentType}
            onChange={() => handleSelect(option)}
            className="form-radio h-5 w-5 text-primary focus:ring focus:ring-primary/50 mt-1"
          />
          <div className="flex flex-col">
            <label
              htmlFor={`payment-${option.paymentId}`}
              className="text-gray-900 font-semibold text-lg cursor-pointer"
            >
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
