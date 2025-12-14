"use client";
import React from "react";
import { PaymentMethod } from "@/interfaces/BagItem";

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
  setPaymentFee,
}) => {
  const handleSelect = (option: PaymentMethod) => {
    setPaymentType(option.name);
    setPaymentTypeId(option.paymentId);
    setPaymentFee(option.fee);
  };

  return (
    <div className="space-y-3">
      {paymentOptions.map((option) => {
        const isSelected = option.name === paymentType;
        return (
          <div
            key={option.paymentId}
            onClick={() => handleSelect(option)}
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-all bg-white ${
              isSelected
                ? "border-black shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* Custom Radio Circle */}
            <div
              className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                isSelected ? "border-black" : "border-gray-300"
              }`}
            >
              {isSelected && <div className="h-2 w-2 rounded-full bg-black" />}
            </div>

            <div>
              <p
                className={`text-sm font-bold uppercase tracking-wide ${
                  isSelected ? "text-black" : "text-gray-600"
                }`}
              >
                {option.name}
              </p>
              {option.description && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentOptions;
