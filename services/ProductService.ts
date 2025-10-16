import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Item, PaymentMethod } from "@/interfaces";

// Helper function to capitalize words
const capitalizeWords = (str: string) => {
  return str
    .split(" ")
    .map((word) =>
      word.length === 2
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

// Function to get all items in inventory
export const getAllInventoryItems = async (page: number, limit: number) => {
  try {
    console.log("Fetching all inventory items.");
    const offSet = (page - 1) * limit;
    const docs = await adminFirestore
      .collection("inventory")
      .where("status", "==", "Active")
      .where("listing", "==", "Active")
      .offset(offSet)
      .limit(limit)
      .get();
    const items: Item[] = [];
    docs.forEach((doc) => {
      items.push({ ...doc.data(), createdAt: null, updatedAt: null } as Item);
    });
    console.log("Total inventory items fetched:", items.length);
    return items;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// Function to get all items in inventory
export const getAllInventoryItemsByGender = async (
  gender: string,
  page: number,
  limit: number
) => {
  try {
    const offSet = (page - 1) * limit;
    console.log(`Fetching all inventory items by ${gender}`);
    const docs = await adminFirestore
      .collection("inventory")
      .where("status", "==", "Active")
      .where("listing", "==", "Active")
      .where("genders", "array-contains", gender)
      .offset(offSet)
      .limit(limit)
      .get();
    const items: Item[] = [];
    docs.forEach((doc) => {
      items.push({ ...doc.data(), createdAt: null, updatedAt: null } as Item);
    });
    console.log("Total inventory items fetched:", items.length);
    return items;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// Function to fetch recent inventory items based on creation date
export const getRecentItems = async () => {
  console.log("Fetching recent inventory items.");
  const docs = await adminFirestore
    .collection("inventory")
    .where("status", "==", "Active")
    .orderBy("createdAt", "desc")
    .limit(10)
    .get();
  const items: Item[] = [];
  docs.forEach((doc) => {
    if (doc.data()?.listing == "Active") {
      items.push({ ...doc.data(), createdAt: null, updatedAt: null } as Item);
    }
  });
  console.log("Total recent items fetched:", items.length);
  return items;
};

// Function to get hot products based on order count
export const getHotProducts = async () => {
  try {
    console.log("Calculating hot products based on order counts.");
    const ordersSnapshot = await adminFirestore.collection("orders").get();
    const itemCount: Record<string, number> = {};

    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      order.items.forEach((item) => {
        itemCount[item.itemId] = (itemCount[item.itemId] || 0) + 1;
      });
    });

    const sortedItems = Object.entries(itemCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map((entry) => entry[0]);

    const hotProducts: Item[] = [];
    for (const itemId of sortedItems) {
      const itemDoc = await adminFirestore
        .collection("inventory")
        .doc(itemId)
        .get();
      if (itemDoc.exists) {
        if (itemDoc.data()?.status === "Active") {
          if (itemDoc.data()?.listing === "Active") {
            console.log(`Item found with ID ${itemDoc.data()?.itemId}`);
            hotProducts.push({
              ...itemDoc.data(),
              createdAt: null,
              updatedAt: null,
            } as Item);
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
    const itemDoc = await adminFirestore
      .collection("inventory")
      .doc(itemId)
      .get();
    if (itemDoc.exists) {
      if (itemDoc.data()?.status == "Active") {
        if (itemDoc.data()?.listing == "Active") {
          console.log(`Item found with ID ${itemId}`);
          return {
            ...itemDoc.data(),
            createdAt: null,
            updatedAt: null,
          };
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
    console.log(e);
    throw e;
  }
};

// Functions for querying items by custom fields
export const getItemsByField = async (
  name: string,
  fieldName: string,
  page: number,
  limit: number
) => {
  try {
    console.log(`Fetching items where ${fieldName} == ${name}`);
    const offSet = (page - 1) * limit;
    const docs = await adminFirestore
      .collection("inventory")
      .where(fieldName, "==", name)
      .offset(offSet)
      .limit(limit)
      .get();
    const items: Item[] = [];
    docs.forEach((doc) => {
      if (doc.data()?.status == "Active") {
        if (doc.data()?.listing == "Active") {
          console.log(`Item found with ID ${doc.data().itemId}`);
          items.push({
            ...doc.data(),
            createdAt: null,
            updatedAt: null,
          } as Item);
        }
      }
    });
    console.log(
      `Total items fetched where ${fieldName} == ${name}:`,
      items.length
    );
    return items;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getItemsByTwoField = async (
  firstValue: string,
  secondValue: string,
  firstFieldName: string,
  secondFieldName: string,
  page: number,
  limit: number
) => {
  try {
    const offSet = (page - 1) * limit;
    console.log(
      `Fetching items where ${firstFieldName} == ${firstValue} and ${secondFieldName} == ${secondValue}`
    );
    if (secondValue == "all") {
      console.log(`Fetching items where ${firstFieldName} == ${firstValue}`);
      return getItemsByField(firstValue, firstFieldName, page, limit);
    }
    const docs = await adminFirestore
      .collection("inventory")
      .where(firstFieldName, "==", firstValue)
      .where(secondFieldName, "==", secondValue)
      .where("listing", "==", "Active")
      .where("status", "==", "Active")
      .offset(offSet)
      .limit(limit)
      .get();
    const items: Item[] = [];
    docs.forEach((doc) => {
      console.log(`Item found with ID ${doc.data().itemId}`);
      items.push({ ...doc.data(), createdAt: null, updatedAt: null } as Item);
    });
    console.log(
      `Total items fetched where ${firstFieldName} == ${firstValue} and ${secondFieldName} == ${secondValue}:`,
      items.length
    );
    return items;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
export const getSimilarItems = async (itemId: string) => {
  try {
    console.log(`Fetching similar items for item ID: ${itemId}`);

    // Fetch the item document by ID
    const itemDoc = await adminFirestore
      .collection("inventory")
      .doc(itemId)
      .get();
    if (!itemDoc.exists) {
      throw new Error(`Item with ID ${itemId} not found.`);
    }

    const item = itemDoc.data() as Item;

    // Fetch items with matching type and brand
    const similarItemsQuery = await adminFirestore
      .collection("inventory")
      .where("type", "==", item.type)
      .where("brand", "==", item.brand)
      .limit(10)
      .get();
    const items: Item[] = [];
    // Process and filter the results
    const similarItems = similarItemsQuery.docs
      .filter((doc) => doc.id !== itemId) // Exclude the original item
      .map((doc) => {
        return {
          ...doc.data(),
          itemId: doc.id,
          createdAt: null,
          updatedAt: null,
        } as Item;
      });

    similarItems.forEach((doc) => {
      if (doc.status == "Active") {
        if (doc.listing == "Active") {
          console.log(`Item found with ID ${doc.itemId}`);
          items.push({ ...doc, createdAt: null, updatedAt: null } as Item);
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
    inventorySnapshot.forEach((doc) => {
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
    const brandsArray = Object.entries(manufacturers).map(
      ([manufacturer, titles]) => ({
        name: capitalizeWords(manufacturer), // Capitalize manufacturer name
        value: manufacturer,
        url: `/collections/${manufacturer}`,
        brands: Array.from(titles)
          .sort()
          .map((title) => ({
            name: capitalizeWords(title), // Capitalize brand title
            url: `/collections/${manufacturer}/${title}`,
          })),
      })
    );

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
    const snapshot = await adminFirestore
      .collection("paymentMethods")
      .where("status", "==", "Active")
      .where("available", "array-contains", "Website")
      .get();
    const methods = snapshot.docs.map((doc) => {
      return {
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate().toLocaleString(),
        updatedAt: doc.data().updatedAt.toDate().toLocaleString(),
      } as PaymentMethod;
    });
    console.log("Payment methods fetched successfully.");
    return methods;
  } catch (e) {
    console.error("Error fetching payment methods:", e);
    throw e;
  }
};
