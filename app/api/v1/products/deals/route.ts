import { getDealsProducts } from "@/services/ProductService";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);

    const page = Number(url.searchParams.get("page") || 1);
    const size = Number(url.searchParams.get("size") || 20);
    const tags = url.searchParams.getAll("tag");
    const inStockParam = url.searchParams.get("inStock");

    const inStock =
      inStockParam === "true" ? true : inStockParam === "false" ? false : undefined;

    const products = await getDealsProducts(page, size, tags, inStock);

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/products:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
