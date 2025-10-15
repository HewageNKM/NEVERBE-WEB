import { Metadata } from "next";
import TermsClient from "./components/TermsClient";

export const metadata: Metadata = {
  title: "Terms & Conditions - NEVERBE",
  description:
    "Read NEVERBE's Terms & Conditions outlining the rules and guidelines for using our website and purchasing our products.",
  twitter: {
    card: "summary_large_image",
    site: "@neverbe",
    creator: "@neverbe",
    title: "Terms & Conditions - NEVERBE",
    description:
      "Read NEVERBE's Terms & Conditions outlining the rules and guidelines for using our website and purchasing our products.",
  },
  openGraph: {
    title: "Terms & Conditions - NEVERBE",
    description:
      "Read NEVERBE's Terms & Conditions outlining the rules and guidelines for using our website and purchasing our products.",
    url: "https://neverbe.com/policies/terms-and-conditions",
    siteName: "NEVERBE",
    type: "website",
  },
};

const Page = () => {
  return <TermsClient />;
};

export default Page;
