import React from 'react';
import {brandsLogo} from "@/constants";
import Image from "next/image";

const Brands = () => {
    return (
        <div className="w-full bg-slate-100">
            <div className="px-8 py-8 mt-16">
                <div className="flex w-full mt-5 flex-wrap gap-10 lg:gap-0 flex-row justify-evenly items-center">
                    {brandsLogo.map((item, index) => (
                        <div key={index} className="flex w-[22rem] flex-col justify-center items-center">
                            <Image src={item.image} alt={item.name} width={40} height={40}
                                   className={`w-[8rem]  ${item.name == "Polo" ? "scale-50 h-fit":"h-[8rem]"}`}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Brands;