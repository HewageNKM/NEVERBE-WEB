import {NextResponse} from "next/server";
import {Order} from "@/interfaces";
import {addNewOrder, verifyToken} from "@/firebase/firebaseAdmin";

export async function POST(req: Request) {
    try {
        const idToken = await verifyToken(req);
        console.log("Token Verified: " + idToken.uid)

        const order: Order = await req.json();
        console.log("Saving New Order: " + order.orderId)

        const result = await addNewOrder(order);
        console.log(result)

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

