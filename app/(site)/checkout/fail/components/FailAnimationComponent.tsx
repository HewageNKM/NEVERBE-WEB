"use client";
import React from "react";
import Lottie from "lottie-react";
import { FailAnimation } from "@/assets/animation";

const FailAnimationComponent = () => {
  return (
    <figure className="flex justify-center mb-6">
      <Lottie
        animationData={FailAnimation}
        loop={false}
        className="w-24 h-24 md:w-32 md:h-32"
      />
    </figure>
  );
};

export default FailAnimationComponent;
