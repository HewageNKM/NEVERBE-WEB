import { getPaymentMethods } from "@/services/ProductService";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
    try {
        const methods = await getPaymentMethods();
        return NextResponse.json(methods, {status: 200})
    } catch (e: any) {
        console.log("Failed to fetch payment methods: " + e.message)
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}

export const dynamic = 'force-dynamic';

