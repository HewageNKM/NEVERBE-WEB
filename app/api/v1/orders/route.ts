import {NextResponse} from "next/server";
import {Order} from "@/interfaces";
import { verifyToken } from "@/services/AuthService";
import { addNewOrder } from "@/services/OrderService";

export async function POST(req: Request) {
    try {
        const idToken = await verifyToken(req);
        console.log("Token Verified: " + idToken.uid)

        const order: Order = await req.json();
        console.log("Saving New Order: " + order.orderId)
        const token = new URL(req.url).searchParams.get('captchaToken') || "";
        const result = await addNewOrder(order, token);

        if (!result) {
            return NextResponse.json({message: 'Order Not Added'}, {status: 400})
        }
        console.log("Saved New Order: " + order.orderId)
        return NextResponse.json({message: 'Order Added'}, {status: 200})
    } catch (e: any) {
        console.log("Failed to save order: " + e.message)
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}