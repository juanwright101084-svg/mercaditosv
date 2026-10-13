// src/app/registro/page.tsx
import Link from 'next/link';
import { register } from '../actions/auth';

export const metadata = { title: 'Crear Cuenta | Tienda' };

export default function RegistroPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-stone-200 p-8">
        <h1 className="text-3xl font-extrabold text-stone-900 mb-2">
          Crear Cuenta
        </h1>
        <p className="text-stone-600 mb-6">
          Regístrate para empezar a comprar
        </p>

        <form action={register} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-stone-900 mb-2"
            >
              Nombre
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              autoComplete="name"
              className="w-full px-4 py-3 text-stone-900 placeholder-stone-400 bg-white border-2 border-stone-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-colors"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-stone-900 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 text-stone-900 placeholder-stone-400 bg-white border-2 border-stone-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-stone-900 mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-4 py-3 text-stone-900 placeholder-stone-400 bg-white border-2 border-stone-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-colors"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3 rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            Crear Cuenta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/login"
            className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}