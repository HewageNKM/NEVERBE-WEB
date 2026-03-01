const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1/web";

export const getProducts = async (params: any = {}) => {
  try {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/products?${q}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { dataList: [], total: 0 };
    return res.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { dataList: [], total: 0 };
  }
};

export const getRecentItems = async (limit: number = 10) => {
  try {
    const res = await fetch(`${API_URL}/products?sort=new&size=${limit}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.dataList || [];
  } catch (error) {
    console.error("Failed to fetch recent items:", error);
    return [];
  }
};

export const getProductById = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || data;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return null;
  }
};

export const getSimilarItems = async (id: string, limit: number = 4) => {
  try {
    const res = await fetch(`${API_URL}/products/${id}/similar?size=${limit}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.dataList || [];
  } catch (error) {
    console.error(`Failed to fetch similar items for ${id}:`, error);
    return [];
  }
};

export const getNewArrivals = async (limit: number = 10) => {
  try {
    const res = await fetch(`${API_URL}/products?sort=new&size=${limit}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { dataList: [], total: 0 };
    return res.json();
  } catch (error) {
    console.error("Failed to fetch new arrivals:", error);
    return { dataList: [], total: 0 };
  }
};

export const getDealsProducts = async (params: any = {}) => {
  try {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/products/deals?${q}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { dataList: [], total: 0 };
    return res.json();
  } catch (error) {
    console.error("Failed to fetch deals products:", error);
    return { dataList: [], total: 0 };
  }
};

export const getHotProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/products?sort=new`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.dataList || [];
  } catch (error) {
    console.error("Failed to fetch hot products:", error);
    return [];
  }
};

export const getBrandForSitemap = async () => {
  try {
    const res = await fetch(`${API_URL}/brands`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const brands = await res.json();
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
    const res = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const categories = await res.json();
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
    const res = await fetch(`${API_URL}/products?size=200`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const products = data.dataList || [];
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
