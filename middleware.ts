import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const currentPath = request.nextUrl.pathname;

    // Check for a query parameter to bypass redirection
    if (currentPath === '/' && !request.nextUrl.searchParams.has('visited')) {
        const redirectUrl = new URL('/landingpage', request.url);
        redirectUrl.searchParams.set('redirectedFrom', '/'); // Optional tracking
        return NextResponse.redirect(redirectUrl);
    }

    // Allow all other requests to proceed
    return NextResponse.next();
}

export const config = {
    matcher: ['/'], // Apply middleware only to the root route
};
