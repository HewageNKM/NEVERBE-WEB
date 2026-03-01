const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1/web";

export const getPaginatedCombos = async (params: any = {}) => {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/combos?${q}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return { dataList: [], total: 0 };
  return res.json();
};

export const getComboById = async (id: string) => {
  const res = await fetch(`${API_URL}/combos/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || data;
};

export const getActivePromotions = async () => {
  const res = await fetch(`${API_URL}/promotions/active`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data || [];
};

export const getActiveCoupons = async () => {
  const res = await fetch(`${API_URL}/coupons/active`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data || [];
};
