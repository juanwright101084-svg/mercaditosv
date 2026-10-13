// src/components/Footer.tsx
import Link from 'next/link';
import { ShoppingCart, Instagram, Send, MessageCircle } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-cream-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 shadow-sm">
                <ShoppingCart size={20} className="text-white" />
              </div>
              <span className="text-xl font-extrabold text-stone-900">
                Mercadito<span className="text-brand-500">SV</span>
              </span>
            </Link>
            <p className="text-sm text-stone-600">
              Tu mercado en línea. Encuentra todo lo que necesitas con envío
              gratis en tu primera compra.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 text-stone-600 transition hover:bg-brand-100 hover:text-brand-500"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 text-stone-600 transition hover:bg-brand-100 hover:text-brand-500"
              >
                <Send size={18} />
              </a>
              <a
                href="#"
                aria-label="Mensajes"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 text-stone-600 transition hover:bg-brand-100 hover:text-brand-500"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-stone-900">
              Comprar
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/productos"
                  className="text-stone-600 transition hover:text-brand-500"
                >
                  Catálogo completo
                </Link>
              </li>
              <li>
                <Link
                  href="/productos?category=1"
                  className="text-stone-600 transition hover:text-brand-500"
                >
                  Bebidas
                </Link>
              </li>
              <li>
                <Link
                  href="/productos?category=2"
                  className="text-stone-600 transition hover:text-brand-500"
                >
                  Snacks
                </Link>
              </li>
              <li>
                <Link
                  href="/productos?category=3"
                  className="text-stone-600 transition hover:text-brand-500"
                >
                  Postres
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-stone-900">
              Mi cuenta
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/login"
                  className="text-stone-600 transition hover:text-brand-500"
                >
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link
                  href="/registro"
                  className="text-stone-600 transition hover:text-brand-500"
                >
                  Crear cuenta
                </Link>
              </li>
              <li>
                <Link
                  href="/historial"
                  className="text-stone-600 transition hover:text-brand-500"
                >
                  Mis compras
                </Link>
              </li>
              <li>
                <Link
                  href="/carrito"
                  className="text-stone-600 transition hover:text-brand-500"
                >
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-stone-900">
              Ayuda
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-stone-600 transition hover:text-brand-500"
                >
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-600 transition hover:text-brand-500"
                >
                  Métodos de pago
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-600 transition hover:text-brand-500"
                >
                  Envíos y devoluciones
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-600 transition hover:text-brand-500"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream-200 pt-6 sm:flex-row">
          <p className="text-xs text-stone-500">
            © {currentYear} MercaditoSV. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-stone-500">
              Pagos seguros con
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded bg-cream-100 px-2 py-1 text-xs font-bold text-stone-700">
                VISA
              </span>
              <span className="rounded bg-cream-100 px-2 py-1 text-xs font-bold text-stone-700">
                MC
              </span>
              <span className="rounded bg-cream-100 px-2 py-1 text-xs font-bold text-brand-500">
                stripe
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}