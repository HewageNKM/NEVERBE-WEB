"use client";
import React from 'react';

const ComponentLoader = () => {
  return (
    <div className="absolute w-full h-full inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-30">
      {/* Gradient spinner with primary color trace */}
      <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-transparent border-t-primary-500 animate-spin shadow-md"></div>
    </div>
  );
};

export default ComponentLoader;
