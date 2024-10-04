import React from 'react';
import {brands} from "@/constants";
import Image from "next/image";

const Brands = () => {
    return (
        <div className="w-full bg-slate-100">
            <div className="p-8 mt-16">
                <ul className="flex w-full mt-5 flex-wrap gap-10 flex-row justify-center items-center">
                    {brands.map((item, index) => (
                        <li key={index} className="flex w-[22rem] flex-col justify-center items-center">
                            <h2 className="text-5xl text-center font-bold">{item.name}</h2>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Brands;