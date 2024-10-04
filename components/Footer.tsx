import React from "react";
import Link from "next/link";
import { address, socialMedia, informationLinks, contactInfo } from "@/constants";

const Footer = () => {
    return (
        <footer className="w-full bg-primary text-white py-8">
            <div className="container mx-auto flex flex-col md:flex-row justify-between gap-10">
                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-bold">NEVERBE</h2>
                    <ul className="flex flex-col gap-2">
                        {address.map((link, index) => (
                            <li key={index} className="text-lg hover:text-gray-300 transition duration-200">
                                <p>{link.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-bold">Follow Us</h2>
                    <ul className="flex flex-col gap-2">
                        {socialMedia.map((media, index) => (
                            <li key={index} className="flex items-center gap-2 text-lg">
                                <Link href={media.url} target="_blank">
                                    <media.icon size={30} />
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
                            <li key={index} className="text-lg hover:text-gray-300 transition duration-200 flex flex-row gap-1">
                                <info.icon size={30} />
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
