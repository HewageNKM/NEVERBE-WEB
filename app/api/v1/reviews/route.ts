import {NextResponse} from "next/server";
import {addNewReview, getReviewByItemId, verifyToken} from "@/firebase/firebaseAdmin";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const itemId = url.searchParams.get('itemId');
        const userId = url.searchParams.get('userId');
        const res = await getReviewByItemId(itemId, userId);
        return NextResponse.json(res, {status: 200})
    } catch (e: any) {
        console.log("Failed to get reviews: " + e.message)
        NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}
export async function POST(req: Request) {
    try {
        const idToken = await verifyToken(req);
        console.log("Token Verified: " + idToken.uid)
        const review = await req.json();
        console.log("Saving New Review: " + review.reviewId)
        const token = new URL(req.url).searchParams.get('recaptchaToken');
        const res = await addNewReview(review,token);
        return NextResponse.json(res, {status: 200})
    } catch (e: any) {
        console.log("Failed to save reviews: " + e.message)
        NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}

