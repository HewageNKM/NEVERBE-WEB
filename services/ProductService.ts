import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Item, PaymentMethod } from "@/interfaces";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const getProducts = async (
  tags?: string[],
  inStock?: boolean,
  page: number = 1,
  size: number = 20
): Promise<Product[]> => {
  try {
    let query: FirebaseFirestore.Query = adminFirestore
      .collection("products")
      .where("isDeleted", "==", false)
      .where("status", "==", true)
      .where("listing", "==", true);

    // 🔹 Calculate offset
    const offset = (page - 1) * size;

    // 🔹 Filter by tags
    if (tags && tags.length > 0) {
      query = query.where("tags", "array-contains-any", tags);
    }

    // 🔹 Filter by stock availability
    if (typeof inStock === "boolean") {
      query = query.where("inStock", "==", inStock);
    }

    // 🔹 Apply offset and limit
    query = query.offset(offset).limit(size);

    // 🔹 Fetch documents
    const snapshot = await query.get();

    // 🔹 Transform & filter variants
    const products: Product[] = snapshot.docs
      .map((doc) => {
        const product = {
          ...(doc.data() as Product),
          createdAt: null,
          updatedAt: null,
        };

        const filteredVariants = (product.variants || []).filter(
          (variant: ProductVariant) =>
            variant.status === true && variant.isDeleted === false
        );

        return {
          ...(product as Product),
          variants: filteredVariants,
        };
      })
      .filter((p) => (p.variants?.length ?? 0) > 0);

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getRecentItems = async () => {
  console.log("Fetching recent inventory items.");
  const docs = await adminFirestore
    .collection("products")
    .where("status", "==", true)
    .where("isDeleted", "==", false)
    .where("listing", "==", true)
    .limit(10)
    .get();
  console.log("Total recent items fetched:", docs.size);

  const items: Product[] = [];
  docs.forEach((doc) => {
    items.push({ ...doc.data(), createdAt: null, updatedAt: null });
  });
  console.log("Total recent items fetched:", items.length);
  return items;
};

export const getHotProducts = async () => {
  try {
    console.log("Calculating hot products based on order counts.");
    const ordersSnapshot = await adminFirestore
      .collection("orders")
      .limit(100)
      .get();
    const itemCount: Record<string, number> = {};

    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          if (item?.itemId) {
            itemCount[item.itemId] = (itemCount[item.itemId] || 0) + 1;
          }
        });
      } else {
        console.warn(`Order ${doc.id} has no valid items array`);
      }
    });

    const sortedItems = Object.entries(itemCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map((entry) => entry[0]);

    const hotProducts: Item[] = [];
    for (const itemId of sortedItems) {
      const itemDoc = await adminFirestore
        .collection("products")
        .where("status", "==", true)
        .where("isDeleted", "==", false)
        .where("listing", "==", true)
        .where("id", "==", itemId)
        .get();
      if (!itemDoc.empty) {
        const item = itemDoc.docs[0].data() as Item;
        hotProducts.push({ ...item, createdAt: null, updatedAt: null });
      }
      if (hotProducts.length === 10) {
        break;
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
export const getProductById = async (itemId: string) => {
  try {
    console.log(`Fetching item by ID: ${itemId}`);
    const itemDoc = await adminFirestore
      .collection("products")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .where("listing", "==", true)
      .where("id", "==", itemId)
      .get();
    const docData = itemDoc.docs[0].data();
    return {
      ...docData,
      variants: docData.variants.filter(
        (variant: ProductVariant) =>
          variant.status === true && variant.isDeleted === false
      ),
      createdAt: null,
      updatedAt: null,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getProductsByCategory = async (
  category: string,
  page: number = 1,
  size: number = 10,
  tags?: string[],
  inStock?: boolean
) => {
  try {
    console.log(`Fetching products by category: ${category}`);
    const offset = (page - 1) * size;
    const query = adminFirestore
      .collection("products")
      .where("category", "==", capitalizeWords(category))
      .where("isDeleted", "==", false)
      .where("status", "==", true)
      .where("listing", "==", true);

    if (tags && tags.length > 0) {
      query.where("tags", "array-contains-any", tags);
    }

    if (typeof inStock === "boolean") {
      query.where("inStock", "==", inStock);
    }

    query.offset(offset).limit(size);

    const total = (await query.get()).size;

    const snapshot = await query.get();

    const products: Product[] = snapshot.docs
      .map((doc) => {
        const product = doc.data() as Product;
        return {
          ...(product as Product),
          createdAt: null,
          updatedAt: null,
        };
      })
      .filter((p) => (p.variants?.length ?? 0) > 0);

    console.log("Total products fetched:", products.length);
    return {
      total: total,
      dataList: products,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getProductsByBrand = async (
  brand: string,
  page: number = 1,
  size: number = 10,
  categories?: string[],
  inStock?: boolean
) => {
  try {
    console.log(`Fetching products by brand: ${brand}`);
    const offset = (page - 1) * size;
    const capitalizeBrand = capitalizeWords(brand.trim());

    let query: FirebaseFirestore.Query = adminFirestore
      .collection("products")
      .where("brand", "==", capitalizeBrand)
      .where("isDeleted", "==", false)
      .where("status", "==", true)
      .where("listing", "==", true);

    // Optional: filter by categories
    if (categories && categories.length > 0) {
      query = query.where("tags", "array-contains-any", categories);
    }

    // Optional: filter by stock
    if (inStock === true && typeof inStock === "boolean") {
      query = query.where("inStock", "==", inStock);
    }

    const total = (await query.get()).size;

    const snapshot = await query.offset(offset).limit(size).get();

    const products: Product[] = snapshot.docs
      .map((doc) => {
        const product = doc.data() as Product;

        // Keep only variants where status == true and isDeleted == false
        const filteredVariants = (product.variants || []).filter(
          (variant: ProductVariant) =>
            variant.status === true && variant.isDeleted === false
        );

        return {
          ...(product as Product),
          createdAt: null,
          updatedAt: null,
          variants: filteredVariants,
        };
      })
      .filter((p) => (p.variants?.length ?? 0) > 0);

    return {
      total: total,
      dataList: products,
    };
  } catch (error) {
    console.error("Error fetching products by brand:", error);
    throw error;
  }
};

export const getProductStock = async (
  productId: string,
  variantId: string,
  size: string
) => {
  try {
    const settingsSnap = await adminFirestore
      .collection("app_settings")
      .doc("erp_settings")
      .get();

    const stockId = settingsSnap.data()?.onlineStockId;
    if (!stockId) throw new Error("onlineStockId not found in ERP settings");

    const stockSnap = await adminFirestore
      .collection("stock_inventory")
      .where("productId", "==", productId)
      .where("variantId", "==", variantId)
      .where("stockId", "==", stockId)
      .where("size", "==", size)
      .limit(1)
      .get();

    if (stockSnap.empty) {
      return 0;
    }

    const stockDoc = stockSnap.docs[0];
    const stockData = stockDoc.data();

    return stockData.quantity;
  } catch (e) {
    console.error("Error getting product stock:", e);
    throw e;
  }
};

export const getSimilarItems = async (itemId: string) => {
  try {
    console.log(`Fetching similar items for item ID: ${itemId}`);

    const itemDoc = await adminFirestore
      .collection("products")
      .doc(itemId)
      .get();
    if (!itemDoc.exists) {
      throw new Error(`Item with ID ${itemId} not found.`);
    }

    const item = itemDoc.data() as Product;

    const similarItemsQuery = await adminFirestore
      .collection("products")
      .where("tags", "array-contains-any", [item.category.toLocaleLowerCase()])
      .where("isDeleted", "==", false)
      .where("status", "==", true)
      .where("listing", "==", true)
      .limit(10)
      .get();
    const items: Product[] = [];

    const similarItems = similarItemsQuery.docs
      .filter((doc) => doc.id !== itemId)
      .map((doc) => {
        return {
          ...doc.data(),
          itemId: doc.id,
          createdAt: null,
          updatedAt: null,
        };
      });

    console.log("Total similar items fetched:", items.length);
    return similarItems;
  } catch (e) {
    console.error("Error fetching similar items:", e);
    throw e;
  }
};

export const getProductsForSitemap = async () => {
  try {
    console.log("Fetching products for sitemap.");
    const snapshot = await adminFirestore
      .collection("products")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .where("listing", "==", true)
      .get();
    const products = snapshot.docs.map((doc) => {
      return {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/collections/products/${
          doc.data().id
        }`,
        lastModified: new Date(),
        priority: 0.7,
      };
    });
    console.log("Total products fetched for sitemap:", products.length);
    return products;
  } catch (e) {
    console.error("Error fetching products for sitemap:", e);
    throw e;
  }
};

export const getBrandForSitemap = async () => {
  try {
    console.log("Fetching brands for sitemap.");
    const snapshot = await adminFirestore
      .collection("brands")
      .where("status", "==", true)
      .where("isDeleted", "==", false)
      .where("listing", "==", true)
      .get();
    const brands = snapshot.docs.map((doc) => {
      return {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/collections/brands/${
          doc.data().name
        }`,
        lastModified: new Date(),
        priority: 0.8,
      };
    });
    console.log("Total brands fetched for sitemap:", brands.length);
    return brands;
  } catch (e) {
    console.error("Error fetching brands for sitemap:", e);
    throw e;
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
