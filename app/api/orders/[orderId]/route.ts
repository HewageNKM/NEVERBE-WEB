import {getOrderById, verifyToken} from "@/firebase/firebaseAdmin";

export async function GET(req: Request, {params}: {params: {orderId: string}}) {
    try {
         await verifyToken(req);

        console.log("Order ID: " + params.orderId)
        const order = await getOrderById(params.orderId);
        return new Response(JSON.stringify(order), {status: 200})
    }catch (e:any) {
        console.log(e)
        return new Response(`Unauthorized ${e.message}`, {status: 401})
    }
}