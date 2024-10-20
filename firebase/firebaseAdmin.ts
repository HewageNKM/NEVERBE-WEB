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
    // Create an array to hold the inventory updates
    const inventoryUpdates = [];

    for (const orderItem of order.items) {
        const itemDoc = await adminFirestore.collection('inventory').doc(orderItem.itemId).get();

        // Check if the item exists
        if (!itemDoc.exists) {
            throw new Error(`Item with ID ${orderItem.itemId} does not exist.`);
        }

        const inventoryItem = itemDoc.data() as Item;

        // Check if the variant exists
        const variant = inventoryItem.variants.find(v => v.variantId === orderItem.variantId);
        if (!variant) {
            throw new Error(`Variant with ID ${orderItem.variantId} does not exist for item ${orderItem.itemId}.`);
        }

        // Check if the size exists and if there is sufficient stock
        const size = variant.sizes.find(s => s.size === orderItem.size);
        if (!size) {
            throw new Error(`Size ${orderItem.size} does not exist for variant ${orderItem.variantId}.`);
        }

        if (size.stock < orderItem.quantity) {
            throw new Error("Insufficient Stock");
        }

        // Deduct the stock
        size.stock -= orderItem.quantity;

        // Prepare the updated inventory item for later update
        inventoryUpdates.push({
            itemId: orderItem.itemId,
            inventoryItem,
        });
    }

    // Update the inventory in a single batch operation
    const batch = adminFirestore.batch();
    inventoryUpdates.forEach(({ itemId, inventoryItem }) => {
        const itemRef = adminFirestore.collection('inventory').doc(itemId);
        batch.set(itemRef, inventoryItem);
    });
    await batch.commit();

    // Save the order
    return await adminFirestore.collection('orders').doc(order.orderId).set({
        ...order,
        customer: {
            ...order.customer,
            createdAt: Date.now().toLocaleString(),
            updatedAt: Date.now().toLocaleString(),
        },
        createdAt: Date.now().toLocaleString(),
        updatedAt: Date.now().toLocaleString(),
    });
};



export const updatePayment = async (orderId:string, paymentId:string,status:string) => {
    return await adminFirestore.collection('orders').doc(orderId).update({paymentId: paymentId, paymentStatus: status, updatedAt: Date.now().toLocaleString()});
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
            createdAt: null,
            updatedAt: null,
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
            createdAt: null,
            updatedAt: null,
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

export const getHotProducts = async () => {
    // Step 1: Get order counts by itemId
    const ordersSnapshot = await adminFirestore.collection('orders').get();

    const itemCount = {};

    ordersSnapshot.forEach(doc => {
        const order = doc.data();
        order.items.forEach(item => {
            if (itemCount[item.itemId]) {
                itemCount[item.itemId]++;
            } else {
                itemCount[item.itemId] = 1;
            }
        });
    });

    // Step 2: Convert counts to an array and sort by count
    const sortedItems = Object.entries(itemCount)
        .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
        .slice(0, 20) // Get top 20
        .map(entry => entry[0]); // Extract itemIds

    // Step 3: Fetch products from the inventory
    const hotProducts = [];

    for (const itemId of sortedItems) {
        const itemDoc = await adminFirestore.collection('inventory').doc(itemId).get();
        if (itemDoc.exists) {
            const itemData = itemDoc.data();
            hotProducts.push({...itemData, createdAt: null, updatedAt: null} as Item);
        }
    }

    return hotProducts;
};

export const getItemById = async (itemId: string) => {
    let itemDoc = await adminFirestore.collection('inventory').doc(itemId).get();

    if (itemDoc.exists) {
        const itemData = itemDoc.data();
        return {
            ...itemData,
            createdAt: null,
            updatedAt: null,
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
            createdAt:null,
            updatedAt:null,
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
            createdAt: null,
            updatedAt: null,
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
