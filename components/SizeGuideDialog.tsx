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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with High-End Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface/80 backdrop-blur-xl"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative bg-surface w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-hover border border-default overflow-hidden flex flex-col"
          >
            {/* Header: Performance Style */}
            <div className="flex justify-between items-center p-6 md:px-8 border-b border-default shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent italic">
                  Blueprint
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-black uppercase italic tracking-tighter text-primary">
                  Size Guide
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-surface-2 text-primary hover:bg-dark hover:text-inverse transition-all rounded-full shadow-sm"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Content Container */}
            <div className="p-6 md:p-8 overflow-y-auto hide-scrollbar">
              <p className="text-base text-muted mb-8 font-medium leading-relaxed">
                Ensure the perfect fit for your high-performance gear. If you
                are between sizes, we recommend ordering the next size up for
                optimal comfort.
              </p>

              {/* Performance Tabs */}
              <div className="flex gap-6 mb-8 border-b border-default">
                {(["men", "women", "kids"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                      activeTab === tab
                        ? "text-accent italic"
                        : "text-muted hover:text-primary"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTabGuide"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-accent shadow-[0_0_10px_#97e13e]"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Data Table: Technical Spec Look */}
              <div className="overflow-x-auto rounded-xl border border-default">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-dark text-accent">
                    <tr>
                      <th className="px-6 py-4 font-display font-black uppercase italic tracking-tighter">
                        US Size
                      </th>
                      <th className="px-6 py-4 font-display font-black uppercase italic tracking-tighter border-l border-white/10">
                        UK Size
                      </th>
                      <th className="px-6 py-4 font-display font-black uppercase italic tracking-tighter border-l border-white/10">
                        EU Size
                      </th>
                      <th className="px-6 py-4 font-display font-black uppercase italic tracking-tighter border-l border-white/10">
                        CM Length
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-default bg-surface">
                    {(activeTab === "men"
                      ? menSizes
                      : activeTab === "women"
                      ? womenSizes
                      : kidSizes
                    ).map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-surface-2 transition-colors group"
                      >
                        <td className="px-6 py-4 font-black text-primary text-base italic tracking-tighter group-hover:text-accent transition-colors">
                          {row.us}
                        </td>
                        <td className="px-6 py-4 text-muted font-bold border-l border-default">
                          {row.uk}
                        </td>
                        <td className="px-6 py-4 text-muted font-bold border-l border-default">
                          {row.eu}
                        </td>
                        <td className="px-6 py-4 text-muted font-bold border-l border-default">
                          {row.cm}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Disclaimer */}
              <div className="mt-8 flex items-center gap-3 p-4 bg-surface-2 rounded-lg border border-default">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <p className="text-[11px] text-muted font-bold uppercase tracking-widest">
                  Note: Technical specifications may vary slightly by
                  manufacturer.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SizeGuideDialog;
