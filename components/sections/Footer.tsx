import React from 'react';
import Link from "next/link";
import {BsFacebook, BsTiktok, BsWhatsapp} from "react-icons/bs";

const Footer = () => {
    return (
        <footer className="border-t-[1.5px] w-full pb-16 relative border-gray-800 mt-20">
            <div className="flex flex-wrap gap-5 flex-row mt-5 justify-between">
                <div className="flex flex-col">
                    <h2 className="font-bold text-lg tracking-wide">Contact Us</h2>
                    <div className="mt-2 flex flex-col gap-1">
                        <p className="text-sm font-medium">
                            Monday - Sunday(24 Hour)
                        </p>
                        <p className="text-sm font-medium">
                            +94XXXXXXXX
                        </p>
                        <p className="text-sm font-medium">
                            neverbe.info@gmail.com
                        </p>
                    </div>
                </div>
                <div>
                    <h2 className="font-bold text-2xl">Brands</h2>
                    <div className="flex mt-2 gap-1 flex-col">
                        <Link href="" className="text-sm font-medium hover:opacity-40">Nike</Link>
                        <Link href="" className="text-sm font-medium hover:opacity-40">Adidas </Link>
                        <Link href="" className="text-sm font-medium hover:opacity-40">Puma</Link>
                        <Link href="" className="text-sm font-medium hover:opacity-40">Cross</Link>
                        <Link href="" className="text-sm font-medium hover:opacity-40">Polo </Link>
                        <Link href="" className="text-sm font-medium hover:opacity-40">New Balance</Link>
                        <Link href="" className="text-sm font-medium hover:opacity-40">Louis Vuitton</Link>
                    </div>
                </div>
                <div>
                    <h2 className="font-bold text-2xl">Resources</h2>
                    <div className="flex mt-2 gap-1 flex-col">
                        <Link href="" className="text-sm font-medium hover:opacity-40">My Account</Link>
                        <Link href="" className="text-sm font-medium hover:opacity-40">Order Status </Link>
                        <Link href="" className="text-sm font-medium hover:opacity-40">News Letters</Link>
                    </div>
                </div>
                <div className="flex items-center flex-col">
                    <h2 className="font-bold text-2xl tracking-wide">Follow Us</h2>
                    <div className="flex-row mt-2 flex gap-3 items-center justify-center">
                        <Link href="">
                            <BsFacebook className="w-8 h-8 transition-all duration-500 hover:scale-110"/>
                        </Link>
                        <Link href="">
                            <BsTiktok className="w-8 h-8 transition-all duration-500 hover:scale-110"/>
                        </Link>
                        <Link href="">
                            <BsWhatsapp className="w-8 h-8 transition-all duration-500 hover:scale-110"/>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="font-light flex-row h-[2.7rem] p-2 flex gap-3 absolute bottom-0  text-lg">
                <p>
                    © {new Date().getFullYear().toString()} Never Be All Right Reserved.
                </p>
                <Link href="" className="hover:border-b border-black">Terms & Conditions</Link>
            </div>
        </footer>
    );
};

export default Footer;