import { getAllInventoryItems, getAllInventoryItemsByGender, getItemsByField, getItemsByTwoField } from "@/services/ProductService";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const manufacturer = url.searchParams.get('manufacturer');
        const brand = url.searchParams.get('brand');
        const gender = url.searchParams.get('gender') || 'all';
        const page = Number.parseInt(url.searchParams.get('page') || '1');
        const limit = Number.parseInt(url.searchParams.get('limit') || "20")

        if (manufacturer && brand) {
            console.log("Fetching Items for: " + manufacturer + " " + brand)
            const items = await getItemsByTwoField(manufacturer, brand, "manufacturer", "brand",page,limit);
            console.log("Items Fetched: " + items.length)
            return NextResponse.json(items, {status: 200})
        }else if(manufacturer && !brand){
            console.log("Fetching Items for: " + manufacturer)
            const items = await getItemsByField(manufacturer, "manufacturer",page,limit);
            console.log("Items Fetched: " + items.length)
            return NextResponse.json(items, {status: 200})
        }else if(gender !== "all" && (!brand && !manufacturer)){
            console.log(`Fetching Items by ${gender}`)
            const items = await getAllInventoryItemsByGender(gender,page,limit);
            console.log("Items Fetched: " + items.length)
            return NextResponse.json(items, {status: 200})
        }else {
            const items = await getAllInventoryItems(page,limit);
            console.log("Items Fetched: " + items.length)
            return NextResponse.json(items, {status: 200})
        }

    } catch (e: any) {
        console.log("Failed to fetch items: " + e.message)
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}

export const dynamic = 'force-dynamic';

