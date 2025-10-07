import React from 'react';
import ImagesSlider from "@/app/components/ImagesSlider";
import Link from "next/link";
import {BiCart} from "react-icons/bi";
import {Slide} from "@/interfaces";
import {collectionList} from "@/constants";
import CollectionCard from "@/app/components/CollectionCard";

const Hero = async ({slides}: { slides: Slide[] }) => {
    return (
        <section className="w-full mt-16 lg:mt-[7rem] flex flex-col gap-5">
            <ImagesSlider images={slides}/>
            <div className="md:mt5 mt-3 px-3 lg:px-8">
                <div className={"flex flex-col gap-5 mt-5"}>
                    <h3 className="text-gray-800 md:text-4xl font-bold text-2xl text-left mt-5">
                        Explore our collection
                    </h3>
                    <ul className="flex mt-5 flex-wrap md:gap-24 gap-10 lg:mt-10 flex-row justify-evenly lg:gap-36">
                        {
                            collectionList.map((gen, index) => (
                                <li key={index}>
                                    <CollectionCard url={gen.url} gender={gen.gender} image={gen.image}/>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="flex justify-center mt-5 lg:mt-10">
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
