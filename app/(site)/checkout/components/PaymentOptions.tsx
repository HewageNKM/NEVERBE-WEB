"use client";
import React from "react";
import { PaymentMethod } from "@/interfaces";

interface PaymentOptionsProps {
  paymentOptions: PaymentMethod[];
  paymentType: string;
  setPaymentType: React.Dispatch<React.SetStateAction<string>>;
  setPaymentTypeId: React.Dispatch<React.SetStateAction<string>>;
  setPaymentFee: React.Dispatch<React.SetStateAction<number>>;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  paymentOptions,
  paymentType,
  setPaymentType,
  setPaymentTypeId,
  setPaymentFee
}) => {
  const handleSelect = (option: PaymentMethod) => {
    setPaymentType(option.name);
    setPaymentTypeId(option.paymentId);
    setPaymentFee(option.fee);
  };

  return (
    <ul className="space-y-4">
      {paymentOptions.map((option) => {
        const isSelected = option.name === paymentType;
        return (
          <li
            key={option.paymentId}
            onClick={() => handleSelect(option)}
            className={`flex items-start gap-3 p-4 border rounded-xl transition cursor-pointer ${
              isSelected
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
            }`}
          >
            <input
              id={`payment-${option.paymentId}`}
              type="radio"
              name="payment"
              value={option.name}
              checked={isSelected}
              onChange={() => handleSelect(option)}
              className="h-5 w-5 text-primary focus:ring-primary/40 mt-1"
            />
            <div>
              <label
                htmlFor={`payment-${option.paymentId}`}
                className="font-semibold text-gray-900 text-base cursor-pointer"
              >
                {option.name}
              </label>
              {option.description && (
                <p className="text-gray-500 text-sm mt-1">
                  {option.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default PaymentOptions;
