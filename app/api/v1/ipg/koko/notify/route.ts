// app/api/v1/koko/notify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { updatePayment } from "@/services/OrderService";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const orderId = formData.get("orderId") as string;
    const trnId = formData.get("trnId") as string;
    const status = formData.get("status") as string;
    const signature = formData.get("signature") as string;
    const desc = formData.get("desc") as string | null;

    console.log("📩 Koko notify received:", { orderId, trnId, status, desc });

    if (!orderId || !trnId || !status || !signature) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    let kokoPublicKey = process.env.KOKO_PUBLIC_KEY;
    if (!kokoPublicKey) {
      throw new Error("Koko public key not found in environment.");
    }

    // ✅ Convert escaped newlines to real ones
    kokoPublicKey = kokoPublicKey.replace(/\\n/g, "\n").trim();

    // --- Step 1: Build verification string ---
    const dataToVerify = orderId + trnId + status;

    // --- Step 2: Verify signature ---
    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(dataToVerify, "utf8");
    verifier.end();

    const isVerified = verifier.verify(kokoPublicKey, signature, "base64");

    if (!isVerified) {
      console.error("❌ Invalid Koko signature for order:", orderId);
      return NextResponse.json(
        { message: "Unauthorized: Invalid signature" },
        { status: 401 }
      );
    }

    // --- Step 3: Update order payment status ---
    if (status === "SUCCESS") {
      await updatePayment(orderId, trnId, "Paid");
      console.log(`✅ Payment success recorded for order ${orderId}`);
    } else {
      await updatePayment(orderId, trnId, "Failed");
      console.log(`⚠️ Payment failed for order ${orderId} (${status})`);
    }

    return NextResponse.json({ message: "Notification processed" }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Koko notify error:", error);
    return NextResponse.json(
      { message: "Error processing Koko notification", error: error.message },
      { status: 500 }
    );
  }
}
