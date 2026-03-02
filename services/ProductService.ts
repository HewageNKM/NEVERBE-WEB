import axiosInstance from "./axiosInstance";

export const getProducts = async (params: any = {}) => {
  try {
    const q = new URLSearchParams(params).toString();
    const res = await axiosInstance.get(`/products?${q}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { dataList: [], total: 0 };
  }
};

export const getRecentItems = async (limit: number = 10) => {
  try {
    const res = await axiosInstance.get(`/products?sort=new&size=${limit}`);
    return res.data.dataList || [];
  } catch (error) {
    console.error("Failed to fetch recent items:", error);
    return [];
  }
};

export const getProductById = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/products/${id}`);
    const data = res.data;
    return data.data || data;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return null;
  }
};

export const getSimilarItems = async (id: string, limit: number = 4) => {
  try {
    const res = await axiosInstance.get(
      `/products/${id}/similar?size=${limit}`,
    );
    return res.data.dataList || [];
  } catch (error) {
    console.error(`Failed to fetch similar items for ${id}:`, error);
    return [];
  }
};

export const getNewArrivals = async (limit: number = 10) => {
  try {
    const res = await axiosInstance.get(`/products?sort=new&size=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch new arrivals:", error);
    return { dataList: [], total: 0 };
  }
};

export const getDealsProducts = async (params: any = {}) => {
  try {
    const q = new URLSearchParams(params).toString();
    const res = await axiosInstance.get(`/products/deals?${q}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch deals products:", error);
    return { dataList: [], total: 0 };
  }
};

export const getHotProducts = async () => {
  try {
    const res = await axiosInstance.get("/products?sort=new");
    return res.data.dataList || [];
  } catch (error) {
    console.error("Failed to fetch hot products:", error);
    return [];
  }
};

export const getBrandForSitemap = async () => {
  try {
    const res = await axiosInstance.get("/brands");
    const brands = res.data;
    return brands.map((b: any) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/collections/products?brand=${b.name}`,
      priority: 0.6,
      lastModified: new Date(),
      changeFrequency: "weekly",
    }));
  } catch (error) {
    console.error("Failed to fetch brands for sitemap:", error);
    return [];
  }
};

export const getCategoriesForSitemap = async () => {
  try {
    const res = await axiosInstance.get("/categories");
    const categories = res.data;
    return categories.map((c: any) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/collections/products?category=${c.name}`,
      priority: 0.7,
      lastModified: new Date(),
      changeFrequency: "weekly",
    }));
  } catch (error) {
    console.error("Failed to fetch categories for sitemap:", error);
    return [];
  }
};

export const getProductsForSitemap = async () => {
  try {
    const res = await axiosInstance.get("/products?size=200");
    const products = res.data.dataList || [];
    return products.map((p: any) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/collections/products/${p.id}`,
      priority: 0.8,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "daily",
    }));
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
    return [];
  }
};
