"use client"
import React from 'react';
import Lottie from "lottie-react";
import {SuccessAnimation} from "@/assets/animation";
const SuccessAnimationComponents = () => {
    return (
        <figure>
            <Lottie animationData={SuccessAnimation} className="lg:w-[10vw] md:w-[15vw] w-[22vw]"/>
        </figure>
    );
};

export default SuccessAnimationComponents;