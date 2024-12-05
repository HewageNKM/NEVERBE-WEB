import React from 'react';
import ImagesSlider from "@/app/components/ImagesSlider";
import Link from "next/link";
import {BiCart} from "react-icons/bi";
import {Slide} from "@/interfaces";

const Hero = async ({slides}: { slides: Slide[] }) => {
    return (
        <section className="w-full mt-24 md:mt-28 lg:mt-32">
            <ImagesSlider images={slides}/>
            <div className="mt-5 lg:hidden flex flex-col gap-5 w-[12rem]">
                <header className='flex flex-col gap-1 py-2'>
                    <h1 className="text-5xl font-bold"><strong>NEVERBE</strong></h1>
                    <h2 className="md:text-2xl text-xl text-primary mt-2">The Best Online Shopping Experience</h2>
                </header>
                <Link href="/shop/products">
                    <div
                        className="bg-primary text-xl md:text-2xl w-fit p-2 font-bold flex-row flex justify-center items-center gap-1 text-white">
                        <h3>Shop Now</h3>
                        <span><BiCart size={30}/></span>
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default Hero;
