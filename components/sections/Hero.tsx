'use client';
import React, {useEffect, useState} from 'react';
import BorderButton from "@/components/BorderButton";
import Slider from "@/components/Slider";
import {Skeleton} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@/lib/store";
import {getSliders} from "@/lib/features/sliderSlice/sliderSlice";

const Hero = () => {
    const dispatch:AppDispatch = useDispatch();
    const {sliders, isLoading} = useSelector(state => state.sliderSlice)
    useEffect(() => {
       dispatch(getSliders())
    }, [dispatch])
    return (
        <div className="relative mt-16 lg:mt-8">
            {isLoading ? (
                <Skeleton animation="wave" sx={{width: '96vw', height: '90vh', background: "rgb(243 244 246)"}}/>) : (
                <div>
                    <Slider images={sliders} imageStyles="w-full h-[40vh] lg:h-[80vh] bg-cover"/>
                    <div className="absolute flex-col gap-7 flex z-30 bottom-10 left-10 lg:bottom-16 lg:left-16">
                        <h2 className="text-xl line-clamp-2 lg:line-clamp-1 font-semibold text-white">Wear It, Like You
                            Never Before</h2>
                        <BorderButton
                            buttonStyles="border-[1.4px] absolute -top-1.5 -left-1.5 p-1 w-[8rem] h-[2.4rem] text-center border-white lg:text-xl text-sm text-white hover:text-black hover:bg-white"
                            title="Shop Now" imageUrl=""
                            containerStyles="relative border-[1.4px] border-white w-[8rem] h-[2.4rem]"/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hero;