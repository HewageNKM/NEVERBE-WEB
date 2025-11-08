import { getProducts } from "@/services/ProductService";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);

    // Parse query parameters
    const page = Number(url.searchParams.get("page") || 1);
    const size = Number(url.searchParams.get("size") || 20);
    const tags = url.searchParams.getAll("tag");
    const inStockParam = url.searchParams.get("inStock");

    const inStock =
      inStockParam === "true" ? true : inStockParam === "false" ? false : undefined;

    // Logs for debugging
    console.log("[Products API] Query params:", { page, size, tags, inStock });

    // Fetch products
    const products = await getProducts(tags, inStock, page, size);
    console.log(`[Products API] Fetched products count: ${products?.length || 0}`);

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("[Products API] Error:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
