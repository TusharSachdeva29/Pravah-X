import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
})

export const config = {
  matcher: [
    // Protect specific routes
    '/dashboard/:path*',
    '/profile/:path*',
    
    '/((?!api|_next/static|_next/image|favicon.ico|auth|$).*)',
  ],
}