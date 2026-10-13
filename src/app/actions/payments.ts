// src/app/actions/payments.ts
'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

interface CreatePaymentIntentResult {
  client_secret?: string;
  payment_id?: number;
  error?: string;
}

export async function createPaymentIntent(
  orderId: number
): Promise<CreatePaymentIntentResult> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get('auth_token')?.value;
  const token = rawToken ? decodeURIComponent(rawToken) : undefined;

  if (!token) {
    return { error: 'Debes iniciar sesión para pagar' };
  }

  try {
    const res = await fetch(`${API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ order_id: orderId }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        error:
          errorData.message ||
          'No se pudo iniciar el pago. Intenta de nuevo.',
      };
    }

    const data = await res.json();

    if (!data.client_secret) {
      return { error: 'Stripe no devolvió un client_secret' };
    }

    return {
      client_secret: data.client_secret,
      payment_id: data.payment?.id,
    };
  } catch (err) {
    console.error('Error creando payment intent:', err);
    return { error: 'No se pudo conectar con el servidor de pagos' };
  }
}