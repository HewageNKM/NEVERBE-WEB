const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1/web";

export const getPaginatedCombos = async (params: any = {}) => {
  try {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/combos?${q}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { dataList: [], total: 0 };
    return res.json();
  } catch (error) {
    console.error("Failed to fetch paginated combos:", error);
    return { dataList: [], total: 0 };
  }
};

export const getComboById = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/combos/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || data;
  } catch (error) {
    console.error(`Failed to fetch combo ${id}:`, error);
    return null;
  }
};

export const getActivePromotions = async () => {
  try {
    const res = await fetch(`${API_URL}/promotions/active`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error("Failed to fetch active promotions:", error);
    return [];
  }
};

export const getActiveCoupons = async () => {
  try {
    const res = await fetch(`${API_URL}/coupons/active`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error("Failed to fetch active coupons:", error);
    return [];
  }
};
