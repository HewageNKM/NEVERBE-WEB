import { getProductsByBrand } from "@/services/ProductService";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ brand: string }> }
) => {
  try {
    const { brand } = await context.params;
    console.log("[Brand API] Requested brand:", brand);

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || 1);
    const size = Number(url.searchParams.get("size") || 20);
    const tags = url.searchParams.getAll("tag");
    const inStockParam = url.searchParams.get("inStock") === "true";

    console.log("[Brand API] Query params:", {
      page,
      size,
      tags,
      inStock: inStockParam,
    });

    const res = await getProductsByBrand(brand, page, size, tags, inStockParam);
    console.log("[Brand API] Fetched products count:", res?.length || 0);

    return NextResponse.json(res, { status: 200 });
  } catch (error: any) {
    console.error("[Brand API] Error:", error.message, error.stack);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
