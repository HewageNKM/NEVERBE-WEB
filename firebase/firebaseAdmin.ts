import admin, { credential } from 'firebase-admin';
import { Item, Order, Slide } from "@/interfaces";

// Initialize Firebase Admin SDK if it hasn't been initialized already
if (!admin.apps.length) {
    console.log("Initializing Firebase Admin SDK");
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

// Function to add a new order, update inventory, and handle stock checks
export const addNewOrder = async (order: Order) => {
    console.log("Adding new order:", order.orderId);

    const inventoryUpdates = [];

    for (const orderItem of order.items) {
        console.log(`Checking inventory for item: ${orderItem.itemId}, variant: ${orderItem.variantId}`);

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

        // Check if the size exists and has sufficient stock
        const size = variant.sizes.find(s => s.size === orderItem.size);
        if (!size) {
            throw new Error(`Size ${orderItem.size} does not exist for variant ${orderItem.variantId}.`);
        }

        if (size.stock < orderItem.quantity) {
            throw new Error("Insufficient Stock");
        }

        console.log(`Sufficient stock found. Deducting ${orderItem.quantity} units from stock.`);

        // Deduct the stock
        size.stock -= orderItem.quantity;

        // Prepare the updated inventory item for batch update
        inventoryUpdates.push({
            itemId: orderItem.itemId,
            inventoryItem,
        });
    }

    // Batch update inventory
    const batch = adminFirestore.batch();
    inventoryUpdates.forEach(({ itemId, inventoryItem }) => {
        const itemRef = adminFirestore.collection('inventory').doc(itemId);
        batch.set(itemRef, inventoryItem);
    });
    await batch.commit();
    console.log("Inventory successfully updated.");

    // Save the order in the orders collection
    return await adminFirestore.collection('orders').doc(order.orderId).set({
        ...order,
        customer: {
            ...order.customer,
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now(),
        },
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
    });
};

// Function to update the payment status of an order
export const updatePayment = async (orderId: string, paymentId: string, status: string) => {
    console.log(`Updating payment status for order: ${orderId} to ${status}`);
    return await adminFirestore.collection('orders').doc(orderId).update({
        paymentId: paymentId,
        paymentStatus: status,
        updatedAt: admin.firestore.Timestamp.now()
    });
};

// Function to get order details by ID
export const getOrderById = async (orderId: string) => {
    console.log(`Fetching order by ID: ${orderId}`);
    const doc = await adminFirestore.collection('orders').doc(orderId).get();
    return doc.data() as Order;
};

// Function to get all items in inventory
export const getAllInventoryItems = async () => {
    console.log("Fetching all inventory items.");
    const docs = await adminFirestore.collection('inventory').get();
    const items: Item[] = [];
    docs.forEach(doc => {
        items.push({...doc.data(), createdAt: null, updatedAt: null} as Item);
    });
    console.log("Total inventory items fetched:", items.length);
    return items;
};

// Function to fetch recent inventory items based on creation date
export const getRecentItems = async () => {
    console.log("Fetching recent inventory items.");
    const docs = await adminFirestore.collection('inventory').orderBy('createdAt', 'desc').limit(16).get();
    const items: Item[] = [];
    docs.forEach(doc => {
        items.push({...doc.data(), createdAt: null, updatedAt: null} as Item);
    });
    console.log("Total recent items fetched:", items.length);
    return items;
};

// Function to fetch all slider items
export const getSliders = async () => {
    console.log("Fetching sliders.");
    const docs = await adminFirestore.collection('sliders').get();
    const sliders: Slide[] = [];
    docs.forEach(doc => {
        sliders.push(doc.data() as Slide);
    });
    console.log("Total sliders fetched:", sliders.length);
    return sliders;
};

// Function to get hot products based on order count
export const getHotProducts = async () => {
    console.log("Calculating hot products based on order counts.");
    const ordersSnapshot = await adminFirestore.collection('orders').get();
    const itemCount: Record<string, number> = {};

    ordersSnapshot.forEach(doc => {
        const order = doc.data();
        order.items.forEach(item => {
            itemCount[item.itemId] = (itemCount[item.itemId] || 0) + 1;
        });
    });

    const sortedItems = Object.entries(itemCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(entry => entry[0]);

    const hotProducts: Item[] = [];
    for (const itemId of sortedItems) {
        const itemDoc = await adminFirestore.collection('inventory').doc(itemId).get();
        if (itemDoc.exists) {
            hotProducts.push({...itemDoc.data(), createdAt: null, updatedAt: null} as Item);
        }
    }
    console.log("Total hot products fetched:", hotProducts.length);
    return hotProducts;
};

// Function to get a single item by ID
export const getItemById = async (itemId: string) => {
    console.log(`Fetching item by ID: ${itemId}`);
    const itemDoc = await adminFirestore.collection('inventory').doc(itemId).get();
    return itemDoc.exists ? {
        ...itemDoc.data(),
        createdAt: null,
        updatedAt: null,
    } as Item : null;
};

// Functions for querying items by custom fields
export const getItemsByField = async (name: string, fieldName: string) => {
    console.log(`Fetching items where ${fieldName} == ${name}`);
    const docs = await adminFirestore.collection('inventory').where(fieldName, '==', name).get();
    const items: Item[] = [];
    docs.forEach(doc => {
        items.push({...doc.data(), createdAt: null, updatedAt: null} as Item);
    });
    console.log(`Total items fetched where ${fieldName} == ${name}:`, items.length);
    return items;
};

export const getItemsByTwoField = async (firstValue: string, secondValue: string, firstFieldName: string, secondFieldName: string) => {
    console.log(`Fetching items where ${firstFieldName} == ${firstValue} and ${secondFieldName} == ${secondValue}`);
    const docs = await adminFirestore.collection('inventory').where(firstFieldName, '==', firstValue).where(secondFieldName, '==', secondValue).get();
    const items: Item[] = [];
    docs.forEach(doc => {
        items.push({...doc.data(), createdAt: null, updatedAt: null} as Item);
    });
    console.log(`Total items fetched where ${firstFieldName} == ${firstValue} and ${secondFieldName} == ${secondValue}:`, items.length);
    return items;
};

// Function to verify Firebase ID token from request headers
export const verifyToken = async (req: any) => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Authorization header is missing or invalid");
    }

    const idToken = authHeader.split(" ")[1];
    console.log("Verifying ID token.");
    return await adminAuth.verifyIdToken(idToken);
};
