"use client"
import React from 'react';
import Link from "next/link";

interface BrandCardProps {
    brand: string;
    url: string;
}

const BrandCard: React.FC<BrandCardProps> = ({brand, url}) => {
    return (
        <Link
            href={url}
            className="group flex items-center justify-center p-4"
        >
            <h3 className="relative text-2xl md:text-3xl lg:text-4xl text-slate-600 font-semibold hover:text-primary-100  text-center transition-all duration-300">
                {brand}
            </h3>
        </Link>
    );
};

export default BrandCard;
