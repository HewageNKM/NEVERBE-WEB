import { verifyToken } from "@/services/AuthService";
import { sendCODVerificationOTP } from "@/services/NotificationService";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const idToken = await verifyToken(req);
    console.log("Token Verified: " + idToken.uid);
    const { phoneNumber } = await req.json();

    const res = await sendCODVerificationOTP(phoneNumber || "");
    return NextResponse.json({ ...res }, { status: 200 });
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
