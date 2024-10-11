import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

// Interfaces
interface OrderItem {
    itemId: string;
    variantId: string;
    name: string;
    variantName: string;
    size: string;
    quantity: number;
    price: number;
}

export interface Order {
    orderId: string;
    paymentId: string;
    items: OrderItem[];
    paymentStatus: string;
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
    paymentMethod: string;
    restocked: boolean;
}

export interface Variant {
    variantId: string;
    variantName: string;
    images: string[];
    sizes: Size[];
}

export interface Item {
    itemId: string;
    type: string;
    brand: string;
    thumbnail: string;
    variants: Variant[];
    manufacturer: string;
    name: string;
    sellingPrice: number;
    discount: number;
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
}

export interface Size {
    size: string;
    stock: number;
}

// Cloud Function scheduled to run every hour
exports.scheduledFirestoreCleanup = functions.pubsub
  .schedule("every 1 hours")
  .onRun(async (context) => {
    try {
      const orderCollectionRef = db.collection("orders");
      const inventoryCollectionRef = db.collection("inventory");

      const twoHoursAgo = admin.firestore.Timestamp
        .fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000));

      // Fetch PayHere failed and pending orders
      const payhereFailedOrdersQuery = orderCollectionRef
        .where("paymentMethod", "==", "PayHere")
        .where("restocked", "==", false)
        .where("createdAt", "<=", twoHoursAgo)
        .where("paymentStatus", "in", ["Failed", "Pending"]);

      // Fetch COD failed orders
      const codFailedOrdersQuery = orderCollectionRef
        .where("paymentMethod", "==", "COD")
        .where("restocked", "==", false)
        .where("createdAt", "<=", twoHoursAgo)
        .where("paymentStatus", "==", "Failed");

      // Execute both queries in parallel
      const [payhereFailedOrders, codFailedOrders] = await Promise.all([
        payhereFailedOrdersQuery.get(),
        codFailedOrdersQuery.get(),
      ]);

      // Combine both query results
      const allFailedOrders =
          [...payhereFailedOrders.docs, ...codFailedOrders.docs];

      if (allFailedOrders.length === 0) {
        console.log("No failed orders to restock.");
        return null;
      }

      console.log(`Found ${allFailedOrders.length} failed orders to restock.`);

      let batch = db.batch();
      let opCounts = 0;
      const BATCH_LIMIT = 450;

      for (const orderDoc of allFailedOrders) {
        const orderData = orderDoc.data() as Order;
        const orderItems = orderData.items;

        let inventoryUpdated = false; // Track if inventory was updated
        let paymentStatusToUpdate: string | null = null;

        for (const orderItem of orderItems) {
          const inventoryDocRef = inventoryCollectionRef.doc(orderItem.itemId);
          const inventoryDoc = await inventoryDocRef.get();

          if (inventoryDoc.exists) {
            const inventoryData = inventoryDoc.data() as Item;

            let variantFound = false;
            inventoryData.variants.forEach((variant) => {
              if (variant.variantId === orderItem.variantId) {
                variant.sizes.forEach((size) => {
                  if (size.size === orderItem.size) {
                    size.stock += orderItem.quantity;
                    variantFound = true;
                    inventoryUpdated = true;
                  }
                });
              }
            });

            if (variantFound) {
              batch.set(inventoryDocRef, inventoryData);
              opCounts += 1;

              if (opCounts >= BATCH_LIMIT) {
                // Commit the current batch and start a new one
                await batch.commit();
                console.log(`Committed a batch of ${opCounts} operations.`);
                batch = db.batch();
                opCounts = 0;
              }
            } else {
              console.warn(`Variant or size not found for
               itemId: ${orderItem.itemId}, variantId: 
               ${orderItem.variantId}, size: ${orderItem.size}`);
            }
          } else {
            console.warn(`Inventory document not
             found for itemId: ${orderItem.itemId}`);
          }
        }

        if (inventoryUpdated) {
          // For PayHere orders with 'Pending' status, update to 'Failed'
          if (orderData.paymentMethod === "PayHere" &&
              orderData.paymentStatus === "Pending") {
            paymentStatusToUpdate = "Failed";
          }

          // Prepare the update data
          const updateData: Partial<Order> = {restocked: true};
          if (paymentStatusToUpdate) {
            updateData.paymentStatus = paymentStatusToUpdate;
          }

          batch.update(orderDoc.ref, updateData);
          opCounts += 1;

          if (opCounts >= BATCH_LIMIT) {
            // Commit the current batch and start a new one
            await batch.commit();
            console.log(`Committed a batch of ${opCounts} operations.`);
            batch = db.batch();
            opCounts = 0;
          }
        }
      }

      // Commit any remaining operations in the batch
      if (opCounts > 0) {
        await batch.commit();
        console.log(`Committed the final batch of ${opCounts} operations.`);
      }

      console.log("Scheduled Firestore cleanup completed successfully.");
      return null;
    } catch (error) {
      console.error("Error during scheduledFirestoreCleanup:", error);
      return null;
    }
  });
