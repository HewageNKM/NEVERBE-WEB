import React from 'react';
import ImagesSlider from "@/app/components/ImagesSlider";
import Link from "next/link";
import { BiCart } from "react-icons/bi";
import { Slide } from "@/interfaces";
import { getSliders } from "@/firebase/firebaseAdmin";

const Hero = async () => {
    let sliders: Slide[] = [];
    let error = null;

    try {
        sliders = await getSliders();
    } catch (e) {
        console.error(e);
        error = "Failed to load images"; // Set error message
    }

    return (
        <section className="w-full mt-20 md:mt-28 lg:mt-28">
            <header className='flex flex-col gap-1 py-2'>
                <h1 className="text-5xl font-bold"><strong>NEVERBE</strong></h1>
                <h2 className="md:text-2xl text-xl text-primary mt-2">The Best Online Shopping Experience</h2>
            </header>

            {error ? (
                <p className="text-red-500 text-lg">Error: {error}</p> // Display error message
            ) : (
                <ImagesSlider images={sliders} />
            )}

            <div className="mt-5 lg:hidden block w-[12rem]">
                <Link href="/shop/products">
                    <div className="bg-primary text-xl md:text-2xl w-fit p-2 font-bold flex-row flex justify-center items-center gap-1 text-white">
                        <h3>Shop Now</h3>
                        <span><BiCart size={30} /></span>
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default Hero;
