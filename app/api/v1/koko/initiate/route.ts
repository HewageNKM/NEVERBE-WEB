// app/api/v1/koko/initiate/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount, firstName, lastName, email, description } = body;

    // --- Step 1: Retrieve credentials ---
    const merchantId = process.env.KOKO_MERCHANT_ID;
    const apiKey = process.env.KOKO_API_KEY;
    const privateKey = process.env.KOKO_PRIVATE_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const redirectUrl =
      process.env.NEXT_PUBLIC_KOKO_REDIRECT_URL ||
      "https://devapi.paykoko.com/api/merchants/orderCreate";

    if (!merchantId || !apiKey || !privateKey || !baseUrl) {
      throw new Error("Koko credentials or base URL missing in environment.");
    }

    // --- Step 2: Construct callback URLs ---
    const returnUrl = `${baseUrl}/checkout/success?orderId=${orderId}`;
    const cancelUrl = `${baseUrl}/checkout/fail?orderId=${orderId}`;
    const responseUrl = `${baseUrl}/api/v1/koko/notify`;

    // --- Step 3: Build data string in correct order (per Koko v1.05) ---
    const dataString =
      merchantId +
      amount +
      "LKR" +
      "customapi" +
      "1.0.1" +
      returnUrl +
      cancelUrl +
      orderId + // _orderId
      orderId + // _reference (same as orderId)
      firstName +
      lastName +
      email +
      description +
      apiKey +
      responseUrl;

    // --- Step 4: Sign the data string ---
    const formattedPrivateKey = privateKey.replace(/\\n/g, "\n").trim();

    const signer = crypto.createSign("RSA-SHA256");
    signer.update(dataString, "utf8");
    signer.end();
    const signature = signer.sign(formattedPrivateKey, "base64");

    // --- Step 5: Return payload to frontend ---
    const payload = {
      _mId: merchantId,
      api_key: apiKey,
      _returnUrl: returnUrl,
      _cancelUrl: cancelUrl,
      _responseUrl: responseUrl,
      _amount: amount,
      _currency: "LKR",
      _reference: orderId,
      _orderId: orderId,
      _pluginName: "customapi",
      _pluginVersion: "1.0.1",
      _description: description,
      _firstName: firstName,
      _lastName: lastName,
      _email: email,
      dataString,
      signature,
    };

    console.log("✅ Koko initiate payload:", payload);
    return NextResponse.json(payload, { status: 200 });
  } catch (error: any) {
    console.error("❌ Koko initiate error:", error);
    return NextResponse.json(
      { message: "Error initiating Koko payment", error: error.message },
      { status: 500 }
    );
  }
}
