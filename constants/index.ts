import {
    AdidasLogo, CrossLogo,
    DeliveryImage,
    GoodsImage,
    MoneyImage,
    NewBalanceLogo,
    NikeLogo, PoloLogo,
    SupportImage
} from "@/assets/images";

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
    {name:"All", value:"all"},
    {name:"Shoe", value:"shoe"},
    {name:"Scandals", value:"scandals"},
    {name:"Accessories", value:"accessories"},
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
        name:"Nike",
        image:NikeLogo
    },
    {
        name:"Adidas",
        image:AdidasLogo
    },
    {
        name:"New Balance",
        image:NewBalanceLogo
    },
    {
        name:"Cross",
        image:CrossLogo
    },
    {
        name:"Polo",
        image: PoloLogo
    }
]