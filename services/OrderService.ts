import axiosInstance from "./axiosInstance";

export const getOrderByIdForInvoice = async (orderId: string) => {
  try {
    const res = await axiosInstance.get(`/orders/${orderId}`);
    const data = res.data;
    return data.data || data;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    return null;
  }
};
