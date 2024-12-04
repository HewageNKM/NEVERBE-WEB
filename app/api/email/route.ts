import {sendEmail, verifyToken} from "@/firebase/firebaseAdmin";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const idToken = await verifyToken(req);
        console.log("Token Verified: " + idToken.uid)
        const json: Message = await req.json();
        await sendEmail(json);
        return NextResponse.json({message: 'Email Sent'}, {status: 200})
    } catch (e: any) {
        console.log("Failed to save order: " + e.message)
        NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}