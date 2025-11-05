import { verifyCaptchaToken } from "@/services/CapchaService";
import { getProducts } from "@/services/ProductService";
import { NextRequest, NextResponse } from "next/server";

// ✅ GET handler
export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);

    const page = Number(url.searchParams.get("page") || 1);
    const size = Number(url.searchParams.get("size") || 20);
    const tags = url.searchParams.getAll("tag");
    const inStockParam = url.searchParams.get("inStock");

    const inStock =
      inStockParam === "true" ? true : inStockParam === "false" ? false : undefined;

    const products = await getProducts(tags, inStock, page, size);

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/products:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
