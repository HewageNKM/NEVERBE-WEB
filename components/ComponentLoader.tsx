"use client";
import React from "react";

const ComponentLoader = () => {
  return (
    <div className="absolute w-full h-full inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
      <div className="w-8 h-8 rounded-full border-[3px] border-gray-200 border-t-black animate-spin"></div>
    </div>
  );
};

export default ComponentLoader;
