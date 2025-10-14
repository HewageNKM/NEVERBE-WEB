"use client";
import React from "react";
import Link from "next/link";
import { address, contactInfo, informationLinks, payHere, socialMedia } from "@/constants";
import Image from "next/image";
import { Logo } from "@/assets/images";
import { GoLocation } from "react-icons/go";

const Footer = () => {
  return (
    <footer className="w-full bg-primary text-white pt-12 pb-6 px-6 lg:px-24">
      {/* Top Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
        {/* Logo + Address */}
        <div className="flex flex-col gap-4">
          <Link href="/" aria-label="Go to home page" className="inline-block">
            <figure className="bg-black p-2 w-fit rounded-full mb-4">
              <Image src={Logo} alt="NEVERBE Logo" width={100} height={100} />
            </figure>
          </Link>
          <h2 className="text-2xl font-bold">Address</h2>
          <div className="flex items-start gap-3">
            <GoLocation size={28} className="mt-1" />
            <Link href={address.map} target="_blank" rel="noopener noreferrer">
              <p className="text-lg">{address.address}</p>
            </Link>
          </div>
        </div>

        {/* Follow Us */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Follow Us</h2>
          <ul className="flex flex-col gap-3">
            {socialMedia.map((media, idx) => (
              <li key={idx} className="flex items-center gap-2 text-lg">
                <Link
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-gray-300 transition"
                  aria-label={`Follow us on ${media.name}`}
                >
                  <media.icon size={24} />
                  <span>{media.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Information Links */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Information</h2>
          <ul className="flex flex-col gap-2">
            {informationLinks.map((link, idx) => (
              <li key={idx} className="text-lg hover:text-gray-300 transition duration-200">
                <Link href={link.url} rel="noopener noreferrer">
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Contact Us</h2>
          <ul className="flex flex-col gap-2">
            {contactInfo.map((info, idx) => (
              <li key={idx}>
                <Link
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-lg hover:text-gray-300 transition"
                >
                  <info.icon size={24} />
                  <span>{info.content}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/30 mb-6"></div>

      {/* Bottom Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-center lg:text-left">
        <p className="text-lg font-medium">© {new Date().getFullYear()} NEVERBE. All Rights Reserved.</p>
        <p className="font-medium">
          Developed By{" "}
          <Link href="https://github.com/HewageNKM" className="underline hover:text-gray-300">
            Nadun Malwenna
          </Link>
        </p>
        <Link href={payHere.payHereLink} target="_blank" rel="noopener noreferrer">
          <figure className="flex justify-center items-center">
            <Image
              src={payHere.longWhiteBanner}
              width={300}
              height={80}
              alt="PayHere Logo"
              className="object-contain"
            />
          </figure>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
