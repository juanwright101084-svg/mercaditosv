// src/app/actions/orders.ts
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

interface OrderItemInput {
  product_id: number;
  quantity: number;
}

interface CreateOrderInput {
  items: OrderItemInput[];
  client_id: number;
  status?: 'pending' | 'paid' | 'shipped' | 'delivered';
}

export async function createOrder(input: CreateOrderInput) {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get('auth_token')?.value;
  const token = rawToken ? decodeURIComponent(rawToken) : undefined;

  if (!token) {
    return { error: 'Debes iniciar sesión para crear una orden' };
  }

  let orderData;
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        client_id: input.client_id,
        status: input.status ?? 'pending',
        items: input.items,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const firstError = errorData?.errors
        ? Object.values(errorData.errors)[0]
        : null;
      return {
        error:
          (Array.isArray(firstError) ? firstError[0] : firstError) ||
          errorData.message ||
          'Error al crear la orden',
      };
    }

    orderData = await res.json();
  } catch (err) {
    console.error('Error creando orden:', err);
    return { error: 'No se pudo conectar con el servidor' };
  }

  revalidatePath('/historial');
  revalidatePath('/carrito');
  revalidatePath('/productos');

  return { success: true, order: orderData.data ?? orderData };
}

export async function getMyOrders() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get('auth_token')?.value;
  const token = rawToken ? decodeURIComponent(rawToken) : undefined;

  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/orders`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data ?? data;
  } catch (err) {
    console.error('Error fetching orders:', err);
    return [];
  }
}

export async function getMyClientId(): Promise<number | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth_user')?.value;

  if (!userCookie) return null;

  try {
    const user = JSON.parse(decodeURIComponent(userCookie));
    return user.client_id ?? user.id ?? null;
  } catch {
    return null;
  }
}

export async function markOrderAsPaid(orderId: number) {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get('auth_token')?.value;
  const token = rawToken ? decodeURIComponent(rawToken) : undefined;

  if (!token) {
    return { error: 'No autenticado' };
  }

  try {
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'paid' }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { error: errorData.message || 'No se pudo actualizar la orden' };
    }

    revalidatePath('/historial');

    return { success: true };
  } catch (err) {
    console.error('Error marcando orden como pagada:', err);
    return { error: 'Error de conexión' };
  }
}