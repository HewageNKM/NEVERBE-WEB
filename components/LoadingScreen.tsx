import React from 'react';
import Lottie from "lottie-react";
import {PageLoadingAnimation} from "@/assets/animation";

const LoadingScreen = () => {
    return (
        <div className="bg-white flex gap-10 flex-col justify-center items-center min-h-screen p-5">
            <Lottie animationData={PageLoadingAnimation} className="w-[18rem] md:w-[25rem]"/>
            <p className="text-primary text-lg md:text-xl text-center font-light">© {new Date().getFullYear()} NEVERBE. All rights Reserved.</p>
        </div>
    );
};

export default LoadingScreen;