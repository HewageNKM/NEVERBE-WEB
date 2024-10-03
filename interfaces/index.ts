export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    }
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface Item {
    itemId: string,
    type: string,
    brand: string,
    thumbnail:string,
    variants: Variant[],
    manufacturer: string,
    name: string,
    sellingPrice: number,
    discount: number,
}
export interface Size{
    size: string,
    stock: number,
}
export interface Variant {
    variantId: string,
    variantName: string,
    images: string[],
    sizes: Size[],
}

export interface CartItem {
    itemId: string,
    variantId: string,
    name: string,
    variantName: string,
    thumbnail: string,
    size: string,
    quantity: number,
    price: number,
}