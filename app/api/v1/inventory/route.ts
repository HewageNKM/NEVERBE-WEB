import { getProductStock } from "@/services/ProductService";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");
    const variantId = url.searchParams.get("variantId");
    const size = url.searchParams.get("size");

    if (!productId || !variantId || !size)
      return NextResponse.json(
        { message: "Missing parameters" },
        { status: 400 }
      );

    const qty = await getProductStock(productId, variantId, size);
    return NextResponse.json(qty);
  } catch (e: any) {
    console.log("Failed to fetch items: " + e.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
