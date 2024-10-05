import React from 'react';
import {motion} from "framer-motion";
import {brands} from "@/constants";
import Link from "next/link";

const BrandsPopupMenu = ({setShowBrands}:{setShowBrands:any}) => {
    return (
        <motion.div initial={{opacity: 0, y: '2vh'}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: '2vh'}}
                    transition={{duration: 0.2}}
                    className="w-full z-50 hidden lg:flex top-[6rem] justify-center absolute">
            <div onMouseEnter={() => setShowBrands(true)} className="flex w-fit bg-white text-slate-500 p-4 flex-row gap-10 flex-wrap mt-8 shadow-primary rounded-lg">
                {brands.map((brand, index) => (
                    <div key={index}>
                        <h2 className="font-semibold text-3xl"> {brand.name}</h2>
                        <ul className="mt-1 flex text-primary flex-col gap-2 text-xl">
                            {brand.titles.map((title, index) => (
                                <li key={index}
                                    className="font-medium text-primary w-fit hover:border-b-primary-100 hover:border-b-2 h-7 cursor-pointer">
                                    <Link href={title.url
                                    }>{title.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default BrandsPopupMenu;