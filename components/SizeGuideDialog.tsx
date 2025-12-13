"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

interface SizeGuideDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeGuideDialog: React.FC<SizeGuideDialogProps> = ({
  isOpen,
  onClose,
}) => {
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
                    {[
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
                    ].map((row, idx) => (
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
