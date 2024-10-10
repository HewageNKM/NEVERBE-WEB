import React from 'react';
import Image from "next/image";
import {whyUs} from "@/constants";

const WhyUs = () => {
    return (
        <section className="w-full">
            <div className="px-8 py-4 mt-20">
                <div>
                    <h2 className="font-bold text-4xl"><strong>Why Us?</strong></h2>
                    <h3 className="md:text-2xl text-xl text-primary mt-2">We are the best in the business</h3>
                </div>
                <div className="flex w-full mt-5 flex-wrap gap-10 lg:gap-0 flex-row justify-evenly items-center">
                    {whyUs.map((item, index) => (
                        <div key={index} className="flex w-[22rem] flex-col justify-center items-center">
                            <figure>
                                <Image src={item.image} alt={item.title} width={100} height={100}
                                       className="w-[7rem] h-[7rem]"/>
                            </figure>
                            <h3 className="font-semibold mt-2 text-2xl">{item.title}</h3>
                            <div>
                                <p className="text-center text-lg font-light text-slate-600">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyUs;