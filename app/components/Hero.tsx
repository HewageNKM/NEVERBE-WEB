import React from 'react';
import ImagesSlider from "@/app/components/ImagesSlider";
import Link from "next/link";
import {BiCart} from "react-icons/bi";
import {Slide} from "@/interfaces";

const Hero = async ({slides}: { slides: Slide[] }) => {
    return (
        <section className="w-full mt-16 lg:mt-[7rem] flex flex-col gap-5">
            <ImagesSlider images={slides}/>
            <div className="md:mt5 mt-3 px-3 lg:px-8">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 text-center">
                    Welcome to <span className="text-primary-100 font-semibold">NEVERBE</span>
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 text-center mt-5">
                    The best place to shop for your favorite products
                </p>
                <div className="flex flex-row justify-evenly md:gap-10 gap-5">
                </div>
                <div className="flex justify-center mt-5">
                    <Link href="/collections/products"
                        className="flex items-center px-6 py-3 bg-primary-100 text-white rounded-lg hover:bg-primary-200
                        transition-all text-lg">
                        <BiCart size={24} className="mr-2"/>
                        Shop All

                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
