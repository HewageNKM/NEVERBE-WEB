import { getProductsByBrand } from "@/services/ProductService";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { brand: string } }
) => {
  try {
    const brand = params.brand;

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || 1);
    const size = Number(url.searchParams.get("size") || 20);
    const tags = url.searchParams.getAll("tag");
    const inStockParam = url.searchParams.get("inStock") == "true";

    const res = await getProductsByBrand(brand, page, size, tags, inStockParam);
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.log(error);
    throw NextResponse.json({ message: error.message }, { status: 500 });
  }
};
