import { getDealsProducts } from "@/services/ProductService";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);

    // Parse query parameters
    const page = Number(url.searchParams.get("page") || 1);
    const size = Number(url.searchParams.get("size") || 20);
    const tags = url.searchParams.getAll("tag");
    const inStockParam = url.searchParams.get("inStock");
    const sizesParam = url.searchParams.get("sizes"); // Comma-separated sizes
    const genderParam = url.searchParams.get("gender");

    const inStock =
      inStockParam === "true"
        ? true
        : inStockParam === "false"
        ? false
        : undefined;

    const sizesFilter = sizesParam ? sizesParam.split(",").filter(Boolean) : [];
    const genderFilter = genderParam?.toLowerCase() || "";

    console.log("[Deals API] Query params:", {
      page,
      size,
      tags,
      inStock,
      sizesFilter,
      genderFilter,
    });

    // Fetch deals
    let result = await getDealsProducts(page, size, tags, inStock);

    // Post-fetch gender filtering
    if (genderFilter && result.dataList) {
      result.dataList = result.dataList.filter((product: any) => {
        return (product.gender || []).some(
          (g: string) => g.toLowerCase() === genderFilter
        );
      });
      result.total = result.dataList.length;
    }

    // Post-fetch size filtering
    if (sizesFilter.length > 0 && result.dataList) {
      result.dataList = result.dataList.filter((product: any) => {
        const productSizes = new Set<string>();
        // Check variants
        (product.variants || []).forEach((v: any) => {
          (v.sizes || []).forEach((s: string) => productSizes.add(s));
        });
        // Check top-level availableSizes
        (product.availableSizes || []).forEach((s: string) =>
          productSizes.add(s)
        );

        return sizesFilter.some((s) => productSizes.has(s));
      });
      result.total = result.dataList.length;
    }

    console.log(
      `[Deals API] Fetched deals count: ${result.dataList?.length || 0}`
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("[Deals API] Error:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
