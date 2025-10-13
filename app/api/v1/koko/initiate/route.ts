// app/api/v1/koko/initiate/route.ts

import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            orderId,
            amount,
            firstName,
            lastName,
            email,
            description
        } = body;

        // --- Step 1: Retrieve credentials from environment variables ---
        const merchantId = process.env.KOKO_MERCHANT_ID;
        const apiKey = process.env.KOKO_API_KEY;
        const privateKey = process.env.KOKO_PRIVATE_KEY;

        if (!merchantId || !apiKey || !privateKey) {
            throw new Error("Koko credentials are not configured in environment variables.");
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const returnUrl = `${baseUrl}/checkout/success?order_id=${orderId}`;
        const cancelUrl = `${baseUrl}/checkout/fail?order_id=${orderId}`;
        const responseUrl = `${baseUrl}/api/v1/koko/notify`;

        // --- Step 2: Construct the dataString in the exact specified order [cite: 75] ---
        const dataString =
            merchantId +
            amount +
            "LKR" + // Currency [cite: 31]
            "customapi" + // _pluginName [cite: 32]
            "1.0.1" + // _pluginVersion [cite: 32]
            returnUrl + // _returnUrl [cite: 31]
            cancelUrl + // _cancelUrl [cite: 31]
            orderId + // _orderId [cite: 31]
            orderId + // _reference [cite: 31]
            firstName + // _firstName [cite: 32]
            lastName + // _lastName [cite: 32]
            email + // _email [cite: 32]
            description + // _description [cite: 32]
            apiKey + // api_key [cite: 31]
            responseUrl; // _responseUrl [cite: 31]

        // --- Step 3: Sign the dataString with your RSA Private Key ---
        const signer = crypto.createSign('RSA-SHA256');
        signer.update(dataString);
        signer.end();
        const signature = signer.sign(privateKey, 'base64');

        // --- Step 4: Prepare the payload for the Koko form ---
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
            dataString: dataString,
            signature: signature,
        };

        return NextResponse.json(payload, { status: 200 });

    } catch (error: any) {
        console.error("Koko initiation error:", error);
        return NextResponse.json({ message: "Error initiating Koko payment", error: error.message }, { status: 500 });
    }
}