import {NextResponse} from 'next/server';

export function middleware(req: Request) {
    console.log(req)
    const origin = req.headers.get('origin');
    if (!origin || origin !== 'https://www.neverbe.lk') {
        console.log('Request from unknown origin is not allowed. Origin: ' + origin)
        return new NextResponse('Forbidden', {status: 403});
    }
    console.log('Request from an allowed origin. Origin: ' + origin)
    const res = NextResponse.next();
    // Set CORS headers
    res.headers.set('Access-Control-Allow-Origin', 'https://www.neverbe.lk');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, {headers: res.headers});
    }
    return res;
}

// Define the matcher to apply the middleware only to API routes
export const config = {
    matcher: '/api/:path*',
};
