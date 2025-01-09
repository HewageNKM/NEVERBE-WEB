import React from 'react';
import ImagesSlider from "@/app/components/ImagesSlider";
import Link from "next/link";
import {BiCart} from "react-icons/bi";
import {Slide} from "@/interfaces";

const Hero = async ({slides}: { slides: Slide[] }) => {
    return (
        <section className="w-full mt-16 lg:mt-[7rem]">
            <ImagesSlider images={slides}/>
        </section>
    );
};

export default Hero;
