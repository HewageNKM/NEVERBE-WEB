import React from 'react';
import Image from "next/image";
import { whyUs } from "@/constants";

const WhyUs = () => {
    return (
        <section className="w-full">
            <div className="px-8 py-4 mt-20">
                <header>
                    <h2 className="font-bold text-2xl md:text-4xl"><strong>Why Us?</strong></h2>
                    <h3 className="md:text-xl text-lg text-primary mt-2">We are the best in the business</h3>
                </header>
                <div className="flex w-full mt-5 flex-wrap gap-10 lg:gap-0 justify-evenly items-center">
                    {whyUs.map((item, index) => (
                        <div key={index} className="flex w-[22rem] flex-col justify-center items-center">
                            <figure className="flex flex-col items-center">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={100}

                                    height={100}
                                    className="w-[7rem] h-[7rem] object-cover"
                                    loading="lazy" // Lazy load images
                                />
                                <figcaption className="mt-2 text-center">{item.title}</figcaption>
                            </figure>
                            <p className="text-center md:text-lg text-sm font-light text-slate-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyUs;
