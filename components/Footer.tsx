import React from "react";
import Link from "next/link";
import { address, contactInfo, informationLinks, payHere, socialMedia } from "@/constants";
import Image from "next/image";
import { Logo } from "@/assets/images";
import { GoLocation } from "react-icons/go";

const Footer = () => {
    return (
        <footer className="w-full bg-primary text-white py-4 lg:px-24 px-16">
            <div className="flex md:justify-center lg:justify-between md:flex-wrap flex-col md:flex-row p-8 gap-10">
                <div className="flex flex-col md:flex-row gap-4 md:justify-center justify-start md:items-center">
                    <Link href="/" aria-label="Go to home page">
                        <figure className="bg-black p-2 w-fit rounded-full">
                            <Image src={Logo} alt="NEVERBE Logo" width={100} height={100} />
                        </figure>
                    </Link>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-3xl font-bold">Address</h2>
                        <div className="flex flex-row gap-2">
                            <GoLocation size={30} aria-hidden="true" />
                            <ul className="flex flex-col gap-2">
                                <Link href={address.map} target="_blank" rel="noopener noreferrer">
                                    <li className="text-lg w-[10rem]">
                                        <p>{address.address}</p>
                                    </li>
                                </Link>
                            </ul>
                        </div>
                    </div>
                </div>

                <nav className="flex flex-col gap-4">
                    <h2 className="text-3xl font-bold">Follow Us</h2>
                    <ul className="flex flex-col gap-2">
                        {socialMedia.map((media, index) => (
                            <li key={index} className="flex items-center gap-2 text-lg">
                                <Link href={media.url} target="_blank" rel="noopener noreferrer" className="flex flex-row gap-2" aria-label={`Follow us on ${media.name}`}>
                                    <media.icon size={30} aria-hidden="true" />
                                    <span>{media.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <nav id="footer" className="flex flex-col gap-4">
                    <h2 className="text-3xl font-bold">Information</h2>
                    <ul className="flex flex-col gap-2">
                        {informationLinks.map((link, index) => (
                            <li key={index} className="text-lg hover:text-gray-300 transition duration-200">
                                <Link href={link.url} rel="noopener noreferrer">{link.title}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold">Contact Us</h2>
                    <ul className="flex flex-col gap-2">
                        {contactInfo.map((info, index) => (
                            <li key={index}>
                                <Link className="text-lg flex flex-row gap-2" href={info.link} target="_blank" rel="noopener noreferrer">
                                    <info.icon size={30} aria-hidden="true" />
                                    <p>{info.content}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="mt-10 w-full flex-row lg:justify-evenly justify-center flex-wrap flex gap-5 px-8 items-center">
                <p className="text-lg font-medium text-center">© {new Date().getFullYear().toString()} NEVERBE. All Rights Reserved.</p>
                <p className="font-medium text-base">Developed By <Link href={"https://github.com/EthanBlake00"}>Ethan Blake</Link></p>
                <Link href={payHere.payHereLink} target="_blank" rel="noopener noreferrer">
                    <figure className="flex justify-center items-center">
                        <Image src={payHere.longWhiteBanner} width={400} height={200} alt="PayHere Logo" />
                    </figure>
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
