import React from 'react';
import ImagesSlider from "@/app/components/ImagesSlider";
import Link from "next/link";
import {BiCart} from "react-icons/bi";
import {Slide} from "@/interfaces";
import {genderList} from "@/constants";
import GenderCard from "@/app/components/GenderCard";

const Hero = async ({slides}: { slides: Slide[] }) => {
    return (
        <section className="w-full mt-16 lg:mt-[7rem] flex flex-col gap-5">
            <ImagesSlider images={slides}/>
            <div className="md:mt5 mt-3 px-3 lg:px-8">
                <p className="text-lg lg:text-xl text-gray-600 text-center mt-5">
                    The best place to shop for your favorite products
                </p>
                <ul className="flex mt-5 flex-wrap md:gap-24 gap-10 lg:mt-10 flex-row justify-center lg:gap-32">
                    {
                        genderList.map((gen, index) => (
                            <li key={index}>
                                <GenderCard url={gen.url} gender={gen.gender} image={gen.image}/>
                            </li>
                        ))
                    }
                </ul>
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
