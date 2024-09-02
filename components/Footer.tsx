'use client'
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/lib/store";
import {getShops} from "@/lib/features/footerSlice/footerSlice";
import Link from "next/link";
import {FaMapLocation} from "react-icons/fa6";
import {MdEmail} from "react-icons/md";
import {BiMobile} from "react-icons/bi";
import {BsTelephone} from "react-icons/bs";
import {resources, socialMedia} from "@/constants";
import {FaFacebook, FaInstagram, FaTiktok, FaWhatsapp} from "react-icons/fa";


const Footer = () => {
    const dispatch = useDispatch();
    const {shops} = useSelector((state: RootState) => state.footerSlice);

    useEffect(() => {
        dispatch(getShops())
    }, [dispatch]);

    return (
        <footer className="bg-primary-100 relative flex flex-col justify-between px-8 pt-4 w-full mt-20">
            <div className="flex flex-row flex-wrap md:gap-0 gap-5 justify-between">
                <div className="flex flex-col justify-start">
                    <h1 className="text-white font-bold text-3xl">NEVERBE</h1>
                    <h2 className="text-white font-light capitalize text-lg">The best place to find the best
                        products</h2>
                    <div className="mt-2">
                        <ul>
                            {shops.map((shop, index) => (
                                <li key={index} className="text-white font-medium text-lg justify-start flex-col flex gap-1">
                                    <div className="flex-row flex items-center gap-1">
                                        <FaMapLocation/>
                                        <p className="text-center flex flex-row capitalize">
                                            {shop.address}
                                        </p>
                                    </div>
                                    <div className="flex flex-row gap-1 items-center">
                                        <MdEmail/>
                                        <p className="text-center flex flex-row">
                                            {shop.contats.email}
                                        </p>
                                    </div>
                                    <div className="flex flex-row gap-1 items-center">
                                        <BiMobile/>
                                        <p className="text-center flex flex-row">
                                            {shop.contats.mobile}
                                        </p>
                                    </div>
                                    <div className="flex flex-row gap-1 items-center">
                                        <BsTelephone/>
                                        <p className="text-center flex flex-row">
                                            {shop.contats.mobile}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col justify-start">
                    <h1 className="text-white font-bold text-3xl">Resources</h1>
                    <ul className="mt-1">
                        {resources.map((resource, index) => (
                            <li key={index} className="text-white justify-start flex-col flex gap-1">
                                <Link href={resource.url} className="text-white hover:text-gray-200 font-medium text-lg">{resource.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-white font-bold text-3xl">Follow Us</h1>
                    <ul className="mt-2 flex flex-col gap-2">
                        {socialMedia.map((media, index) => (
                            <li key={index} className="flex items-center gap-1 text-white text-lg">
                                {media.icon == "FaWhatsapp" ? <FaWhatsapp color="white" size={30}/> : media.icon == "FaInstagram" ? <FaInstagram color="white" size={30}/> : media.icon == 'FaFacebook' ? <FaFacebook color="white" size={30}/>: <FaTiktok color="white" size={30}/>}
                                <Link href={media.url} className="hover:text-gray-200 font-medium h-7">{media.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="text-white flex-row text-lg p-2 flex w-full justify-center">
                <p className="text-center font-medium">
                    © {new Date().getFullYear().toString()} NEVERBE All Right Reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;