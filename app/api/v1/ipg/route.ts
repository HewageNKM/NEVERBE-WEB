import { NextResponse } from "next/server";
import md5 from "crypto-js/md5";
import { updatePayment } from "@/firebase/firebaseAdmin";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const {
            merchant_id,
            order_id,
            payment_id,
            payhere_amount,
            payhere_currency,
            status_code,
            md5sig,
            method
        } = decodeUrl(body);
        console.log("Received payment notification:", { merchant_id, order_id, payment_id, payhere_amount, payhere_currency, status_code, md5sig, method });
        const merchantSecret = process.env.NEXT_PUBLIC_IPG_MERCHANT_SECRET;
        const hashedSecret = md5(merchantSecret).toString().toUpperCase();

        // Generate the local MD5 signature for verification
        const local_md5sig = md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret)
            .toString()
            .toUpperCase();

        // Verify the MD5 signature
        if (local_md5sig !== md5sig) {
            console.info("OWN MD5 Signature: ", local_md5sig,"Received MD5 Signature: ", md5sig);
            console.error("MD5 Signature mismatch");
            return NextResponse.json({ message: 'Unauthorized: Different Signatures' }, { status: 401 });
        }

        // Handle payment success or failure based on the status_code
        if (status_code === '2') {
            console.log("Payment Successful");
            await updatePayment(order_id, payment_id, "Paid");
            return NextResponse.json({ message: `Payment Successful ${status_code}` }, { status: 201 });
        } else {
            console.log("Payment Failed");
            await updatePayment(order_id, payment_id, "Failed");
            return NextResponse.json({ message: `Payment Failed ${status_code}` }, { status: 400 });
        }

    } catch (e) {
        console.error("Payment processing error:", e);
        return NextResponse.json({ message: "Error processing payment" }, { status: 500 });
    }
}

// Utility function to decode the URL-encoded form data
const decodeUrl = (body: any) => {
    const params = new URLSearchParams(body);
    return {
        merchant_id: params.get('merchant_id'),
        order_id: params.get('order_id'),
        payment_id: params.get('payment_id'),
        payhere_amount: params.get('payhere_amount'),
        payhere_currency: params.get('payhere_currency'),
        status_code: params.get('status_code'),
        md5sig: params.get('md5sig'),
        method: params.get('method'),
    };
};
