import {
    AdidasLogo,
    CrossLogo,
    DeliveryImage,
    GoodsImage,
    MoneyImage,
    NewBalanceLogo,
    NikeLogo,
    PoloLogo,
    SupportImage
} from "@/assets/images";
import {FooterLink, SocialMedia} from "@/interfaces";
import {IoLogoTiktok, IoPhoneLandscape} from "react-icons/io5";
import {IoLogoFacebook, IoLogoInstagram} from "react-icons/io";
import {MdEmail} from "react-icons/md";
import {BiMobile} from "react-icons/bi";
import {TbDeviceLandlinePhone} from "react-icons/tb";

export const brands = [
    {
        name: 'Nike',
        value: 'nike',
        url: '/products/brands/nike',
        titles: [
            {
                name: "Air Max",
                url: "/products/brands/nike/air-max"
            },
            {
                name: "Air Force",
                url: "/products/brands/nike/air-force"
            },
            {
                name: "Jordan",
                url: "/products/brands/nike/jordan"
            },
            {
                name: "SB",
                url: "/products/brands/nike/react"
            },
            {
                name: "Scandals",
                url: "/products/brands/nike/scandals"
            }
        ]
    },
    {
        name: 'Adidas',
        value: 'adidas',
        url: '/products/brands/adidas',
        titles: [
            {
                name: "Campus",
                url: "/products/brands/adidas/campus"
            },
            {
                name: "Samba",
                url: "/products/brands/adidas/samba"
            },
            {
                name: "Scandals",
                url: "/products/brands/adidas/scandals"
            }
        ]
    },
    {
        name: 'New Balance',
        value: 'new-balance',
        url: '/products/brands/puma',
        titles: [
            {
                name: "Scandals",
                url: "/products/brands/new-balance/scandals"
            }
        ]
    },
    {
        name: 'Cross',
        value: 'cross',
        url: '/products/brands/reebok',
        titles: [
            {
                name: "Scandals",
                url: "/products/brands/new-balance/scandals"
            }
        ]
    },
    {
        name: 'Polo',
        value: 'polo',
        url: '/products/brands/polo',
        titles: [
            {
                name: "Scandals",
                url: "/products/brands/polo/scandals"
            }
        ]
    },
    {
        name: "MLB",
        value: "mlb",
        url: "/products/brands/mlb",
        titles: [
            {
                name: "Scandals",
                url: "/products/brands/mlb/scandals"
            }
        ]
    }
]
export const sortingOptions = [
    {
        name: "Sort By",
        value: ""
    },
    {
        name: 'Price: Low to High',
        value: 'lh'
    },
    {
        name: 'Price: High to Low',
        value: 'hl'
    },
    {
        name: 'Newest Arrivals',
        value: 'newest'
    }
]
export const productTypes = [
    {name: "All", value: "all"},
    {name: "Shoe", value: "shoe"},
    {name: "Scandals", value: "scandals"},
    {name: "Accessories", value: "accessories"},
]
export const wearableSizes = [
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
]
export const accessoriesSizes = [
    "S",
    "M",
    "L",
    "XL",
    "200ml"
]
export const whyUs = [
    {
        title: "Low Prices",
        description: "We offer the lowest prices, deals and promotions.",
        image: MoneyImage
    },
    {
        title: "Customer Service",
        description: "customer service is our top priority.",
        image: SupportImage
    },
    {
        title: "Largest Collection",
        description: "We have the largest collection of products in the market.",
        image: GoodsImage
    },
    {
        title: "Fast Shipping",
        description: "We deliver your products withing couples of days.",
        image: DeliveryImage
    }
]
export const brandsLogo = [
    {
        name: "Nike",
        image: NikeLogo
    },
    {
        name: "Adidas",
        image: AdidasLogo
    },
    {
        name: "New Balance",
        image: NewBalanceLogo
    },
    {
        name: "Cross",
        image: CrossLogo
    },
    {
        name: "Polo",
        image: PoloLogo
    }
]
export const termsAndConditions = [
    {
        title: "Acceptance of Terms",
        description: "By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please refrain from using our website."
    },
    {
        title: "Privacy Policy",
        description: "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and safeguard your personal information. By using our website, you consent to the collection and use of your information as outlined."
    },
    {
        title: "Intellectual Property",
        description: "All content on this website, including but not limited to text, images, logos, and graphics, is the property of NEVERBE and is protected by copyright and other intellectual property laws. Any use, reproduction, or distribution of this content without our express written consent is strictly prohibited. Please note that some of the images used on our website are sourced from free image platforms and remain the intellectual property of their respective owners. These images are used in compliance with the licenses provided by their creators. If you believe your content has been used improperly, please contact us to resolve the issue."
    },
    {
        title: "Product Information",
        description: "We strive to ensure that the information provided on our website, including product descriptions, images, and pricing, is accurate and up-to-date. However, errors and inaccuracies may occasionally occur. We reserve the right to correct such errors, update product information, and modify content at any time without prior notice."
    },
    {
        title: "Limitation of Liability",
        description: "NEVERBE shall not be held liable for any direct, indirect, incidental, special, or consequential damages that arise out of or are in any way connected to the use of our website or the purchase of products through our website. This includes, but is not limited to, any errors, omissions, or inaccuracies in the content or products available on our website."
    },
    {
        title: "Use of Free Images",
        description: "Some of the images displayed on our website are sourced from free image websites and are used in accordance with the relevant licenses. NEVERBE respects the rights of content creators and ensures that such materials are used appropriately. If you believe that an image has been misused, please contact us immediately."
    },
    {
        title: "Governing Law",
        description: "These Terms and Conditions are governed by and construed in accordance with the laws of Sri Lanka. Any disputes arising from or related to these terms shall be subject to the exclusive jurisdiction of the courts of Sri Lanka."
    },
    {
        title: "Contact Information",
        description: "By using our website and making a purchase, you acknowledge that you have read, understood, and agree to abide by these Terms and Conditions. If you have any questions, concerns, or need assistance, please contact us."
    }
]
export const shippingReturnPolicy = [
    {
        title: "Return Eligibility",
        description:
            "We accept returns on unworn, unused items with their original packaging intact. To be eligible for a return, please initiate the return process within 7 days of receiving your order.",
    },
    {
        title: "Initiating a Return",
        description:
            "If you would like to return an item, please contact our customer service team to request a return authorization. Once approved, you can send the item back to us using a trackable shipping method.",
    },
    {
        title: "Refund Process",
        description:
            "Once we receive your returned item and inspect it for any damage or signs of wear, we will process your refund accordingly. Refunds will be issued to the original payment method used for the purchase.",
    },
    {
        title: "Return Shipping",
        description:
            "Customers are responsible for the cost of return shipping, unless the return is due to a mistake on our part (e.g., wrong item sent, defective product). In such cases, we will provide a prepaid shipping label for the return.",
    },
    {
        title: "Exchanges",
        description:
            "If you would like to exchange an item for a different size or color, please contact our customer service team for assistance. We will do our best to accommodate your exchange request, subject to availability.",
    },
    {
        title: "More Information",
        description:
            "For more information on our returns and refunds policy, please refer to our Terms and Conditions or contact our customer service team for assistance.",
    },
    {
        title: "Shipping Methods",
        description:
            "We offer standard shipping within Colombo and its surrounding areas. Your order will be carefully packed and delivered to your doorstep via our trusted courier partners.",
    },
    {
        title: "Shipping Fees",
        description:
            "Shipping fees are calculated based on your location and the total weight of your order. You can view the shipping cost during the checkout process before finalizing your purchase.",
    },
    {
        title: "Shipping Times",
        description:
            "Orders are typically processed and shipped within 1-2 business days. Delivery times may vary depending on your location, but most orders  are delivered within 2-6 business days.",
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
    {
        title: "Need Assistance",
        description:
            "If you have any further questions about our shipping process or need assistance with your order, please don’t hesitate to contact us.",
    },
];
export const address = [
    {
        name:"330/40/10,"
    },
    {
        name:"New Kandy Road,"
    },
    {
        name:"Delgoda"
    }
];

export const socialMedia: SocialMedia[] = [
    { icon: IoLogoFacebook, name: "Facebook", url: "" },
    { icon: IoLogoInstagram, name: "Instagram", url: "" },
    { icon: IoLogoTiktok, name: "Tiktok", url: "https://www.tiktok.com/@neverbe196?_t=8qG86zTXl2d&_r=1" },
];

export const informationLinks: FooterLink[] = [
    { title: "FAQ", url: "" },
    { title: "Shipping & Returns", url: "/policies/shipping-return-policy" },
    { title: "Terms & Conditions", url: "/policies/terms-conditions" },
    { title: "Privacy Policy", url: "/policies/privacy-policy" },
];

//Todo: Add phone number and landline number
export const contactInfo = [
    {
        icon: MdEmail,
        content:"info.neverbe@gmail.com"
    },
    {
        icon: BiMobile,
        content:""
    },
    {
        icon: TbDeviceLandlinePhone,
        content:""
    }

];