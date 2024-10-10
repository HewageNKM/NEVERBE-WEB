import {NextResponse} from "next/server";
import {Order} from "@/interfaces";
import {addNewOrder} from "@/firebase/firebaseAdmin";

export async function POST(req: Request) {
    try {
        const order: Order = await req.json();
        console.log("Saving New Order: "+order.orderId)
        const result = await addNewOrder(order);
        console.log(result)
        console.log("Saved New Order: "+order.orderId)
        return NextResponse.json({message: 'Order Added'}, {status: 200})
    } catch (e: any) {
        console.log("Failed to save order: "+e.message)
        NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}