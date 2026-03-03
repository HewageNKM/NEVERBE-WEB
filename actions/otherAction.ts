import axiosInstance from "./axiosInstance";

export const getBrands = async () => {
  try {
    const res = await axiosInstance.get("/web/brands/dropdown");
    const data = res.data;
    // Map dropdown format to full array if needed, assuming the API returns array
    return data.data || data;
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
};
