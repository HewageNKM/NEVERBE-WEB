import React from 'react';
import Image from "next/image";
import {AdidasBG, DefaultBG, LuvionVuittonBG, NewBalance, NikeBG} from "@/assets/images";

const ManufacturerHeader = ({count, name}: { count: number, name: string }) => {
const image = ()=>{
    switch (name) {
        case "nike":
            return NikeBG;
        case "adidas":
            return AdidasBG
        case 'new balance':
            return NewBalance;
        case 'luvion vuitton':
            return LuvionVuittonBG;
        default:
            return DefaultBG;
    }
}
    return (
        <section className="flex relative flex-col gap-4 md:text-lg text-sm justify-between w-full">
            <div className="relative group overflow-hidden">
                <figure className="transition-transform duration-300 ease-in-out group-hover:scale-105">
                    <Image
                        src={image()}
                        alt="Shoes Background"
                        width={100}
                        height={100}
                        className="w-full object-cover h-[10rem] md:h-[20rem]"
                    />
                </figure>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <h1 className="text-white text-lg md:text-3xl font-bold">
                        All Products <span className="capitalize">
                        by {name}
                    </span> ({count || 0})
                    </h1>
                </div>
            </div>
        </section>
    );
};

export default ManufacturerHeader;