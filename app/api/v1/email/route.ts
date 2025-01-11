import {NextResponse} from 'next/server';
import {rateLimiter, sendEmail, verifyToken} from "@/firebase/firebaseAdmin";
import {Message} from "@/interfaces";


export async function POST(req: Request) {
    try {
        const idToken = await verifyToken(req);
        console.log("Token Verified: " + idToken.uid);

        const isLimited = await rateLimiter({
            idToken: idToken.uid,
            rateLimit: 3,
            windowSize: 60 * 1000,
        });

        if (isLimited) {
            console.log(`Rate limit exceeded for token: ${idToken.uid}`);
            return NextResponse.json({message: 'Too Many Requests'}, {status: 429});
        }

        const captchaToken = new URL(req.url).searchParams.get('captchaToken');
        const json: Message = await req.json();
        await sendEmail(json, captchaToken);

        return NextResponse.json({message: 'Email Sent'}, {status: 200});
    } catch (e: any) {
        console.log("Failed to send email: " + e.message);
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500});
    }
}
