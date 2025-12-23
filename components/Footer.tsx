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
    <footer id="footer" className="w-full bg-dark text-inverse pt-16 pb-8">
      <div className="max-w-content mx-auto px-6 lg:px-12">
        {/* --- Primary Navigation Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand & Key Utility */}
          <div className="flex flex-col gap-8">
            <Link
              href="/"
              className="inline-block transition-transform hover:scale-105"
            >
              <Image
                src={Logo}
                alt="NEVERBE"
                width={120}
                height={40}
                className="object-contain invert brightness-200"
              />
            </Link>

            <div className="flex flex-col gap-4">
              <h3 className="text-base font-display font-black uppercase tracking-widest text-inverse">
                Store Location
              </h3>
              <Link
                href={address.map}
                target="_blank"
                className="group flex items-start gap-3"
              >
                <GoLocation size={18} className="mt-0.5 text-accent" />
                <p className="text-xs text-muted font-bold uppercase leading-snug group-hover:text-accent transition-colors">
                  {address.address}
                </p>
              </Link>
            </div>
          </div>

          {/* Column 2: Information Lists */}
          <div className="flex flex-col gap-6">
            <h3 className="text-base font-display font-black uppercase tracking-widest text-inverse">
              Get Help
            </h3>
            <ul className="flex flex-col gap-4">
              {helpLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.link}
                    className="text-xs text-muted hover:text-accent transition-all font-bold uppercase tracking-wider"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Utility */}
          <div className="flex flex-col gap-6">
            <h3 className="text-base font-display font-black uppercase tracking-widest text-inverse">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-4">
              {contactInfo.map((info, idx) => (
                <li key={idx}>
                  <Link
                    href={info.link}
                    target="_blank"
                    className="flex items-center gap-3 text-xs text-muted hover:text-accent transition-all group"
                  >
                    <info.icon
                      size={18}
                      className="text-muted group-hover:text-accent"
                    />
                    <span className="font-bold uppercase tracking-wider">
                      {info.content}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social Icons */}
          <div className="flex flex-col gap-6 lg:items-end">
            <h3 className="text-base font-display font-black uppercase tracking-widest text-inverse lg:hidden">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {socialLinksToRender.map((media, idx) => (
                <Link
                  key={idx}
                  href={media.url}
                  target="_blank"
                  className="bg-zinc-800 hover:bg-accent text-inverse hover:text-dark p-3 rounded-full transition-all duration-300 shadow-custom hover:shadow-hover"
                >
                  <media.Icon size={20} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* --- Bottom Legal & Credits Row --- */}
        <div className="pt-8 border-t border-dark/30 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex items-center gap-6 text-[10px] text-muted font-bold uppercase tracking-[0.15em]">
              <p className="text-inverse italic">
                © {new Date().getFullYear()} NEVERBE, INC.
              </p>
              <Link
                href="/terms"
                className="hover:text-accent transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-accent transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Payment Partners with subtle hover glow */}
            <Link
              href={payHere.payHereLink}
              target="_blank"
              className="opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500"
            >
              <Image
                src={payHere.longWhiteBanner}
                width={180}
                height={40}
                alt="Secure Payments"
                className="object-contain h-5 w-auto"
              />
            </Link>

            {/* Developer Credit */}
            <p className="text-[9px] text-muted uppercase font-black tracking-[0.2em]">
              Engineered By{" "}
              <Link
                href="https://github.com/HewageNKM"
                target="_blank"
                className="text-inverse hover:text-accent transition-all"
              >
                N. MALWENNA
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
