import React, {useState} from 'react';
import DropShadow from "@/components/DropShadow";
import Link from "next/link";
import {motion} from "framer-motion";
import {IoClose} from "react-icons/io5";
import {Logo} from "@/assets/images";
import Image from "next/image";
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/md";
import {brands} from "@/constants";
const Menu = ({setShowMenu}:{setShowMenu:any}) => {
    const [showBrands, setShowBrands] = useState(false)
    return (
        <DropShadow containerStyle="flex justify-center items-center">
            <motion.div
                initial={{opacity: 0, x: '100vw'}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: '100vw'}}
                transition={{duration: 0.2}}
                className={`px-8 py-4 bg-white rounded relative transition-all duration-200 flex flex-col justify-center items-center ${showBrands ? "h-[80vh] md:w-[50vw] w-[75vw]":"md:w-[50vw] w-[75vw] h-[50vh]"}`}>
                <figure>
                    <Link href={"/"}>
                        <Image src={Logo} alt="NEVERBE_Logo" className="w-32 h-32"/>
                    </Link>
                </figure>
                <ul className="flex flex-col mt-5 text-primary text-2xl md:text-3xl font-semibold justify-evenly items-start  gap-5 ">
                    <li>
                        <Link href={"/shop/products"}>Shop Now</Link>
                    </li>
                    <li>
                        <button onClick={()=>setShowBrands(prevState => !prevState)} className="flex flex-row justify-center items-center">
                            <p>Brand</p>
                            {showBrands ? (<MdKeyboardArrowUp size={30}/>):( <MdKeyboardArrowDown  size={30}/>)}
                        </button>

                        <ul className="overflow-auto w-fit mt-2 flex flex-col gap-2 text-slate-500 max-h-[50vh]">
                            {showBrands && (brands.map((brand, index) => (
                                <li key={index}>
                                    <Link href={brand.url} className="font-semibold text-lx"> {brand.name}</Link>
                                </li>
                            )))}
                        </ul>
                    </li>
                    <li>
                        <button>Accessories</button>
                    </li>
                </ul>
                <button onClick={()=>setShowMenu(false)} className="top-1 right-1 absolute">
                    <IoClose size={30}/>
                </button>
            </motion.div>
        </DropShadow>
    );
};

export default Menu;