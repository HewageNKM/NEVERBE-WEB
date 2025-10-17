import { verifyToken } from "@/services/AuthService";
import { getOrderByIdForInvoice } from "@/services/OrderService";

export async function GET(req: Request, {params}: { params: { orderId: string } }) {
    try {
        await verifyToken(req);

        console.log("Order ID: " + params.orderId)
        const order = await getOrderByIdForInvoice(params.orderId);
        return new Response(JSON.stringify(order), {status: 200})
    } catch (e: any) {
        console.log(e)
        return new Response(`Unauthorized ${e.message}`, {status: 401})
    }
}