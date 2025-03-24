import {NextResponse} from "next/server";
import {Order} from "@/interfaces";
import {addNewOrder, getOrderByUserId, verifyToken} from "@/firebase/firebaseAdmin";

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
        NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}

export async function GET(req: Request) {
    try {
        const idToken = await verifyToken(req);
        console.log("Token Verified: " + idToken.uid)

        const userId = new URL(req.url).searchParams.get('userId') || "";
        console.log("Getting Orders for User: " + userId)
        const orders = await getOrderByUserId(userId);

        if (!orders) {
            return NextResponse.json({message: 'Orders Not Found'}, {status: 400})
        }
        console.log("Found Orders for User: " + userId)
        return NextResponse.json(orders, {status: 200})
    } catch (e: any) {
        console.log("Failed to get orders: " + e.message)
        NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}
