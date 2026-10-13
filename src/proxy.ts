// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const path = request.nextUrl.pathname;

  // Rutas que requieren login
  const protectedRoutes = ['/historial', '/checkout'];
  const isProtected = protectedRoutes.some((route) => path.startsWith(route));

  // Rutas de auth (no tiene sentido verlas si ya estás logueado)
  const authRoutes = ['/login', '/registro'];
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // Si intenta ver ruta protegida sin token → al login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si ya está logueado y va a login/registro → al home
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/historial/:path*', '/checkout/:path*', '/login', '/registro'],
};