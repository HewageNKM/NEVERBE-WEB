import admin, {credential} from 'firebase-admin';
import {Item, Message, Order, PaymentMethod, Review, Slide} from "@/interfaces";
import axios from "axios";

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
export const addNewOrder = async (order: Order, token: string) => {
    try {
        console.log("Adding new order:", order);
        const res = await verifyCaptchaToken(token);
        if (!res) {
            throw new Error("reCAPTCHA verification failed.");
        }

        await adminFirestore.runTransaction(async (transaction) => {
            const inventoryUpdates = [];

            for (const orderItem of order.items) {
                console.log(`Checking inventory for item: ${orderItem.itemId}, variant: ${orderItem.variantId}`);

                const itemRef = adminFirestore.collection('inventory').doc(orderItem.itemId);
                const itemDoc = await transaction.get(itemRef);

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

                // Collect updates for transaction
                inventoryUpdates.push({itemRef, inventoryItem});
            }

            // Update inventory within the transaction
            inventoryUpdates.forEach(({itemRef, inventoryItem}) => {
                transaction.set(itemRef, inventoryItem);
            });

            console.log("Inventory updates queued.");

            // Add the order to the `orders` collection
            const orderRef = adminFirestore.collection('orders').doc(order.orderId);
            transaction.set(orderRef, {
                ...order,
                customer: {
                    ...order.customer,
                    createdAt: admin.firestore.Timestamp.fromDate(new Date(order.customer.createdAt)),
                    updatedAt: admin.firestore.Timestamp.fromDate(new Date(order.customer.updatedAt)),
                },
                createdAt: admin.firestore.Timestamp.fromDate(new Date(order.createdAt)),
                updatedAt: admin.firestore.Timestamp.fromDate(new Date(order.updatedAt)),
            });

            console.log("Order queued for creation.");
        });

        console.log("Order and inventory updates successfully processed.");

        return {
            message: "Order successfully added.",
        }
    } catch (e) {
        console.error("Error adding new order:", e.message);
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
export const getAllInventoryItems = async (page: number, limit: number) => {
    try {
        console.log("Fetching all inventory items.");
        const offSet = (page - 1) * limit;
        const docs = await adminFirestore.collection('inventory').where("status", "==", "Active").where("listing", "==", "Active").offset(offSet).limit(limit).get();
        const items: Item[] = [];
        docs.forEach(doc => {
            items.push({...doc.data(), createdAt: null, updatedAt: null} as Item);
        });
        console.log("Total inventory items fetched:", items.length);
        return items;
    } catch (e) {
        console.log(e)
        throw e;
    }
};

// Function to get all items in inventory
export const getAllInventoryItemsByGender = async (gender: string, page: number, limit: number) => {
    try {
        const offSet = (page - 1) * limit;
        console.log(`Fetching all inventory items by ${gender}`);
        const docs = await adminFirestore.collection('inventory').where("status", "==", "Active").where("listing", "==", "Active").where("genders", "array-contains", gender).offset(offSet).limit(limit).get();
        const items: Item[] = [];
        docs.forEach(doc => {
            items.push({...doc.data(), createdAt: null, updatedAt: null} as Item);
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
    const docs = await adminFirestore.collection('inventory').where("status", '==', "Active").orderBy('createdAt', 'desc').limit(10).get();
    const items: Item[] = [];
    docs.forEach(doc => {
        if (doc.data()?.listing == "Active") {
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
        sliders.push({
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate().toLocaleString(),
        } as Slide);
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
            if (hotProducts.length === 10) {
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
export const getItemsByField = async (name: string, fieldName: string, page: number, limit: number) => {
    try {
        console.log(`Fetching items where ${fieldName} == ${name}`);
        const offSet = (page - 1) * limit;
        const docs = await adminFirestore.collection('inventory').where(fieldName, '==', name).offset(offSet).limit(limit).get();
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

export const getItemsByTwoField = async (firstValue: string, secondValue: string, firstFieldName: string, secondFieldName: string, page: number, limit: number) => {
    try {
        const offSet = (page - 1) * limit;
        console.log(`Fetching items where ${firstFieldName} == ${firstValue} and ${secondFieldName} == ${secondValue}`);
        if (secondValue == "all") {
            console.log(`Fetching items where ${firstFieldName} == ${firstValue}`);
            return getItemsByField(firstValue, firstFieldName, page, limit);
        }
        const docs = await adminFirestore.collection('inventory').where(firstFieldName, '==', firstValue).where(secondFieldName, '==', secondValue).where("listing", "==", "Active").where("status", "==", "Active").offset(offSet).limit(limit).get();
        const items: Item[] = [];
        docs.forEach(doc => {
            console.log(`Item found with ID ${doc.data().itemId}`);
            items.push({...doc.data(), createdAt: null, updatedAt: null} as Item);

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
const verifyCaptchaToken = async (token: string) => {
    try {
        console.log("Sending reCAPTCHA verification request.");
        const secret = process.env.RECAPTCHA_SECRET_KEY;
        const response = await axios({
            method: 'POST',
            url: `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
        });
        console.log("reCAPTCHA verification response:", response.data);
        return response.data.success;
    } catch (e) {
        console.log(e)
        throw e;
    }
}
export const addNewReview = async (review: Review, token: string) => {
    try {
        const res = await verifyCaptchaToken(token);
        if (!res) {
            throw new Error("reCAPTCHA verification failed.");
        }
        console.log("Adding new review:", review.reviewId);
        return await adminFirestore.collection('reviews').doc(review.reviewId).set({
            ...review,
            createdAt: admin.firestore.Timestamp.fromDate(new Date(review.createdAt)),
            updatedAt: admin.firestore.Timestamp.fromDate(new Date(review.updatedAt)),
        });
    } catch (e) {
        console.log(e)
        throw e;
    }
}
export const deleteReviewById = async (reviewId: string) => {
    try {
        console.log(`Deleting review: ${reviewId}`);
        return await adminFirestore.collection('reviews').doc(reviewId).delete();
    } catch (e) {
        console.log(e)
        throw e;
    }
}
export const getReviewByItemId = async (itemId: string, userId: string) => {
    try {
        console.log(`Fetching review by item ID: ${itemId}`);
        const docs = await adminFirestore
            .collection('reviews')
            .where("itemId", "==", itemId)
            .orderBy("createdAt", "desc")
            .limit(10)
            .get();

        if (docs.empty) {
            console.log(`No reviews found where itemId == ${itemId}`);
            return {
                totalRating: 0,
                reviews: [],
                totalReviews: 0,
                isUserReviewed: false,
                userReview: null,
            };
        }

        const totalDocs = await adminFirestore.collection('reviews').where("itemId", "==", itemId).get();
        const totalReviews = totalDocs.size;
        const totalRating = calculateTotalRating(docs.docs.map(doc => doc.data() as Review));

        // Check if the user has reviewed the item
        const isUserReviewed = docs.docs.some(doc => doc.data().userId === userId && doc.data().itemId === itemId);

        // Fetch the user's review separately
        let userReviewSnapshot = await adminFirestore
            .collection('reviews')
            .where("itemId", "==", itemId)
            .where("userId", "==", userId)
            .get();

        let userReview = null;
        if (!userReviewSnapshot.empty) {
            console.log(`User review found where itemId == ${itemId} and userId == ${userId}`);
            const userReviewDoc = userReviewSnapshot.docs[0];
            userReview = {
                ...userReviewDoc.data(),
                createdAt: userReviewDoc.data().createdAt.toDate().toLocaleString(),
                updatedAt: userReviewDoc.data().updatedAt.toDate().toLocaleString(),
            };
        } else {
            console.log(`User review not found where itemId == ${itemId} and userId == ${userId}`);
        }

        // Map the reviews and remove the user's review if present
        const reviews: Review[] = docs.docs
            .map(doc => ({
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate().toLocaleString(),
                updatedAt: doc.data().updatedAt.toDate().toLocaleString(),
            }))
            .filter(review => review?.reviewId !== userReview?.reviewId); // Exclude user's review

        console.log(`Total reviews fetched where itemId == ${itemId}:`, reviews.length);

        return {
            reviews,
            totalReviews,
            isUserReviewed,
            userReview,
            totalRating,
        };
    } catch (e) {
        console.log(e);
        throw e;
    }
};
export const calculateTotalRating = (reviews: Review[]) => {
    try {
        console.log("Calculating total rating from reviews.");
        const number = reviews.reduce((acc, review) => acc + review.rating, 0);
        const total = reviews.length;
        return total > 0 ? number / total : 0;
    } catch (e) {

    }
}
export const sendEmail = async (msg: Message, token: string) => {
    try {
        console.log(`Sending email to: ${msg.email}, with subject: ${msg.subject}, and message: ${msg.message}`)
        const res = await verifyCaptchaToken(token);
        if (!res) {
            throw new Error("reCAPTCHA verification failed.");
        }
        console.log("reCAPTCHA verification result:", res);
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
        console.log("Generating brands from inventory.");

        const inventorySnapshot = await adminFirestore
            .collection("inventory")
            .where("status", "==", "Active")
            .where("listing", "==", "Active")
            .get();

        const manufacturers: Record<string, Set<string>> = {};

        // Iterate through inventory items
        inventorySnapshot.forEach(doc => {
            const data = doc.data();
            const manufacturer = data.manufacturer?.toLowerCase();
            const brandTitle = data.brand?.toLowerCase();

            if (manufacturer && brandTitle) {
                if (!manufacturers[manufacturer]) {
                    manufacturers[manufacturer] = new Set(); // Initialize manufacturer
                }
                manufacturers[manufacturer].add(brandTitle); // Add brand title to manufacturer
            }
        });

        // Map manufacturers and their brand titles to the brands array
        const brandsArray = Object.entries(manufacturers).map(([manufacturer, titles]) => ({
            name: capitalizeWords(manufacturer), // Capitalize manufacturer name
            value: manufacturer,
            url: `/collections/${manufacturer}`,
            brands: Array.from(titles)
                .sort()
                .map(title => ({
                    name: capitalizeWords(title), // Capitalize brand title
                    url: `/collections/${manufacturer}/${title}`,
                })),
        }));

        console.log("Brands successfully generated");
        return brandsArray;
    } catch (error) {
        console.error("Error generating brands:", error);
        throw error;
    }
};

export const getPaymentMethods = async () => {
    try {
        console.log("Fetching payment methods.");
        const snapshot = await adminFirestore.collection('paymentMethods').where("status","==","Active").where("available","array-contains","Website").get();
        const methods = snapshot.docs.map(doc => {
            return {
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate().toLocaleString(),
                updatedAt: doc.data().updatedAt.toDate().toLocaleString(),
            } as PaymentMethod
        });
        console.log("Payment methods fetched successfully.");
        return methods;
    } catch (e) {
        console.error("Error fetching payment methods:", e);
        throw e;
    }
}

