"use client";
import React from 'react';
import Link from "next/link";
import { MenuCard } from "@/assets/images";
import Image from "next/image";

interface BrandCardProps {
    brand: string;
    url: string;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, url }) => {
    return (
        <Link
            href={url}
            className="group flex items-center justify-center p-3 md:p-4 transition-all duration-300 transform lg:hover:scale-105"
        >
            <div className="relative rounded-full overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-shadow duration-500 group lg:hover:scale-110">
                <figure className="transition-all duration-500 lg:group-hover:scale-125 lg:group-hover:rotate-3">
                    <Image
                        width={200}
                        height={200}
                        src={MenuCard}
                        alt="Brand Logo"
                        className="object-cover md:w-[8rem] w-[6rem] h-[6rem] md:h-[8rem] transition-all duration-500 lg:group-hover:opacity-90"
                    />
                </figure>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <h3 className="text-xl md:text-2xl lg:text-3xl text-white font-bold tracking-wider text-center transform  transition-opacity duration-500">
                        {brand}
                    </h3>
                </div>
            </div>
        </Link>
    );
};

export default BrandCard;
