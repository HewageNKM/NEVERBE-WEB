import React from 'react';
import {brands} from "@/constants";

const Brands = () => {
    return (
        <section className="w-full bg-slate-100">
            <div className="p-8 mt-10">
                <ul className="flex w-full mt-5 flex-wrap gap-10 flex-row justify-center items-center">
                    {brands.map((item, index) => (
                        <li key={index} className="flex w-[22rem] flex-col justify-center items-center">
                            <h2 className="lg:text-5xl md:text-4xl text-3xl text-center"><strong>{item.name}</strong></h2>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Brands;