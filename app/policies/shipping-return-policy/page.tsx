import { Metadata } from "next";
import ShippingReturnPolicyClient from "./components/ShippingReturnPolicyClient";

export const metadata: Metadata = {
  title: "Shipping & Return Policy - NEVERBE",
  description:
      "Read NEVERBE's shipping & return policy outlining how we manage shippin and return.",
  twitter: {
    card: "summary_large_image",
    site: "@neverbe",
    creator: "@neverbe",
    title: "Shipping & Return Policy - NEVERBE",
    description:
      "Read NEVERBE's shipping & return policy outlining how we manage shippin and return.",
  },
  openGraph: {
    title: "Shipping & Return Policy - NEVERBE",
    description:
      "Read NEVERBE's shipping & return policy outlining how we manage shippin and return.",
    url: "https://neverbe.com/policies/shipping-return-policy",
    siteName: "NEVERBE",
    type: "website",
  },
};

const Page = () => {
  return <ShippingReturnPolicyClient />;
};

export default Page;
