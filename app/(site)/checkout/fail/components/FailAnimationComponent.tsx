"use client"
import React from 'react';
import Lottie from "lottie-react";
import {FailAnimation} from "@/assets/animation";

const FailAnimationComponent = () => {
    return (
        <figure>
            <Lottie animationData={FailAnimation} className="lg:w-[10vw] md:w-[15vw] w-[22vw]"/>
        </figure>
    );
};

export default FailAnimationComponent;