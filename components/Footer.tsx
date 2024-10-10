import React from "react";
import Link from "next/link";
import {address, contactInfo, informationLinks, payHere, socialMedia} from "@/constants";
import Image from "next/image";
import {Logo} from "@/assets/images";
import {GoLocation} from "react-icons/go";

const Footer = () => {
    return (
        <footer className="w-full bg-primary text-white py-4">
            <div className="flex md:justify-center lg:justify-between md:flex-wrap flex-col md:flex-row p-8 gap-10">
                <div className="flex flex-col md:flex-row gap-4 md:justify-center justify-start md:items-center">
                    <Link href="/">
                        <figure>
                            <Image src={Logo} alt={"NEVERBELogo"} width={100} height={100}/>
                        </figure>
                    </Link>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-3xl font-bold">Address</h2>
                        <div className="flex flex-row gap-2">
                            <GoLocation size={30}/>
                            <ul className="flex flex-col gap-2">
                                <Link target="_blank" href={address.map}>
                                    <li className="text-lg w-[10rem]">
                                        <p>{address.address}</p>
                                    </li>
                                </Link>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-bold">Follow Us</h2>
                    <ul className="flex flex-col gap-2">
                        {socialMedia.map((media, index) => (
                            <li key={index} className="flex items-center gap-2 text-lg">
                                <Link href={media.url} target="_blank" className="flex flex-row gap-2">
                                    <media.icon size={30}/>
                                    <span>{media.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div id="footer" className="flex flex-col gap-4">
                    <h2 className="text-3xl font-bold">Information</h2>
                    <ul className="flex flex-col gap-2">
                        {informationLinks.map((link, index) => (
                            <li key={index} className="text-lg hover:text-gray-300 transition duration-200">
                                <Link href={link.url}>{link.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold">Contact Us</h2>
                    <ul className="flex flex-col gap-2">
                        {contactInfo.map((info, index) => (
                            <li key={index}
                                className="text-lg flex flex-row gap-2">
                                <info.icon size={30}/>
                                <p>{info.content}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div
                className="mt-10 w-full flex-row lg:justify-evenly justify-center flex-wrap flex gap-5 px-8 items-center">
                <p className="text-lg font-medium text-center">© {new Date().getFullYear().toString()} NEVERBE.
                    All Rights Reserved.</p>
                <p className="font-medium text-base">Develop By <Link href={"https://hewagenkm.github.io/"}>Nadun
                    Malwenna</Link></p>
                <figure className="flex justify-center items-center">

                    <Image src={payHere.longWhiteBanner} width={400}
                           height={200} alt="PayhereLogo"/>
                </figure>
            </div>
        </footer>
    );
};

export default Footer;
