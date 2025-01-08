import {NextResponse} from "next/server";
import {deleteReviewById, verifyToken} from "@/firebase/firebaseAdmin";

export async function DELETE(req: Request) {
    try {
        const idToken = await verifyToken(req);
        console.log("Token Verified: " + idToken.uid)
        const url = new URL(req.url);
        const reviewId = url.pathname.slice(1).split('/').pop()
        console.log("Deleting Review: " + reviewId)
        const res = await deleteReviewById(reviewId);
        return NextResponse.json({message: 'Review Deleted'})
    } catch (e: any) {
        console.log("Failed to delete review: " + e.message)
        NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}


