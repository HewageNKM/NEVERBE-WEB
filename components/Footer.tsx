"use client";
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
  const helpLinks =
    footerNav.length > 0
      ? footerNav
      : informationLinks.map((item) => ({ title: item.title, link: item.url }));

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
    <footer id="footer" className="w-full bg-[#111] text-white pt-12 pb-6">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* --- Primary Navigation Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-4 mb-12">
          {/* Column 1: Brand & Key Utility */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <Image
                src={Logo}
                alt="NEVERBE"
                width={110}
                height={35}
                className="object-contain invert brightness-200"
              />
            </Link>

            <div className="flex flex-col gap-4">
              <h3 className="text-[14px] font-bold uppercase tracking-tight">
                Store Location
              </h3>
              <Link
                href={address.map}
                target="_blank"
                className="group flex items-start gap-3"
              >
                <GoLocation size={16} className="mt-1 text-white" />
                <p className="text-[12px] text-[#707072] font-medium uppercase leading-tight group-hover:text-white transition-colors">
                  {address.address}
                </p>
              </Link>
            </div>
          </div>

          {/* Column 2: Information Lists */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[14px] font-bold uppercase tracking-tight">
              Get Help
            </h3>
            <ul className="flex flex-col gap-3">
              {helpLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.link}
                    className="text-[12px] text-[#707072] hover:text-white transition-colors font-medium"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Utility */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[14px] font-bold uppercase tracking-tight">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-3">
              {contactInfo.map((info, idx) => (
                <li key={idx}>
                  <Link
                    href={info.link}
                    target="_blank"
                    className="flex items-center gap-3 text-[12px] text-[#707072] hover:text-white transition-colors group"
                  >
                    <info.icon
                      size={16}
                      className="text-[#707072] group-hover:text-white"
                    />
                    <span className="font-medium">{info.content}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social Monochromatic Icons */}
          <div className="flex flex-col gap-4 lg:items-end">
            <h3 className="text-[14px] font-bold uppercase tracking-tight lg:hidden">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {socialLinksToRender.map((media, idx) => (
                <Link
                  key={idx}
                  href={media.url}
                  target="_blank"
                  className="bg-[#707072] hover:bg-white text-[#111] p-2 rounded-full transition-all duration-300"
                >
                  <media.Icon size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* --- Bottom Legal & Credits Row --- */}
        <div className="pt-6 border-t border-[#222] flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
            {/* Nike Style Utility Footer Links */}
            <div className="flex items-center gap-4 text-[11px] text-[#707072] font-medium">
              <p className="text-white">
                © {new Date().getFullYear()} NEVERBE, Inc.
              </p>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Use
              </Link>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Payment Partners */}
            <Link
              href={payHere.payHereLink}
              target="_blank"
              className="opacity-50 hover:opacity-100 grayscale hover:grayscale-0 transition-all"
            >
              <Image
                src={payHere.longWhiteBanner}
                width={200}
                height={50}
                alt="Secure Payments"
                className="object-contain h-6 w-auto"
              />
            </Link>

            {/* Dev Credit - Minimalist */}
            <p className="text-[10px] text-[#707072] uppercase font-bold tracking-widest">
              Built By{" "}
              <Link
                href="https://github.com/HewageNKM"
                target="_blank"
                className="text-white hover:opacity-70 transition-opacity"
              >
                N. Malwenna
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
