import {sendEmail, verifyToken} from "@/firebase/firebaseAdmin";
import {NextResponse} from "next/server";
import {Message} from "@/interfaces";

export async function POST(req: Request) {
    try {
        const idToken = await verifyToken(req);
        console.log("Token Verified: " + idToken.uid)
        const captchaToken = new URL(req.url).searchParams.get('captchaToken');
        const json: Message = await req.json();
        await sendEmail(json,captchaToken);
        return NextResponse.json({message: 'Email Sent'}, {status: 200})
    } catch (e: any) {
        console.log("Failed to send email: " + e.message)
        NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}