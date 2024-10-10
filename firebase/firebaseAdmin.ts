import admin, {credential} from 'firebase-admin';
import {Item, Order, Slide} from "@/interfaces";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
}

export const adminFirestore = admin.firestore();
export const adminAuth = admin.auth();

export const addNewOrder = async (order: Order) => {
    return await adminFirestore.collection('orders').doc(order.orderId).set(order);
}
export const updatePayment = async (orderId:string, paymentId:string) => {
    return await adminFirestore.collection('orders').doc(orderId).update({paymentId: paymentId, paymentStatus: "Paid"});
}
export const deleteOrderByIdAndRestock = async (orderId: string) => {
    const doc = await adminFirestore.collection("orders").doc(orderId).get();
    const order: Order = doc.data() as Order;

    for (const orderItem of order.items) {
        const itemDoc = await adminFirestore.collection('inventory').doc(orderItem.itemId).get();
        const inventoryItem = itemDoc.data() as Item;

        inventoryItem.variants.forEach(variant => {
            if (variant.variantId === orderItem.variantId) {
                variant.sizes.forEach(size => {
                    if (size.size === orderItem.size) {
                        size.stock += orderItem.quantity;
                    }
                });
            }
        });

        await adminFirestore.collection('inventory').doc(orderItem.itemId).set(inventoryItem);
    }

}
export const getOrderById = async (orderId:string) => {
    const doc = await adminFirestore.collection('orders').doc(orderId).get();
    return doc.data() as Order;
}
export const getAllInventoryItems = async () => {
    const docs = await adminFirestore.collection('inventory').get();
    let items: Item[] = [];
    docs.forEach(doc => {
        const itemData = doc.data();
        items.push({
            ...itemData,
            createdAt: itemData.createdAt.toDate().toISOString(), // Convert to ISO string
        } as Item);
    })
    return items;
}
export const getRecentItems = async () => {
    const docs = await adminFirestore.collection('inventory').orderBy('createdAt', 'desc').limit(16).get();
    let items: Item[] = [];

    docs.forEach(doc => {
        const itemData = doc.data();
        items.push({
            ...itemData,
            createdAt: itemData.createdAt.toDate().toISOString(), // Convert to ISO string
        } as Item);
    })

    return items;
}

export const getSliders = async () => {
    const docs = await adminFirestore.collection('sliders').get();
    let sliders: Slide[] = [];
    docs.forEach(doc => {
        sliders.push(doc.data() as Slide);
    })

    return sliders;
}

export const getHotsProducts = async () => {
    return [];
}

export const getItemById = async (itemId: string) => {
    let itemDoc = await adminFirestore.collection('inventory').doc(itemId).get();

    if (itemDoc.exists) {
        const itemData = itemDoc.data();
        return {
            ...itemData,
            createdAt: itemData?.createdAt.toDate().toISOString(),
        } as Item;
    } else {
        return null;
    }
}
export const getItemsByField = async (name: string, fieldName: string) => {
    const docs = await adminFirestore.collection('inventory').where(fieldName, '==', name).get();
    let items: Item[] = [];
    docs.forEach(doc => {
        const itemData = doc.data();
        items.push({
            ...itemData,
            createdAt: itemData.createdAt.toDate().toISOString(), // Convert to ISO string
        } as Item);
    })
    return items;
}
export const getItemsByTwoField = async (firstValue: string, secondValue: string, firstFieldName: string, secondFieldNane: string) => {
    const docs = await adminFirestore.collection('inventory').where(firstFieldName, '==', firstValue).where(secondFieldNane, '==', secondValue).get();
    let items: Item[] = [];
    docs.forEach(doc => {
        const itemData = doc.data();
        items.push({
            ...itemData,
            createdAt: itemData.createdAt.toDate().toISOString(), // Convert to ISO string
        } as Item);
    })
    return items;
}
export const verifyToken = async (req:any) => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        new Error("Authorization header is missing or invalid");
    }

    const idToken = authHeader.split(" ")[1]; // Extract the token part after "Bearer"

    // Verify the ID token using Firebase Admin SDK
    return await adminAuth.verifyIdToken(idToken);
}

