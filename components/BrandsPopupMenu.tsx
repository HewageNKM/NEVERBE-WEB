'use client';
import React from 'react';
import {motion} from "framer-motion";
import Link from "next/link";
import {Brand} from "@/interfaces";

const BrandsPopupMenu = ({ setShowBrands, brands }: {
    setShowBrands: React.Dispatch<React.SetStateAction<boolean>>,
    brands: Brand[]
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: '2vh' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '2vh' }}
            transition={{ duration: 0.2 }}
            className="w-full mx-2 z-50 hidden lg:flex top-[7rem] justify-center absolute"
        >
            <nav
                onMouseEnter={() => setShowBrands(true)}
                className="flex w-fit bg-white text-slate-600 p-6 flex-row gap-8 flex-wrap shadow-lg rounded-xl border border-gray-200"
                aria-label="Brand Navigation"
            >
                {brands?.map((brand, index) => (
                    <div key={index} className="min-w-[10rem]">
                        <Link href={brand.url} aria-label={`View products from ${brand.name}`}>
                            <h2 className="font-bold text-xl text-gray-800 hover:text-primary-100 transition-colors">
                                {brand.name}
                            </h2>
                        </Link>
                        {brand.types.map((type, typeIndex) => (
                            <div key={typeIndex} className="mt-3">
                                <h3 className="text-lg font-semibold">{type.name}</h3>
                                <ul className="mt-2 flex flex-col gap-2 text-base">
                                    {type.titles.map((title, titleIndex) => (
                                        <li key={titleIndex}>
                                            <Link
                                                href={title.url}
                                                aria-label={`View ${title.name} products from ${brand.name}`}
                                                 className="text-gray-600 hover:text-primary-100 hover:underline transition-all"
                                            >
                                                {title.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}
            </nav>
        </motion.div>
    );
};


export default BrandsPopupMenu;
