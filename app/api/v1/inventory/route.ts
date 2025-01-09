import {NextResponse} from "next/server";
import {getAllInventoryItems, getItemsByField, getItemsByTwoField, verifyToken} from "@/firebase/firebaseAdmin";

export async function GET(req: Request) {
    try {
        const idToken = await verifyToken(req);
        console.log("Token Verified: " + idToken.uid)

        const url = new URL(req.url);
        const manufacturer = url.searchParams.get('manufacturer');
        const brand = url.searchParams.get('brand');

        if (manufacturer && brand) {
            console.log("Fetching Items for: " + manufacturer + " " + brand)
            const items = await getItemsByTwoField(manufacturer, brand, "manufacturer", "brand");
            console.log("Items Fetched: " + items.length)
            return NextResponse.json(items, {status: 200})
        }else if(manufacturer && !brand){
            console.log("Fetching Items for: " + manufacturer)
            const items = await getItemsByField(manufacturer, "manufacturer");
            console.log("Items Fetched: " + items.length)
            return NextResponse.json(items, {status: 200})
        }else {
            const items = await getAllInventoryItems();
            console.log("Items Fetched: " + items.length)
            return NextResponse.json(items, {status: 200})
        }

    } catch (e: any) {
        console.log("Failed to fetch items: " + e.message)
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}

export const dynamic = 'force-dynamic';

