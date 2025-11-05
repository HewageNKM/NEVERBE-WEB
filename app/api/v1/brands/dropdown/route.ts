import { verifyCaptchaToken } from "@/services/CapchaService";
import { getBrandsForDropdown } from "@/services/OtherService";
import { getBrandsFromInventory } from "@/services/ProductService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const brands = await getBrandsForDropdown();
    console.log("Brands Fetched: " + brands.length);

    return NextResponse.json(brands, { status: 200 });
  } catch (e: any) {
    console.log("Failed to fetch brands: " + e.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
