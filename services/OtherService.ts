const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1/web";

export const getBrands = async () => {
  const res = await fetch(`${API_URL}/brands/dropdown`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = await res.json();
  // Map dropdown format to full array if needed, assuming the API returns array
  return data.data || data;
};
