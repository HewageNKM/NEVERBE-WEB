"use client";
import React from "react";
import { PaymentMethod } from "@/interfaces";
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
              relative group cursor-pointer border p-3 md:p-4 transition-all duration-300 rounded-xl overflow-hidden text-primary-dark
              ${
                isSelected
                  ? "bg-bg-secondary border-accent shadow-sm scale-[1.01] ring-1 ring-accent"
                  : "bg-surface border-default hover:border-strong hover:shadow-sm"
              }
            `}
          >
            <div className="flex items-start gap-4">
              {/* NEVERBE Style Radio Button */}
              <div
                className={`
                  flex items-center justify-center h-5 w-5 shrink-0 border-2 rounded-full transition-all
                  ${
                    isSelected
                      ? "border-accent bg-accent text-white"
                      : "border-default group-hover:border-accent bg-transparent"
                  }
                `}
              >
                {isSelected && (
                  <IoCheckmark size={12} className="stroke-[3px]" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center w-full">
                  <p
                    className={`text-sm font-display font-black uppercase tracking-wider ${
                      isSelected ? "text-primary-dark" : "text-primary-dark"
                    }`}
                  >
                    {option.name}
                  </p>

                  {/* Fee Indicator Tag */}
                  {option.fee > 0 ? (
                    <span
                      className={`
                        text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest
                        ${
                          isSelected
                            ? "bg-accent text-white"
                            : "bg-surface-2 text-primary-dark"
                        }
                      `}
                    >
                      +Rs.{option.fee}%
                    </span>
                  ) : (
                    <span
                      className={`
                        text-[10px] font-black uppercase tracking-widest
                        ${isSelected ? "text-accent" : "text-muted"}
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
                      ${isSelected ? "text-accent" : "text-muted"}
                    `}
                  >
                    {option.description}
                  </p>
                )}
              </div>
            </div>

            {/* Corner Accent for Selected State */}
            {isSelected && (
              <div className="absolute top-0 right-0 w-4 h-4 bg-accent rounded-bl-xl" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PaymentOptions;
