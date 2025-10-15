import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      orderId,
      amount,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      items,
      returnUrl,
      cancelUrl,
      notifyUrl,
    } = body;

    const merchantId = process.env.PAYHERE_MERCHANT_ID!;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET!;
    const currency = "LKR";

    // Hash merchant secret as required by PayHere
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    // Create full signature
    const md5sig = crypto
      .createHash("md5")
      .update(merchantId + orderId + amount + currency + hashedSecret)
      .digest("hex")
      .toUpperCase();

    return NextResponse.json({
      merchant_id: merchantId,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      order_id: orderId,
      items,
      amount,
      currency,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      city,
      country: "Sri Lanka",
      md5sig,
    });
  } catch (err) {
    console.error("PayHere initiate error:", err);
    return NextResponse.json(
      { message: "Error generating PayHere payload" },
      { status: 500 }
    );
  }
}
