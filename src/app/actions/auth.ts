// src/app/actions/auth.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache'; // 👈 NUEVO

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface LoginResponse {
  user: { id: number; name: string; email: string; role: string; client_id?: number };
  token: string;
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos' };
  }

  let data: LoginResponse;
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      return { error: 'Credenciales inválidas' };
    }

    data = await res.json();
  } catch (err) {
    console.error('Login error:', err);
    return { error: 'No se pudo conectar con el servidor' };
  }

  if (!data.token) {
    return { error: 'La API no devolvió un token' };
  }

  const cookieStore = await cookies();
  cookieStore.set('auth_token', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set('auth_user', JSON.stringify(data.user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  // 👈 Fuerza que el layout se re-renderice y el navbar lea la cookie nueva
  revalidatePath('/', 'layout');
  revalidatePath('/productos');

  redirect('/');
}

export async function register(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'Todos los campos son requeridos' };
  }

  let data: LoginResponse;
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: password,
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
          'Error al registrar usuario',
      };
    }

    data = await res.json();
  } catch (err) {
    console.error('Register error:', err);
    return { error: 'No se pudo conectar con el servidor' };
  }

  if (data.token) {
    const cookieStore = await cookies();
    cookieStore.set('auth_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set('auth_user', JSON.stringify(data.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    revalidatePath('/', 'layout');
    revalidatePath('/productos');

    redirect('/');
  }

  redirect('/login');
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (token) {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Ignorar errores
    }
  }

  cookieStore.delete('auth_token');
  cookieStore.delete('auth_user');

  // 👈 Fuerza que el layout se re-renderice al cerrar sesión
  revalidatePath('/', 'layout');

  redirect('/login');
}