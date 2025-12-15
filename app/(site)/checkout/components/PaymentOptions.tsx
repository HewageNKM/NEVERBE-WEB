"use client";
import React from "react";
import { PaymentMethod } from "@/interfaces/BagItem";
import { IoCheckmark } from "react-icons/io5";

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
    <div className="flex flex-col gap-3">
      {paymentOptions.map((option) => {
        const isSelected = option.name === paymentType;

        return (
          <div
            key={option.paymentId}
            onClick={() => handleSelect(option)}
            className={`
              relative group cursor-pointer border p-4 transition-all duration-200 ease-out
              ${
                isSelected
                  ? "bg-black border-black text-white shadow-lg scale-[1.01]"
                  : "bg-white border-gray-300 text-black hover:border-black"
              }
            `}
          >
            <div className="flex items-start gap-4">
              {/* Industrial "Radio" Square */}
              <div
                className={`
                  flex items-center justify-center h-5 w-5 shrink-0 border transition-colors
                  ${
                    isSelected
                      ? "border-white bg-white text-black"
                      : "border-gray-400 group-hover:border-black bg-transparent"
                  }
                `}
              >
                {isSelected && (
                  <IoCheckmark size={14} className="stroke-[3px]" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center w-full">
                  <p
                    className={`text-sm font-black uppercase tracking-wider ${
                      isSelected ? "text-white" : "text-black"
                    }`}
                  >
                    {option.name}
                  </p>

                  {/* Fee Indicator Tag */}
                  {option.fee > 0 ? (
                    <span
                      className={`
                        text-[10px] font-bold px-1.5 py-0.5 border uppercase tracking-widest
                        ${
                          isSelected
                            ? "border-white text-white"
                            : "border-black text-black bg-gray-100"
                        }
                      `}
                    >
                      +Rs.{option.fee}%
                    </span>
                  ) : (
                    <span
                      className={`
                        text-[10px] font-bold uppercase tracking-widest opacity-60
                        ${isSelected ? "text-gray-300" : "text-gray-400"}
                       `}
                    >
                      No Fee
                    </span>
                  )}
                </div>

                {option.description && (
                  <p
                    className={`
                      text-[10px] font-medium uppercase tracking-wide mt-1.5
                      ${isSelected ? "text-gray-300" : "text-gray-500"}
                    `}
                  >
                    {option.description}
                  </p>
                )}
              </div>
            </div>

            {/* Corner Accent for Selected State */}
            {isSelected && (
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white opacity-50" />
            )}
            {isSelected && (
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white opacity-50" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PaymentOptions;
