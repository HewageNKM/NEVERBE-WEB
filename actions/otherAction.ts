import axiosInstance from "./axiosInstance";

export const getBrands = async () => {
  try {
    // Try the generic brands endpoint first as it's more likely to have logo URLs
    let res = await axiosInstance.get("/web/brands");
    let data = res.data;

    // Fallback if main endpoint is empty or missing data
    if (!data.data || (Array.isArray(data.data) && data.data.length === 0)) {
      res = await axiosInstance.get("/web/brands/dropdown");
      data = res.data;
    }

    const brandsArray =
      data.data || data.brands || (Array.isArray(data) ? data : []);

    return brandsArray;
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
};
