import {NextResponse} from "next/server";
import {getAllInventoryItems, verifyToken} from "@/firebase/firebaseAdmin";

export async function GET(req: Request) {
    try {
        const idToken = await verifyToken(req);
        console.log("Token Verified: " + idToken.uid)

        const items = await getAllInventoryItems();
        console.log("Items Fetched: " + items.length)

        return NextResponse.json(items, {status: 200})
    } catch (e: any) {
        console.log("Failed to fetch items: " + e.message)
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}
export const dynamic = 'force-dynamic';

