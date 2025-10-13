// app/api/v1/koko/notify/route.ts

import { NextResponse } from "next/server";
import crypto from "crypto";
import { updatePayment } from "@/firebase/firebaseAdmin";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const orderId = formData.get('orderId') as string;
        const trnId = formData.get('trnId') as string;
        const status = formData.get('status') as string;
        const signature = formData.get('signature') as string;

        console.log("Received Koko notification:", { orderId, trnId, status });

        const kokoPublicKey = process.env.NEXT_PUBLIC_KOKO_PUBLIC_KEY;
        if (!kokoPublicKey) {
            throw new Error("Koko public key is not configured.");
        }

        // --- Step 1: Create the string to verify [cite: 99] ---
        const dataToVerify = orderId + trnId + status;

        // --- Step 2: Verify the signature with Koko's Public Key [cite: 99] ---
        const verifier = crypto.createVerify('RSA-SHA256');
        verifier.update(dataToVerify);
        verifier.end();

        const isVerified = verifier.verify(kokoPublicKey, signature, 'base64');

        if (!isVerified) {
            console.error("Koko signature verification failed for orderId:", orderId);
            return NextResponse.json({ message: "Unauthorized: Invalid Signature" }, { status: 401 });
        }

        // --- Step 3: Update your database based on the verified status ---
        if (status === 'SUCCESS') {
            console.log(`Payment Successful for order: ${orderId}`);
            await updatePayment(orderId, trnId, "Paid");
        } else {
            console.log(`Payment Failed or was not successful for order: ${orderId}, Status: ${status}`);
            await updatePayment(orderId, trnId, "Failed");
        }
        
        return NextResponse.json({ message: "Notification received successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("Koko notification processing error:", error);
        return NextResponse.json({ message: "Error processing Koko notification" }, { status: 500 });
    }
}