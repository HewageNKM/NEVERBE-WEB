import { verifyToken } from "@/services/AuthService";
import { verifyCODOTP } from "@/services/NotificationService";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const idToken = await verifyToken(req);
    console.log("Token Verified: " + idToken.uid);
    const { phoneNumber, otp } = await req.json();

    const res = await verifyCODOTP(phoneNumber, otp);

    return NextResponse.json({ ...res }, { status: 200 });
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
