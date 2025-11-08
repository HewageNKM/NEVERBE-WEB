import { getProductsByCategory } from "@/services/ProductService";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ category: string }> }
) => {
  try {
    const { category } = await context.params;
    console.log("[Category API] Requested category:", category);

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || 1);
    const size = Number(url.searchParams.get("size") || 20);
    const tags = url.searchParams.getAll("tag");
    const inStockParam = url.searchParams.get("inStock");

    const inStock =
      inStockParam === "true"
        ? true
        : inStockParam === "false"
        ? false
        : undefined;

    console.log("[Category API] Query params:", {
      page,
      size,
      tags,
      inStock,
    });

    const products = await getProductsByCategory(
      category,
      page,
      size,
      tags,
      inStock
    );

    console.log(
      `[Category API] Fetched products for category "${category}":`,
      products?.length || 0
    );

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("[Category API] Error:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
