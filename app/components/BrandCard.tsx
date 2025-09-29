"use client";
import React from 'react';
import Link from "next/link";
import Image from "next/image";

interface BrandCardProps {
    brand: string;
    url: string;
    image: string;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, url, image }) => {
    return (
        <Link
            href={url}
            className="group flex items-center justify-center p-3 md:p-4 transition-all duration-300 transform lg:hover:scale-105"
        >
            <div className="relative items-center justify-center rounded-md overflow-hidden p-2 bg-white shadow-lg hover:shadow-2xl transition-transform duration-500 group lg:hover:scale-110">
                <Image
                    width={200}
                    height={200}
                    src={image}
                    alt={`${brand} Logo`}
                    className="object-contain md:w-[10rem] w-[6rem] md:h-[4.5rem] h-[2rem]  ransition-all duration-500 lg:group-hover:opacity-90"
                />
            </div>
        </Link>
    );
};

export default BrandCard;
