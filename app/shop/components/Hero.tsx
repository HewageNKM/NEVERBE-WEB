import React from 'react';
import ImagesSlider from "@/app/shop/components/ImagesSlider";
import Link from "next/link";
import {BiCart} from "react-icons/bi";
import {offlineSlides} from "@/constants";
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
            <ImagesSlider images={sliders || offlineSlides}/>
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