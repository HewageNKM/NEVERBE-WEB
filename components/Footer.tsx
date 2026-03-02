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
import { Row, Col, Typography, Flex, Divider } from "antd";

const { Title, Text } = Typography;

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
    <footer
      id="footer"
      className="w-full"
      style={{
        background:
          "linear-gradient(180deg, rgba(248,250,245,0.5) 0%, rgba(255,255,255,1) 40%)",
        borderTop: "1px solid rgba(151, 225, 62, 0.08)",
        paddingTop: 64,
        paddingBottom: 32,
      }}
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        {/* --- Primary Navigation Grid --- */}
        <Row gutter={[32, 48]} className="mb-16">
          {/* Column 1: Brand & Key Utility */}
          <Col xs={24} md={12} lg={6}>
            <Flex vertical gap={24}>
              <Link
                href="/"
                className="inline-block transition-transform hover:scale-105"
              >
                <Image
                  src={Logo}
                  alt="NEVERBE"
                  width={150}
                  height={50}
                  className="object-contain"
                />
              </Link>

              <Flex vertical gap={12}>
                <Title
                  level={5}
                  style={{
                    fontSize: 12,
                    fontWeight: 900,
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                  }}
                >
                  Store Location
                </Title>
                <Link
                  href={address.map}
                  target="_blank"
                  className="group flex items-start gap-3"
                >
                  <GoLocation
                    size={18}
                    className="mt-0.5 text-gray-400 group-hover:text-[#97e13e] transition-colors"
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(0,0,0,0.45)",
                      textTransform: "uppercase",
                      lineHeight: 1.6,
                      transition: "color 0.3s ease",
                    }}
                    className="group-hover:!text-[#97e13e]"
                  >
                    {address.address}
                  </Text>
                </Link>
              </Flex>
            </Flex>
          </Col>

          {/* Column 2: Information Lists */}
          <Col xs={24} md={12} lg={6}>
            <Flex vertical gap={24}>
              <Title
                level={5}
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                }}
              >
                Get Help
              </Title>
              <Flex vertical gap={14}>
                {helpLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.link}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(0,0,0,0.45)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      transition: "color 0.3s ease",
                    }}
                    className="hover:!text-[#97e13e]"
                  >
                    {link.title}
                  </Link>
                ))}
              </Flex>
            </Flex>
          </Col>

          {/* Column 3: Contact Utility */}
          <Col xs={24} md={12} lg={6}>
            <Flex vertical gap={24}>
              <Title
                level={5}
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                }}
              >
                Contact Us
              </Title>
              <Flex vertical gap={14}>
                {contactInfo.map((info, idx) => (
                  <Link
                    key={idx}
                    href={info.link}
                    target="_blank"
                    className="flex items-center gap-3 group"
                  >
                    <info.icon
                      size={16}
                      style={{
                        color: "rgba(0,0,0,0.3)",
                        transition: "color 0.3s ease",
                      }}
                      className="group-hover:!text-[#97e13e]"
                    />
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "rgba(0,0,0,0.45)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        transition: "color 0.3s ease",
                      }}
                      className="group-hover:!text-[#97e13e]"
                    >
                      {info.content}
                    </Text>
                  </Link>
                ))}
              </Flex>
            </Flex>
          </Col>

          {/* Column 4: Social Icons */}
          <Col xs={24} md={12} lg={6}>
            <Flex vertical gap={24} className="lg:items-end">
              <Title
                level={5}
                className="lg:hidden"
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                }}
              >
                Follow Us
              </Title>
              <Flex gap={12}>
                {socialLinksToRender.map((media, idx) => (
                  <Link
                    key={idx}
                    href={media.url}
                    target="_blank"
                    style={{
                      padding: 12,
                      borderRadius: 16,
                      background: "rgba(151, 225, 62, 0.06)",
                      border: "1px solid rgba(151, 225, 62, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      color: "rgba(0,0,0,0.5)",
                    }}
                    className="hover:!bg-[#97e13e] hover:!text-black hover:!border-[#97e13e] hover:!shadow-[0_8px_24px_rgba(151,225,62,0.3)]"
                  >
                    <media.Icon size={20} />
                  </Link>
                ))}
              </Flex>
            </Flex>
          </Col>
        </Row>

        {/* --- Bottom Legal & Credits Row --- */}
        <Divider
          style={{ borderColor: "rgba(151, 225, 62, 0.08)", margin: "32px 0" }}
        />
        <Flex
          vertical
          justify="space-between"
          align="center"
          gap={32}
          className="lg:flex-row"
        >
          <Flex vertical align="center" gap={24} className="md:flex-row">
            <Text
              style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(0,0,0,0.6)",
              }}
            >
              © {new Date().getFullYear()} NEVERBE, INC.
            </Text>
            <Flex gap={24}>
              <Link
                href="/terms"
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "rgba(0,0,0,0.35)",
                  transition: "color 0.3s ease",
                }}
                className="hover:!text-[#97e13e]"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "rgba(0,0,0,0.35)",
                  transition: "color 0.3s ease",
                }}
                className="hover:!text-[#97e13e]"
              >
                Privacy
              </Link>
            </Flex>
          </Flex>

          <Flex vertical align="center" gap={32} className="md:flex-row">
            {/* Payment Partners */}
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
                className="object-contain h-5 w-auto invert"
              />
            </Link>

            {/* Developer Credit */}
            <Text
              style={{
                fontSize: 9,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "rgba(0,0,0,0.3)",
              }}
            >
              Engineered By{" "}
              <Link
                href="https://github.com/HewageNKM"
                target="_blank"
                className="hover:!text-[#97e13e] transition-colors"
                style={{ color: "rgba(0,0,0,0.6)" }}
              >
                N. MALWENNA
              </Link>
            </Text>
          </Flex>
        </Flex>
      </div>
    </footer>
  );
};

export default Footer;
