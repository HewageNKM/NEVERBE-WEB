import React from 'react';
import ImagesSlider from "@/app/shop/components/ImagesSlider";
import Link from "next/link";
import {BiCart} from "react-icons/bi";
import {Slide} from "@/interfaces";
import {getSliders} from "@/firebase/firebaseAdmin";

const Hero = async () => {

    let sliders: Slide[] = []

    try {
        sliders = await getSliders();
    } catch (e) {
        console.log(e);
    }

    return (
        <section className="w-full mt-20 md:mt-28 lg:mt-28">
            <div className='flex flex-col gap-1 py-2'>
                <h1 className="text-5xl font-bold"><strong>NEVERBE</strong></h1>
                <h2 className="md:text-2xl text-xl text-primary mt-2">The Best Online Shopping Experience</h2>
            </div>
            <ImagesSlider images={sliders}/>
            <div className="mt-5 lg:hidden block w-[12rem]">
                <Link href={"/shop/products"}>
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