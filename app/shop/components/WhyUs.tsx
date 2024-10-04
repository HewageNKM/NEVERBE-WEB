import React from 'react';
import Image from "next/image";
import {whyUs} from "@/constants";

const WhyUs = () => {
    return (
        <div className="w-full">
            <div className="px-8 py-4 mt-16">
                <div>
                    <h1 className="font-bold text-4xl">Why Us?</h1>
                </div>
                <div className="flex w-full mt-5 flex-wrap gap-10 lg:gap-0 flex-row justify-evenly items-center">
                    {whyUs.map((item, index) => (
                        <div key={index} className="flex w-[22rem] flex-col justify-center items-center">
                            <div>
                                <Image src={item.image} alt={item.title} width={100} height={100}
                                       className="w-[7rem] h-[7rem]"/>
                            </div>
                            <h2 className="font-semibold mt-2 text-2xl">{item.title}</h2>
                            <div>
                                <p className="text-center text-lg font-light text-slate-600">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WhyUs;