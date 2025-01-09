import {NextResponse} from "next/server";
import {getAllInventoryItems, getItemsByField, verifyToken} from "@/firebase/firebaseAdmin";

export async function GET(req: Request) {
    try {
        const idToken = await verifyToken(req);
        console.log("Token Verified: " + idToken.uid)
        const name = new URL(req.url).pathname.split('/').pop() || "";
        const items = await getItemsByField(name?.replace("%20"," "),'manufacturer');
        console.log("Items Fetched: " + items.length)

        return NextResponse.json(items, {status: 200})
    } catch (e: any) {
        console.log("Failed to fetch items: " + e.message)
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}
export const dynamic = 'force-dynamic';

