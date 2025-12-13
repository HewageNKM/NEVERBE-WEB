"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

interface SizeGuideDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const menSizes = [
  { us: "7", uk: "6", eu: "40", cm: "25" },
  { us: "7.5", uk: "6.5", eu: "40.5", cm: "25.5" },
  { us: "8", uk: "7", eu: "41", cm: "26" },
  { us: "8.5", uk: "7.5", eu: "42", cm: "26.5" },
  { us: "9", uk: "8", eu: "42.5", cm: "27" },
  { us: "9.5", uk: "8.5", eu: "43", cm: "27.5" },
  { us: "10", uk: "9", eu: "44", cm: "28" },
  { us: "10.5", uk: "9.5", eu: "44.5", cm: "28.5" },
  { us: "11", uk: "10", eu: "45", cm: "29" },
  { us: "11.5", uk: "10.5", eu: "45.5", cm: "29.5" },
  { us: "12", uk: "11", eu: "46", cm: "30" },
];

const womenSizes = [
  { us: "5", uk: "2.5", eu: "35.5", cm: "22" },
  { us: "5.5", uk: "3", eu: "36", cm: "22.5" },
  { us: "6", uk: "3.5", eu: "36.5", cm: "23" },
  { us: "6.5", uk: "4", eu: "37.5", cm: "23.5" },
  { us: "7", uk: "4.5", eu: "38", cm: "24" },
  { us: "7.5", uk: "5", eu: "38.5", cm: "24.5" },
  { us: "8", uk: "5.5", eu: "39", cm: "25" },
  { us: "8.5", uk: "6", eu: "40", cm: "25.5" },
  { us: "9", uk: "6.5", eu: "40.5", cm: "26" },
  { us: "9.5", uk: "7", eu: "41", cm: "26.5" },
  { us: "10", uk: "7.5", eu: "42", cm: "27" },
];

const kidSizes = [
  { us: "10C", uk: "9.5", eu: "27", cm: "16" },
  { us: "11C", uk: "10.5", eu: "28", cm: "17" },
  { us: "12C", uk: "11.5", eu: "29.5", cm: "18" },
  { us: "13C", uk: "12.5", eu: "31", cm: "19" },
  { us: "1Y", uk: "13.5", eu: "32", cm: "20" },
  { us: "2Y", uk: "1.5", eu: "33.5", cm: "21" },
  { us: "3Y", uk: "2.5", eu: "35", cm: "22" },
  { us: "4Y", uk: "3.5", eu: "36", cm: "23" },
  { us: "5Y", uk: "4.5", eu: "37.5", cm: "23.5" },
  { us: "6Y", uk: "5.5", eu: "38.5", cm: "24" },
];

const SizeGuideDialog: React.FC<SizeGuideDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"men" | "women" | "kids">("men");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-[90%] md:w-full max-w-2xl max-h-[85vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-100 shrink-0">
              <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight">
                Size Guide
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 overflow-y-auto">
              <p className="text-sm text-gray-500 mb-6">
                Use this chart to find your perfect fit. If you vary between
                sizes, we recall ordering the next size up.
              </p>

              {/* Tabs */}
              <div className="flex gap-4 mb-6 border-b border-gray-100">
                {(["men", "women", "kids"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-sm font-bold uppercase tracking-wide transition-colors relative ${
                      activeTab === tab
                        ? "text-black"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="tab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap md:whitespace-normal">
                  <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-700">
                    <tr>
                      <th className="px-3 py-2 md:px-6 md:py-3 rounded-tl-lg">
                        US Match
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3">UK Match</th>
                      <th className="px-3 py-2 md:px-6 md:py-3">EU Match</th>
                      <th className="px-3 py-2 md:px-6 md:py-3 rounded-tr-lg">
                        CM Length
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(activeTab === "men"
                      ? menSizes
                      : activeTab === "women"
                      ? womenSizes
                      : kidSizes
                    ).map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-2 md:px-6 md:py-4 font-bold">
                          {row.us}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 text-gray-600">
                          {row.uk}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 text-gray-600">
                          {row.eu}
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 text-gray-600">
                          {row.cm}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-xs text-gray-400">
                * Sizes may vary slightly by manufacturer. This is a general
                guide.
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SizeGuideDialog;
