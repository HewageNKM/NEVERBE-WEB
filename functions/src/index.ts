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

      const failedOrdersSnapshot = await orderCollectionRef
        .where("paymentStatus", "==", "Failed")
        .where("createdAt", "<=", twoHoursAgo)
        .get();

      if (failedOrdersSnapshot.empty) {
        console.log("No failed orders found.");
        return null;
      }

      console.log(`Found ${failedOrdersSnapshot.size} failed orders.`);

      let batch = db.batch();
      let opCounts = 0;
      const BATCH_LIMIT = 450;

      for (const orderDoc of failedOrdersSnapshot.docs) {
        const orderData = orderDoc.data() as Order;
        const orderItems = orderData.items;

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
            console.warn(`document not found for ${orderItem.itemId}`);
          }
        }
        // Orders are no longer deleted, only inventory is restocked
      }
      // Commit any remaining operations in the batch
      if (opCounts > 0) {
        await batch.commit();
      }
      return null;
    } catch (error) {
      console.error("Error during scheduledFirestoreCleanup:", error);
      // Optionally, you can implement retry logic or alerting mechanisms here
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
