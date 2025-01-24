import {NextResponse} from "next/server";
import {getBrandsFromInventory, verifyToken} from "@/firebase/firebaseAdmin";

export async function GET(req: Request) {
    try {
        const brands = await getBrandsFromInventory();
        console.log("Brands Fetched: " + brands.length)

        return NextResponse.json(brands, {status: 200})
    } catch (e: any) {
        console.log("Failed to fetch brands: " + e.message)
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}

export const dynamic = 'force-dynamic';

