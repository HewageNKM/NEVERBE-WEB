import {Timestamp} from "@firebase/firestore";

export interface Message {
    email: string;
    subject: string;
    name: string;
    message: string;
}

export interface Item {
    itemId: string,
    type: string,
    brand: string,
    thumbnail: {
        file:string,
        url:string,
    },
    variants: Variant[],
    manufacturer: string,
    name: string,
    sellingPrice: number,
    discount: number,
    listing: "Active" | "Inactive",
    status: "Active" | "Inactive",

    createdAt: Timestamp | null,
    updatedAt: Timestamp | null,
}

export interface Size {
    size: string,
    stock: number,
}

export interface Variant {
    variantId: string,
    variantName: string,
    images: [{
        file: string,
        url: string,
    }],
    sizes: Size[],
}

export interface CartItem {
    itemId: string,
    variantId: string,
    name: string,
    variantName: string,
    thumbnail: string,
    size: string,
    type: string,
    quantity: number,
    price: number,
}

export interface OrderItem {
    itemId: string,
    variantId: string,
    name: string,
    variantName: string,
    size: string,
    quantity: number,
    price: number,
}

export interface FooterLink {
    title: string;
    url: string;
}

export interface SocialMedia {
    icon: React.ElementType;
    name: string;
    url: string;
}

export interface Slide {
    fileName: string;
    urls: {
        default: string;
        mobile: string;
    };
}

export interface Order {
    orderId: string,
    paymentId: string,
    items: OrderItem[],
    paymentStatus: string,
    paymentMethod: string,
    customer: Customer,
    from: string,
    shippingCost: number,
    createdAt: Timestamp | null,
    updatedAt: Timestamp | null,
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    createdAt: Timestamp | null;
    updatedAt: Timestamp | null;
}