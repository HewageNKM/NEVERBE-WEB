import md5 from "crypto-js/md5";
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

    console.log("✅ PayHere initiate payload:", body);

    console.log(
      "✅ Secret Loaded ",
      "******" + merchantId.split("").slice(-3).join(""),
      "******" + merchantSecret.split("").slice(-3).join("")
    );
    // Hash merchant secret as required by PayHere
    const hashedSecret = md5(merchantSecret).toString().toUpperCase();

    // Create full signature
    const md5sig = md5(merchantId + orderId + amount + currency + hashedSecret)
      .toString()
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
