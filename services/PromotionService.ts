import axiosInstance from "./axiosInstance";

export const getPaginatedCombos = async (params: any = {}) => {
  try {
    const q = new URLSearchParams(params).toString();
    const res = await axiosInstance.get(`/combos?${q}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch paginated combos:", error);
    return { dataList: [], total: 0 };
  }
};

export const getComboById = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/combos/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch combo ${id}:`, error);
    return null;
  }
};

export const getActivePromotions = async () => {
  try {
    const res = await axiosInstance.get("/promotions/active");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch active promotions:", error);
    return [];
  }
};

export const getActiveCoupons = async () => {
  try {
    const res = await axiosInstance.get("/coupons/active");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch active coupons:", error);
    return [];
  }
};
