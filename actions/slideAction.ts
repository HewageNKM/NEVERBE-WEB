import axiosInstance from "./axiosInstance";

/**
 * SlideService - Thin wrapper over API
 * Delegates data access to API server
 */

export const getSliders = async () => {
  try {
    const res = await axiosInstance.get("/web/sliders");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch sliders:", error);
    return [];
  }
};
