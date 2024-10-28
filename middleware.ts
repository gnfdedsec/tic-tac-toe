import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // ถ้าไม่มี session (ไม่ได้ login) และพยายามเข้าถึงหน้าที่ต้อง auth
  if (!session && req.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // ถ้ามี session แล้วพยายามเข้าหน้า login
  if (session && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

// กำหนดว่าจะใช้ middleware กับ path ไหนบ้าง
export const config = {
  matcher: ['/', '/login']
}

