import { NextResponse } from "next/server";
import md5 from "crypto-js/md5";
import { updatePayment } from "@/services/OrderService";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const merchant_id = params.get("merchant_id")!;
    const order_id = params.get("order_id")!;
    const payment_id = params.get("payment_id")!;
    const payhere_amount = params.get("payhere_amount")!;
    const payhere_currency = params.get("payhere_currency")!;
    const status_code = params.get("status_code")!;
    const md5sig = params.get("md5sig")!;
    const method = params.get("method");

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET!;
    const hashedSecret = md5(merchantSecret).toString().toUpperCase();

    const local_md5sig = md5(
      merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        hashedSecret
    )
      .toString()
      .toUpperCase();

    if (local_md5sig !== md5sig) {
      console.error("MD5 Signature mismatch", {
        local_md5sig,
        md5sig,
      });
      return NextResponse.json(
        { message: "Unauthorized: Signature mismatch" },
        { status: 401 }
      );
    }

    // Update Firebase order
    if (status_code === "2") {
      console.log("✅ Payment Successful:", order_id);
      await updatePayment(order_id, payment_id, "Paid");
      return NextResponse.json({ message: "Payment Successful" }, { status: 200 });
    } else {
      console.log("❌ Payment Failed:", order_id);
      await updatePayment(order_id, payment_id, "Failed");
      return NextResponse.json({ message: "Payment Failed" }, { status: 400 });
    }
  } catch (err) {
    console.error("PayHere notify error:", err);
    return NextResponse.json(
      { message: "Error processing payment" },
      { status: 500 }
    );
  }
}
