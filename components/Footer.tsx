import React from 'react';
import Link from "next/link";
import {IoLogoFacebook, IoLogoInstagram} from "react-icons/io";
import {IoLogoTiktok} from "react-icons/io5";

const Footer = () => {
    return (
        <footer className="w-full bg-primary flex text-white">
            <div className="px-4 py-2 flex flex-row justify-between w-full gap-10 items-center flex-wrap">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">NEVERBE</h2>
                    <ul className="flex flex-col gap-1 mt-1">
                        <li className="text-lg"><Link href="">About Us</Link></li>
                        <li className="text-lg"><Link href="">Terms & Conditions</Link></li>
                        <li className="text-lg"><Link href="">Privacy Policy</Link></li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Follow Us</h2>
                    <ul className="flex flex-col gap-1 mt-1">
                        <li className="text-lg flex flex-row justify-start gap-1 items-center">
                            <Link href="">
                            <IoLogoFacebook size={30}/>
                            </Link>
                            <p>
                                Facebook
                            </p>
                        </li>
                        <li className="text-lg flex flex-row justify-start gap-1 items-center">
                            <Link href="">
                            <IoLogoInstagram size={30}/>
                            </Link>
                            <p>
                                Instagram
                            </p>
                        </li>
                        <li className="text-lg flex flex-row justify-start gap-1 items-center">
                            <Link href="">
                            <IoLogoTiktok size={30}/>
                            </Link>
                            <p>
                                Tiktok
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Information</h2>
                    <ul className="flex flex-col gap-1 mt-1">
                        <li className="text-lg"><Link href="">FAQ</Link></li>
                        <li className="text-lg"><Link href="">Shipping & Returns</Link></li>
                        <li className="text-lg"><Link href="">Tracking</Link></li>
                    </ul>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">Contact Us</h2>
                    <ul>
                        <li className="text-xl font-bold">NEVERBE</li>
                        <li className="text-lg">
                            330/4/10, New Kandy Road,
                        </li>
                        <li className="text-lg"> Delgoda, Gampaha,</li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;