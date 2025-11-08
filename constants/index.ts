import {
  BOOTSBG,
  DeliveryImage,
  GoodsImage,
  MoneyImage,
  PayHereWhiteLongBanner,
  RunningShoeBG,
  SlidesBG,
  SupportImage,
} from "@/assets/images";
import { FooterLink, SocialMedia } from "@/interfaces";
import { IoLogoTiktok } from "react-icons/io5";
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { FaMobile } from "react-icons/fa";
import { FaMessage, FaPhone } from "react-icons/fa6";

export const seoKeywords: string[] = [
  "never be lk",
  "neverbe",
  "shoes sri lanka",
  "shoes online sri lanka",
  "sneakers sri lanka",
  "copy shoes sri lanka",
  "brand copy shoes sri lanka",
  "nike sri lanka",
  "nike colombo",
  "nike gampaha",
  "adidas sri lanka",
  "adidas colombo",
  "adidas gampaha",
  "new balance sri lanka",
  "new balance colombo",
  "new balance gampaha",
  "puma sri lanka",
  "puma colombo",
  "puma gampaha",
  "mens shoes sri lanka",
  "womens shoes sri lanka",
  "slippers sri lanka",
  "sandals sri lanka",
  "shoe store sri lanka",
  "shoe shop sri lanka",
  "shoe shopping sri lanka",
  "shoe store online sri lanka",
  "shoe shop online sri lanka",
  "shoe shopping online sri lanka",
  "copy shoes colombo",
  "copy shoes gampaha",
  "brand copy shoes colombo",
  "brand copy shoes gampaha",
  "mens shoes colombo",
  "mens shoes gampaha",
  "womens shoes colombo",
  "womens shoes gampaha",
];
export const sortingOptions = [
  {
    name: "Not Selected",
    value: "NO SELCT",
  },
  {
    name: "Price: Low to High",
    value: "LOW TO HIGH",
  },
  {
    name: "Price: High to Low",
    value: "HIGH TO LOW",
  },
];

export const whyUs = [
  {
    title: "Low Prices",
    description: "We offer the lowest prices, best deals and promotions.",
    image: MoneyImage,
  },
  {
    title: "Customer Service",
    description: "customer service is our top priority.",
    image: SupportImage,
  },
  {
    title: "Largest Collection",
    description: "We have the largest collection of products in the market.",
    image: GoodsImage,
  },
  {
    title: "Fast Shipping",
    description: "We deliver your products withing couples of days.",
    image: DeliveryImage,
  },
];
export const termsAndConditions = [
  {
    title: "Acceptance of Terms",
    description:
      "By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please refrain from using our website.",
  },
  {
    title: "Privacy Policy",
    description:
      "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and safeguard your personal information. By using our website, you consent to the collection and use of your information as outlined.",
  },
  {
    title: "Intellectual Property",
    description:
      "All content on this website, including but not limited to text, images, logos, and graphics, is the property of NEVERBE and is protected by copyright and other intellectual property laws. Any use, reproduction, or distribution of this content without our express written consent is strictly prohibited. Please note that some of the images used on our website are sourced from free image platforms and remain the intellectual property of their respective owners. These images are used in compliance with the licenses provided by their creators. If you believe your content has been used improperly, please contact us to resolve the issue.",
  },
  {
    title: "Product Information",
    description:
      "We strive to ensure that the information provided on our website, including product descriptions, images, and pricing, is accurate and up-to-date. However, errors and inaccuracies may occasionally occur. We reserve the right to correct such errors, update product information, and modify content at any time without prior notice.",
  },
  {
    title: "Limitation of Liability",
    description:
      "NEVERBE shall not be held liable for any direct, indirect, incidental, special, or consequential damages that arise out of or are in any way connected to the use of our website or the purchase of products through our website. This includes, but is not limited to, any errors, omissions, or inaccuracies in the content or products available on our website.",
  },
  {
    title: "Use of Free Images",
    description:
      "Some of the images displayed on our website are sourced from free image websites and are used in accordance with the relevant licenses. NEVERBE respects the rights of content creators and ensures that such materials are used appropriately. If you believe that an image has been misused, please contact us immediately.",
  },
  {
    title: "Governing Law",
    description:
      "These Terms and Conditions are governed by and construed in accordance with the laws of Sri Lanka. Any disputes arising from or related to these terms shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.",
  },
];
export const shippingReturnPolicy = [
  {
    title: "Return Eligibility",
    description:
      "We accept returns for unworn, unused items with their original packaging intact. Accessories, such as socks and insoles, are final sale and cannot be returned or exchanged. To be eligible for a return, please initiate the process within 3 days of receiving your order.",
  },
  {
    title: "Initiating a Return",
    description:
      "To request a return or exchange, please contact our customer service team for authorization. Once approved, you can send the item back to us using a trackable shipping method.",
  },
  {
    title: "Return Process",
    description:
      "Once we receive your returned item and inspect it for any damage or signs of wear, we will process your request. Exchanges are subject to the availability of the requested size or color. If you opt for a refund, it will be issued to your original payment method. Please note that it may take up to 10 working days for the refund to reflect on your bank statement.",
  },
  {
    title: "Return Shipping",
    description:
      "Customers are responsible for return shipping costs unless the return is due to an error on our part (e.g., wrong item sent, defective product). In such cases, we will provide a prepaid shipping label for the return.",
  },
  {
    title: "Shipping Methods",
    description:
      "We offer standard shipping within Sri Lanka. Your order will be carefully packed and delivered to your doorstep via our trusted courier partners.",
  },
  {
    title: "Shipping Fees",
    description:
      "Shipping fees are calculated based on your location and the total weight of your order. You can view the shipping cost during the checkout process before finalizing your purchase.",
  },
  {
    title: "Shipping Times",
    description:
      "Orders are typically processed and shipped within 1-2 business days. Delivery times may vary depending on your location, but most orders are delivered within 2-6 business days.",
  },
  {
    title: "Order Tracking",
    description:
      "Once your order has been shipped, you will receive a shipping confirmation email with a tracking number. You can use this tracking number to monitor the status of your delivery online.",
  },
  {
    title: "Shipping Restrictions",
    description:
      "Please note that we currently only offer shipping within Sri Lanka. We apologize for any inconvenience this may cause to our international customers.",
  },
];
export const address = {
  address: "330/4/10, New Kandy Road, Delgoda",
  map: "https://maps.app.goo.gl/7eFH4HxJBnPQ96uQ9",
};
export const socialMedia: SocialMedia[] = [
  {
    icon: IoLogoFacebook,
    name: "Facebook",
    url: "https://www.facebook.com/share/1GaP5gJB2p/",
  },
  {
    icon: IoLogoInstagram,
    name: "Instagram",
    url: "https://www.instagram.com/neverbe.196",
  },
  {
    icon: IoLogoTiktok,
    name: "Tiktok",
    url: "https://www.tiktok.com/@neverbe196?_t=8qG86zTXl2d&_r=1",
  },
];
export const informationLinks: FooterLink[] = [
  { title: "Shipping & Returns", url: "/policies/shipping-return-policy" },
  { title: "Terms & Conditions", url: "/policies/terms-conditions" },
  { title: "Privacy Policy", url: "/policies/privacy-policy" },
  {title:"About Us", url:"/aboutUs"},
  {title:"Contact Us", url:"contact"}
];
export const privacyPolicy = {
  company: "Watch Line",
  website: "https://neverbe.lk",
  serviceName: "NEVERBE",
  lastUpdated: "2024-10-04",
  sections: {
    intro: `Watch Line (“us”, “we”, or “our”) operates the https://neverbe.lk website (the “Service”).

    This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.

    We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible from `,
    informationCollection: {
      personalData: `While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (“Personal Data”). Personally identifiable information may include, but is not limited to:

      - Email address
      - First name and last name
      - Phone number
      - Address, Province, ZIP/Postal code, City/District
      - National ID Card or Passport Number
      - Cookies and Usage Data
      - IP Address`,
      usageData: `We may also collect information how the Service is accessed and used (“Usage Data”). This Usage Data may include information such as your computer’s Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.`,
    },
    trackingCookies: {
      description: `We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.`,
      examples: [
        "Session Cookies: We use Session Cookies to operate our Service.",
        "Preference Cookies: We use Preference Cookies to remember your preferences and various settings.",
        "Security Cookies: We use Security Cookies for security purposes.",
      ],
    },
    useOfData: [
      "To provide and maintain the Service",
      "To notify you about changes to our Service",
      "To provide customer care and support",
      "To provide analysis or valuable information to improve the Service",
      "To monitor the usage of the Service",
      "To detect, prevent and address technical issues",
    ],
    transferOfData: `Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your country or jurisdiction where data protection laws may differ. By providing us your data, you agree to the transfer.`,
    disclosureOfData: {
      legalRequirements: [
        "To comply with a legal obligation",
        "To protect and defend the rights or property of NEVERBE",
        "To prevent or investigate possible wrongdoing in connection with the Service",
        "To protect the personal safety of users of the Service or the public",
        "To protect against legal liability",
      ],
    },
    securityOfData: `We strive to use commercially acceptable means to protect your Personal Data but cannot guarantee its absolute security.`,
    serviceProviders: `We may employ third party companies to facilitate our Service, provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used.`,
    analytics: {
      googleAnalytics: `Google Analytics is a web analytics service that tracks and reports website traffic. You can opt out by installing the Google Analytics opt-out browser add-on.`,
    },
    linksToOtherSites: `Our Service may contain links to other sites that are not operated by us. We are not responsible for the content, privacy policies, or practices of any third-party sites or services.`,
    childrenPrivacy: `Our Service does not address anyone under the age of 12. We do not knowingly collect personally identifiable information from anyone under 12.`,
    changesToPrivacyPolicy: `We may update our Privacy Policy from time to time. You are advised to review this Privacy Policy periodically for any changes. Changes are effective when posted on this page.`,
  },
};
export const faqs = [
  {
    question: "What is the return policy?",
    answer: "You can return the product within 7 days of purchase.",
  },
  {
    question: "What is the exchange policy?",
    answer: "You can exchange the product within 7 days of purchase.",
  },
  {
    question: "What is the payment method?",
    answer: "We accept all types of payment methods.",
  },
  {
    question: "What is the delivery time?",
    answer: "We deliver the product within 6-10 days of purchase.",
  },
  {
    question: "What is the shipping policy?",
    answer: "We ship the product within 2 days of purchase.",
  },
  {
    question: "Do you provide a warranty?",
    answer: "No, we do not provide a warranty for our products.",
  },
  {
    question: "Are the products original?",
    answer:
      "Our products are high-quality copies made in Vietnam, not original.",
  },
];
export const payHere = {
  longWhiteBanner: PayHereWhiteLongBanner,
  payHereLink: "https://www.payhere.lk/",
};
export const contactInfo = [
  {
    icon: MdEmail,
    content: "info@neverbe.lk",
    link: "info@neverbe.lk",
  },
  {
    icon: FaMessage,
    content: "Send us a message",
    link: "/contact",
  },
  {
    icon: FaMobile,
    content: "+94 72 924 9999",
    link: "tel:+94729249999",
  },
  {
    icon: FaPhone,
    content: "+94 70 520 8999",
    link: "tel:+94705208999",
  },
];
export const paymentMethods = {
  PAYHERE: "PAYHERE",
};
export enum ContactUs {
  infoEmail = "info@neverbe.lk",
  supportEmail = "support@neverbe.lk",
  embeddedMap = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7920.379213809781!2d80.01265924429379!3d6.986933221248742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2fff7a1993cd9%3A0x19b93ace8a7b3b80!2sNEVERBE!5e0!3m2!1sen!2slk!4v1729443817724!5m2!1sen!2slk",
}

export const collectionList = [
  {
    label:"Slides & Slippers & Sandals",
    url:"/collections/categories/Sandals%20&%20Slippers%20&%20Slides",
    image: SlidesBG 
  },
  {
    label:"Boots",
    url:"/collections/categories/Boots",
    image: BOOTSBG
  },
  {
    label:"Running/Sport Shoes",
    url:"/collections/categories/Running%20Shoes",
    image:RunningShoeBG
  }
];

export const SHIPPING_FLAT_RATE_1 = 380;
export const SHIPPING_FLAT_RATE_2 = 500;
