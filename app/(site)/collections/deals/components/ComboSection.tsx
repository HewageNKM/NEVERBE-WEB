"use client";
import React, { useState } from "react";
import { ComboProduct } from "@/interfaces/BagItem";
import ComboCard from "./ComboCard";
import ComboModal from "./ComboModal";
import { AnimatePresence } from "framer-motion";

const ComboSection = ({ combos }: { combos: ComboProduct[] }) => {
  const [selectedCombo, setSelectedCombo] = useState<ComboProduct | null>(null);

  if (!combos || combos.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-black uppercase tracking-tight">
          Bundle & Save
        </h2>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {combos.map((combo) => (
          <ComboCard key={combo.id} combo={combo} onView={setSelectedCombo} />
        ))}
      </div>

      <AnimatePresence>
        {selectedCombo && (
          <ComboModal
            combo={selectedCombo}
            onClose={() => {
              const res = fetch("/api/v1/combos");
              setSelectedCombo(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComboSection;
