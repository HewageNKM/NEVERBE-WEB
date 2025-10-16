import { verifyToken } from "@/services/AuthService";
import md5 from "crypto-js/md5";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
     const idToken = await verifyToken(req);
            console.log("Token Verified: " + idToken.uid)
            
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

    // ✅ Ensure amount format
    const amountFormatted = parseFloat(amount)
      .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      .replace(/,/g, "");

    // ✅ Hash secret
    const hashedSecret = md5(merchantSecret).toString().toUpperCase();

    // ✅ Generate PayHere signature
    const hash = md5(
      merchantId + orderId + amountFormatted + currency + hashedSecret
    )
      .toString()
      .toUpperCase();

    // ✅ Return correct response field name
    return NextResponse.json({
      merchant_id: merchantId,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      order_id: orderId,
      items,
      amount: amountFormatted,
      currency,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      city,
      country: "Sri Lanka",
      hash, // ✅ must be "hash"
    });
  } catch (err) {
    console.error("PayHere initiate error:", err);
    return NextResponse.json(
      { message: "Error generating PayHere payload" },
      { status: 500 }
    );
  }
}
