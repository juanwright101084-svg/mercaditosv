// src/app/api/search/route.ts
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const limit = searchParams.get('limit') ?? '5';

  if (!q) {
    return NextResponse.json({ products: [] });
  }

  try {
    const res = await fetch(
      `${API_URL}/products?search=${encodeURIComponent(q)}&limit=${limit}`,
      {
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return NextResponse.json({ products: [] });
    }

    const data = await res.json();
    const products = data.data ?? data;

    return NextResponse.json({ products });
  } catch (err) {
    console.error('Error en búsqueda:', err);
    return NextResponse.json({ products: [] });
  }
}