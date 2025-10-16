import { Metadata } from "next";
import PrivacyPolicyClient from "./components/PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy - NEVERBE",
  description:
    "Read NEVERBE's Privacy Policy outlining how we collect, use, and protect your data.",
  twitter: {
    card: "summary_large_image",
    site: "@neverbe",
    creator: "@neverbe",
    title: "Privacy Policy - NEVERBE",
    description:
      "Read NEVERBE's Privacy Policy outlining how we collect, use, and protect your data.",
  },
  openGraph: {
    title: "Privacy Policy - NEVERBE",
    description:
      "Read NEVERBE's Privacy Policy outlining how we collect, use, and protect your data.",
    url: "https://neverbe.com/policies/privacy-policy",
    siteName: "NEVERBE",
    type: "website",
  },
};

const Page = () => {
  return <PrivacyPolicyClient />;
};

export default Page;
