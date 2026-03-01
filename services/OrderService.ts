const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1/web";

export const getOrderByIdForInvoice = async (orderId: string) => {
  const res = await fetch(`${API_URL}/orders/${orderId}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || data;
};
