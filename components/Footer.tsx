"use client";
import React from "react";
import Link from "next/link";
import {
  address,
  contactInfo,
  informationLinks,
  payHere,
  socialMedia,
} from "@/constants";
import Image from "next/image";
import { Logo } from "@/assets/images";
import { GoLocation } from "react-icons/go";
import { NavigationItem, SocialMediaItem } from "@/services/WebsiteService";
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io";
import { IoLogoTiktok, IoLogoYoutube, IoLogoTwitter } from "react-icons/io5";
import { IconType } from "react-icons";

// Icon mapping for dynamic social links
const SOCIAL_ICON_MAP: Record<string, IconType> = {
  facebook: IoLogoFacebook,
  instagram: IoLogoInstagram,
  tiktok: IoLogoTiktok,
  youtube: IoLogoYoutube,
  twitter: IoLogoTwitter,
};

interface FooterProps {
  footerNav?: NavigationItem[];
  socialLinks?: SocialMediaItem[];
}

const Footer = ({ footerNav = [], socialLinks = [] }: FooterProps) => {
  // Use dynamic footer nav if available, otherwise fallback to constants
  const helpLinks =
    footerNav.length > 0
      ? footerNav
      : informationLinks.map((item) => ({ title: item.title, link: item.url }));

  // Use dynamic social links if available, otherwise fallback to constants
  const socialLinksToRender =
    socialLinks.length > 0
      ? socialLinks.map((item) => ({
          name: item.name,
          url: item.url,
          Icon: SOCIAL_ICON_MAP[item.name.toLowerCase()] || IoLogoFacebook,
        }))
      : socialMedia.map((item) => ({
          name: item.name,
          url: item.url,
          Icon: item.icon,
        }));

  return (
    <footer
      id="footer"
      className="w-full bg-[#111111] text-white pt-16 pb-8 border-t border-[#333]"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* --- Top Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand & Location (Styled like "Find a Store") */}
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              aria-label="Go to home page"
              className="inline-block"
            >
              {/* Invert brightness to ensure logo is white/monochrome */}
              <Image
                src={Logo}
                alt="NEVERBE"
                width={120}
                height={40}
                className="object-contain invert mix-blend-screen"
              />
            </Link>

            <div>
              <h3 className="font-display font-bold uppercase text-sm tracking-wider text-white mb-2">
                Store Location
              </h3>
              <Link
                href={address.map}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2"
              >
                <GoLocation
                  size={18}
                  className="mt-0.5 text-gray-400 group-hover:text-white transition-colors"
                />
                <p className="text-xs text-gray-400 leading-relaxed font-medium uppercase group-hover:text-white transition-colors max-w-[200px]">
                  {address.address}
                </p>
              </Link>
            </div>
          </div>

          {/* Column 2: Help (Information) */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display font-bold uppercase text-sm tracking-wider text-white">
              Get Help
            </h3>
            <ul className="flex flex-col gap-2">
              {helpLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.link}
                    className="text-xs text-gray-400 hover:text-white transition-colors font-medium capitalize"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display font-bold uppercase text-sm tracking-wider text-white">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-3">
              {contactInfo.map((info, idx) => (
                <li key={idx}>
                  <Link
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-xs text-gray-400 hover:text-white transition-colors group"
                  >
                    <info.icon
                      size={16}
                      className="text-gray-500 group-hover:text-white transition-colors"
                    />
                    <span className="font-medium">{info.content}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display font-bold uppercase text-sm tracking-wider text-white">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {socialLinksToRender.map((media, idx) => (
                <Link
                  key={idx}
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${media.name}`}
                  className="bg-gray-800 hover:bg-white text-white hover:text-black p-2 rounded-full transition-all duration-300"
                >
                  <media.Icon size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* --- Bottom Section (Legal & Credits) --- */}
        <div className="pt-8 border-t border-[#222] flex flex-col-reverse lg:flex-row justify-between items-center gap-6">
          {/* Copyright & Dev Credit */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wide">
            <p>
              © {new Date().getFullYear()} NEVERBE, Inc. All Rights Reserved.
            </p>
            <div className="hidden md:block w-px h-3 bg-gray-700"></div>
            <p>
              Developed By{" "}
              <Link
                href="https://github.com/HewageNKM"
                target="_blank"
                className="text-white hover:text-gray-300 transition-colors"
              >
                Nadun Malwenna
              </Link>
            </p>
          </div>

          {/* Payments */}
          <Link
            href={payHere.payHereLink}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <Image
              src={payHere.longWhiteBanner}
              width={250}
              height={60}
              alt="PayHere Secure Payment"
              className="object-contain h-8 w-auto"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
