import { NextResponse } from 'next/server';

export function middleware(req:Request,res:Response) {
    const origin = req.headers.get('origin');

    res.headers.set('Access-Control-Allow-Origin', 'https://www.neverbe.lk');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (!origin) {
        // No Origin header indicates a same-origin request
        console.log('Allowed: Same-origin request');
        return NextResponse.next(); // Allow the request
    }

    if (origin === 'https://www.neverbe.lk') {
        // Cross-origin request from allowed origin
        console.log(`Allowed: Cross-origin request from ${origin}`);
        return NextResponse.next(); // Allow the request
    }

    // Block requests from other origins
    console.log(`Blocked: Request from unknown origin: ${origin}`);
    return new NextResponse('Forbidden', { status: 403 });
}

// Apply the middleware to all API routes
export const config = {
    matcher: '/api/:path*',
};
