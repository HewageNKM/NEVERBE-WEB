import admin, {credential} from 'firebase-admin';
import {Item, Message, Order, Slide} from "@/interfaces";

// Initialize Firebase Admin SDK if it hasn't been initialized already
if (!admin.apps.length) {
    console.log("Initializing Firebase Admin SDK");
    admin.initializeApp({
        credential: credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
    });
}

export const adminFirestore = admin.firestore();
export const adminAuth = admin.auth();

// Function to add a new order, update inventory, and handle stock checks
export const addNewOrder = async (order: Order) => {
    try {
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
        inventoryUpdates.forEach(({itemId, inventoryItem}) => {
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
    } catch (e) {
        console.log(e)
        throw e;
    }
};

// Function to update the payment status of an order
export const updatePayment = async (orderId: string, paymentId: string, status: string) => {
    try {
        console.log(`Updating payment status for order: ${orderId} to ${status}`);
        return await adminFirestore.collection('orders').doc(orderId).update({
            paymentId: paymentId,
            paymentStatus: status,
            updatedAt: admin.firestore.Timestamp.now()
        });
    } catch (e) {
        console.log(e)
        throw e;
    }
};

// Function to get order details by ID
export const getOrderById = async (orderId: string) => {
    try {
        console.log(`Fetching order by ID: ${orderId}`);
        const doc = await adminFirestore.collection('orders').doc(orderId).get();
        if (!doc.exists) {
            throw new Error(`Order with ID ${orderId} not found.`);
        }
        return doc.data() as Order;
    } catch (e) {
        console.log(e)
        throw e;
    }
};

// Function to get all items in inventory
export const getAllInventoryItems = async () => {
    try {
        console.log("Fetching all inventory items.");
        const docs = await adminFirestore.collection('inventory').where("status", "==", "Active").get();
        const items: Item[] = [];
        docs.forEach(doc => {
            if (doc.data()?.listing == "Active") {
                items.push({...doc.data(), createdAt: null, updatedAt: null} as Item);
            }
        });
        console.log("Total inventory items fetched:", items.length);
        return items;
    } catch (e) {
        console.log(e)
        throw e;
    }
};

// Function to fetch recent inventory items based on creation date
export const getRecentItems = async () => {
    console.log("Fetching recent inventory items.");
    const docs = await adminFirestore.collection('inventory').where("status", '==', "Active").orderBy('createdAt', 'desc').limit(30).get();
    const items: Item[] = [];
    docs.forEach(doc => {
        if (doc.data()?.listing == "Active") {
            console.log(`Item found with ID ${doc.data().itemId}`);
            items.push({...doc.data(), createdAt: null, updatedAt: null} as Item);
        }
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
    try {
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
                if (itemDoc.data()?.status === "Active") {
                    if (itemDoc.data()?.listing === "Active") {
                        console.log(`Item found with ID ${itemDoc.data()?.itemId}`);
                        hotProducts.push({...itemDoc.data(), createdAt: null, updatedAt: null} as Item);
                    }
                }
            }
            if (hotProducts.length === 14) {
                break; // Exit the loop once we have 14 hot products
            }
        }
        console.log("Total hot products fetched:", hotProducts.length);
        return hotProducts;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

// Function to get a single item by ID
export const getItemById = async (itemId: string) => {
    try {
        console.log(`Fetching item by ID: ${itemId}`);
        const itemDoc = await adminFirestore.collection('inventory').doc(itemId).get();
        if (itemDoc.exists) {
            if (itemDoc.data()?.status == "Active") {
                if (itemDoc.data()?.listing == "Active") {
                    console.log(`Item found with ID ${itemId}`);
                    return {
                        ...itemDoc.data(),
                        createdAt: null,
                        updatedAt: null,
                    }
                } else {
                    throw new Error(`Item with ID ${itemId} is not listed.`);
                }
            } else {
                throw new Error(`Item with ID ${itemId} is not active.`);
            }
        } else {
            throw new Error(`Item with ID ${itemId} not found.`);
        }
    } catch (e) {
        console.log(e)
        throw e;
    }
};

// Functions for querying items by custom fields
export const getItemsByField = async (name: string, fieldName: string) => {
    try {
        console.log(`Fetching items where ${fieldName} == ${name}`);
        const docs = await adminFirestore.collection('inventory').where(fieldName, '==', name).get();
        const items: Item[] = [];
        docs.forEach(doc => {
            if (doc.data()?.status == "Active") {
                if (doc.data()?.listing == "Active") {
                    console.log(`Item found with ID ${doc.data().itemId}`);
                    items.push({...doc.data(), createdAt: null, updatedAt: null} as Item);
                }
            }
        });
        console.log(`Total items fetched where ${fieldName} == ${name}:`, items.length);
        return items;
    } catch (e) {
        console.log(e)
        throw e;
    }
};

export const getItemsByTwoField = async (firstValue: string, secondValue: string, firstFieldName: string, secondFieldName: string) => {
    try {
        console.log(`Fetching items where ${firstFieldName} == ${firstValue} and ${secondFieldName} == ${secondValue}`);
        if (secondValue == "all") {
            console.log(`Fetching items where ${firstFieldName} == ${firstValue}`);
            return getItemsByField(firstValue, firstFieldName);
        }
        const docs = await adminFirestore.collection('inventory').where(firstFieldName, '==', firstValue).where(secondFieldName, '==', secondValue).get();
        const items: Item[] = [];
        docs.forEach(doc => {
            if (doc.data()?.status == "Active") {
                if (doc.data()?.listing == "Active") {
                    console.log(`Item found with ID ${doc.data().itemId}`);
                    items.push({...doc.data(), createdAt: null, updatedAt: null} as Item);
                }
            }
        });
        console.log(`Total items fetched where ${firstFieldName} == ${firstValue} and ${secondFieldName} == ${secondValue}:`, items.length);
        return items;
    } catch (e) {
        console.log(e)
        throw e;
    }
};
export const getSimilarItems = async (itemId: string) => {
    try {
        console.log(`Fetching similar items for item ID: ${itemId}`);

        // Fetch the item document by ID
        const itemDoc = await adminFirestore.collection('inventory').doc(itemId).get();
        if (!itemDoc.exists) {
            throw new Error(`Item with ID ${itemId} not found.`);
        }

        const item = itemDoc.data() as Item;

        // Fetch items with matching type and brand
        const similarItemsQuery = await adminFirestore
            .collection('inventory')
            .where("type", "==", item.type)
            .where("brand", "==", item.brand)
            .limit(10)
            .get();
        const items: Item[] = [];
        // Process and filter the results
        const similarItems = similarItemsQuery.docs.filter(doc => doc.id !== itemId) // Exclude the original item
            .map(doc => {
                return {...doc.data(), itemId: doc.id, createdAt: null, updatedAt: null} as Item;
            });

        similarItems.forEach(doc => {
            if (doc.status == "Active") {
                if (doc.listing == "Active") {
                    console.log(`Item found with ID ${doc.itemId}`);
                    items.push({...doc, createdAt: null, updatedAt: null} as Item);
                }
            }
        });

        console.log("Total similar items fetched:", similarItems.length);
        return items;
    } catch (e) {
        console.error("Error fetching similar items:", e);
        throw e;
    }
};

// Function to verify Firebase ID token from request headers
export const verifyToken = async (req: any) => {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("Authorization header is missing or invalid");
        }

        const idToken = authHeader.split(" ")[1];
        console.log("Verifying ID token.");
        return await adminAuth.verifyIdToken(idToken);
    } catch (e) {
        console.log(e)
        throw e;
    }
};

export const sendEmail = async (msg: Message) => {
    try {
        console.log(`Sending email to: ${msg.email}, with subject: ${msg.subject}, and message: ${msg.message}`)
        await admin.firestore().collection('mail').add({
            to: "info@neverbe.lk",
            template: {
                name: "inquiryEmail",
                data: {
                    name: msg.name,
                    email: msg.email,
                    subject: msg.subject,
                    message: msg.message
                }
            }
        });
        console.log("Email sent successfully.");
    } catch (e) {
        console.log(e)
        throw e;
    }
};
// Helper function to capitalize words
const capitalizeWords = (str: string) => {
    return str
        .split(" ")
        .map(word => (word.length === 2 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)))
        .join(" ");
};

export const getBrandsFromInventory = async () => {
    try {
        console.log("Generating brands grouped by types from inventory.");

        const inventorySnapshot = await adminFirestore
            .collection("inventory")
            .where("status", "==", "Active")
            .where("listing", "==", "Active")
            .get();

        const manufacturers: Record<string, Record<string, Set<string>>> = {};

        // Iterate through inventory items
        inventorySnapshot.forEach(doc => {
            const data = doc.data();
            const manufacturer = data.manufacturer?.toLowerCase();
            const brandTitle = data.brand?.toLowerCase();
            const type = data.type?.toLowerCase();

            if (manufacturer) {
                if (!manufacturers[manufacturer]) {
                    manufacturers[manufacturer] = {}; // Initialize manufacturer
                }
                if (type) {
                    if (!manufacturers[manufacturer][type]) {
                        manufacturers[manufacturer][type] = new Set(); // Initialize type group
                    }
                    if (brandTitle) {
                        manufacturers[manufacturer][type].add(brandTitle);
                    }
                    // Add a default "All" title for each type group
                }
            }
        });

        // Map manufacturers and their grouped types to the brands array
        const brandsArray = Object.entries(manufacturers).map(([manufacturer, types]) => ({
            name: capitalizeWords(manufacturer), // Capitalize manufacturer name
            value: manufacturer,
            url: `/shop/products/manufacturers/${manufacturer}`,
            types: Object.entries(types).map(([type, titles]) => ({
                name: capitalizeWords(type), // Capitalize type name (e.g., Shoes)
                url: `/shop/products/manufacturers/${manufacturer}`,
                titles: Array.from(titles)
                    .sort((a, b) => (a === "all" ? 1 : b === "all" ? -1 : a.localeCompare(b))) // Sort, ensuring "all" is last
                    .map(title => ({
                        name: capitalizeWords(title), // Capitalize title
                        url: `/shop/products/manufacturers/${manufacturer}/${title}`,
                    })),
            })),
        }));

        console.log("Brands successfully generated with types:", brandsArray);
        return brandsArray;
    } catch (error) {
        console.error("Error generating brands with types:", error);
        throw error;
    }
};
