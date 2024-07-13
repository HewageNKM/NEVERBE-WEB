'use client';
import React, {useEffect, useState} from 'react';
import {getSliders} from "@/firebase/Firebase";
import CustomButton from "@/components/CustomButton";
import Slider from "@/components/Slider";

const Hero = () => {

    const [sliders, setSliders] = useState([{}])
    const fetchSliders = async () => {
        const sliders = await getSliders();
        setSliders(sliders);
    }
    useEffect(() => {
        fetchSliders();
    }, [])
    return (
        <div className="relative mt-16 lg:mt-8">
            <Slider images={sliders}/>
            <div className="absolute flex-col gap-7 flex z-30 bottom-10 left-10 lg:bottom-16 lg:left-16">
                <h2 className="text-xl line-clamp-1 font-semibold text-white">Wear It, Like You Never Before</h2>
                <CustomButton
                    buttonStyles="border-[1.4px] absolute -top-1.5 -left-1.5 p-1 w-[8rem] h-[2.4rem] text-center border-white lg:text-xl text-sm text-white hover:text-black hover:bg-white"
                    title="Shop Now" imageUrl=""
                    containerStyles="relative border-[1.4px] border-white w-[8rem] h-[2.4rem]"/>
            </div>
        </div>
    );
};

export default Hero;