'use client'
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/lib/store";
import {getShops} from "@/lib/features/footerSlice/footerSlice";
import {FaFacebook, FaInstagram, FaWhatsapp} from "react-icons/fa";
import Link from "next/link";
import {FaMapLocation} from "react-icons/fa6";
import {MdEmail} from "react-icons/md";
import {BiMobile} from "react-icons/bi";
import {BsTelephone} from "react-icons/bs";


const Footer = () => {
    const dispatch = useDispatch();
    const {shops} = useSelector((state: RootState) => state.footerSlice);

    useEffect(() => {
        dispatch(getShops())
    }, [dispatch]);
    return (
        <footer className="bg-primary-100 relative flex justify-between px-8 py-4 pb-16 w-full bottom-0 mt-20">
            <div className="flex flex-col justify-start">
                <h1 className="text-white font-bold text-3xl">NEVERBE</h1>
                <h2 className="text-white font-light capitalize text-lg">The best place to find the best products</h2>
                <div className="mt-2">
                    <ul>
                        {shops.map((shop, index) => (
                            <li key={index} className="text-white justify-start flex-col flex gap-1">
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
            <div className="flex flex-col mt-10 justify-between items-center">
                <div>
                    <FaWhatsapp color="white" size={30}/>
                    <Link href="">{}</Link>
                </div>
                <div>
                    <FaInstagram color="white" size={30}/>
                    <Link href="">{}</Link><p></p>
                </div>
                <div>
                    <FaFacebook color="white" size={30}/>
                    <Link href="">{}</Link>f
                </div>
            </div>
            <div className="text-white flex-row absolute bottom-0 p-2 flex gap-3">
                <p>
                    © {new Date().getFullYear().toString()} NEVERBE All Right Reserved.
                </p>
                <Link href="" className="hover:border-b border-white">Terms & Conditions</Link>
            </div>
        </footer>
    );
}

export default Footer;