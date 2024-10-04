import React from "react";
import Link from "next/link";
import {address, contactInfo, informationLinks, socialMedia} from "@/constants";
import Image from "next/image";
import {Logo} from "@/assets/images";
import {GoLocation} from "react-icons/go";

const Footer = () => {
    return (
        <footer className="w-full bg-primary text-white py-8">
            <div className="container px-8 mx-auto flex flex-col md:flex-row justify-between gap-10">
                <div className="flex flex-row gap-4 md:justify-center justify-start items-center">
                    <div className="">
                        <Image src={Logo} alt={"NEVERBELogo"} width={100} height={100}/>
                    </div>
                    <ul className="flex flex-col gap-4">
                        <h2 className="text-3xl font-bold">Address</h2>
                        <div className="flex flex-row gap-2">
                            <GoLocation size={30}/>
                            <div className="flex flex-col gap-2">
                                {address.map((link, index) => (
                                    <li key={index} className="text-lg">
                                        <p>{link.name}</p>
                                    </li>
                                ))}
                            </div>
                        </div>
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-bold">Follow Us</h2>
                    <ul className="flex flex-col gap-2">
                        {socialMedia.map((media, index) => (
                            <li key={index} className="flex items-center gap-2 text-lg">
                                <Link href={media.url} target="_blank">
                                    <media.icon size={30}/>
                                </Link>
                                <span>{media.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
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
                                className="text-lg flex flex-row gap-1">
                                <info.icon size={30}/>
                                <p>{info.content}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
