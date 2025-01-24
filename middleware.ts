import { NextResponse } from 'next/server';

export function middleware(req,res) {
    const origin = req.headers.get('origin'); // The Origin header sent by the browser

    if (!origin || origin !== 'https://www.neverbe.lk') {
        console.log(`Blocked request from unknown origin: ${origin}`);
        return new NextResponse('Forbidden', { status: 403 });
    }

    console.log(`Allowed request from origin: ${origin}`);

    res.headers.set('Access-Control-Allow-Origin', 'https://www.neverbe.lk');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Allow the request to proceed
    return NextResponse.next();

}

// Apply the middleware to all API routes
export const config = {
    matcher: '/api/:path*',
};
