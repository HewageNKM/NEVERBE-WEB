import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

// Cloud Function scheduled to run every 2 hours
exports.scheduledFirestoreCleanup = functions.pubsub
  .schedule("every 2 hours")
  .onRun(async (context) => {
    try {
      const orderCollectionRef = db.collection("orders");
      const inventoryCollectionRef = db.collection("inventory");

      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

      // Only process orders that are "Failed" and haven't been restocked
      const failedOrdersSnapshot = await orderCollectionRef
        .where("paymentStatus", "==", "Failed")
        .where("createdAt", "<=", twoHoursAgo)
        .where("restocked", "==", false) // Skip orders already restocked
        .get();

      if (failedOrdersSnapshot.empty) {
        console.log("No failed orders to restock.");
        return null;
      }

      console.log(`Found ${failedOrdersSnapshot.size}
       failed orders to restock.`);

      let batch = db.batch();
      let opCounts = 0;
      const BATCH_LIMIT = 450;

      for (const orderDoc of failedOrdersSnapshot.docs) {
        const orderData = orderDoc.data() as Order;
        const orderItems = orderData.items;

        let inventoryUpdated = false; // Track if inventory was updated

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
              console.warn(`Variant or size not found for ${orderItem.itemId}`);
            }
          } else {
            console.warn(`Document not found for ${orderItem.itemId}`);
          }
        }

        if (inventoryUpdated) {
          // Mark the order as restocked
          batch.update(orderDoc.ref, {restocked: true});
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
      }

      return null;
    } catch (error) {
      console.error("Error during scheduledFirestoreCleanup:", error);
      return null;
    }
  });


interface OrderItem {
    itemId: string,
    variantId: string,
    name: string,
    variantName: string,
    size: string,
    quantity: number,
    price: number,
}

export interface Order {
    orderId: string,
    paymentId: string,
    items: OrderItem[],
    paymentStatus: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface Variant {
    variantId: string,
    variantName: string,
    images: string[],
    sizes: Size[],
}

export interface Item {
    itemId: string,
    type: string,
    brand: string,
    thumbnail: string,
    variants: Variant[],
    manufacturer: string,
    name: string,
    sellingPrice: number,
    discount: number,
    createdAt: { seconds: number, nanoseconds: number },
    updatedAt: { seconds: number, nanoseconds: number },
}

export interface Size {
    size: string,
    stock: number,
}
