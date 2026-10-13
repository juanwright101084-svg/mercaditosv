// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, LogOut, Package, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { logout } from '@/app/actions/auth';
import { NavbarSearch } from './NavbarSearch';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  client_id: number;
}

export function Navbar() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    setMounted(true);

    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_user='))
      ?.split('=')[1];

    if (cookieValue) {
      try {
        setUser(JSON.parse(decodeURIComponent(cookieValue)));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-40 border-b border-cream-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500">
              <ShoppingCart size={20} className="text-white" />
            </div>
            <span className="text-xl font-extrabold">
              Mercadito<span className="text-brand-500">SV</span>
            </span>
          </div>
          <div className="h-8 w-24 animate-pulse rounded bg-cream-100" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-cream-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 transition hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 shadow-sm">
              <ShoppingCart size={20} className="text-white" />
            </div>
            <span className="text-xl font-extrabold text-stone-900">
              Mercadito<span className="text-brand-500">SV</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            <Link
              href="/productos"
              className={`relative rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive('/productos')
                  ? 'text-brand-500'
                  : 'text-stone-700 hover:bg-cream-100 hover:text-brand-500'
              }`}
            >
              Catálogo
              {isActive('/productos') && (
                <span className="absolute inset-x-3 -bottom-3 h-0.5 rounded-full bg-brand-500" />
              )}
            </Link>

            {user && (
              <Link
                href="/historial"
                className={`relative rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive('/historial')
                    ? 'text-brand-500'
                    : 'text-stone-700 hover:bg-cream-100 hover:text-brand-500'
                }`}
              >
                Mis compras
                {isActive('/historial') && (
                  <span className="absolute inset-x-3 -bottom-3 h-0.5 rounded-full bg-brand-500" />
                )}
              </Link>
            )}
          </div>
        </div>

        <div className="hidden flex-1 max-w-md lg:block">
          <NavbarSearch />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/carrito"
            className="relative flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-600 hover:shadow-md"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white ring-2 ring-white">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full border-2 border-cream-200 bg-white px-3 py-1.5 text-sm font-semibold text-stone-700 transition hover:border-brand-300 hover:text-brand-500"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100">
                  <User size={14} className="text-brand-600" />
                </div>
                <span className="hidden max-w-[120px] truncate sm:inline">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />

                  <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-xl">
                    <div className="border-b border-cream-100 bg-cream-50 px-4 py-3">
                      <p className="text-sm font-bold text-stone-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-stone-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/historial"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-cream-100 hover:text-brand-500"
                      >
                        <Package size={16} />
                        Mis compras
                      </Link>

                      <form action={logout}>
                        <button
                          type="submit"
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-600 transition hover:bg-brand-50"
                        >
                          <LogOut size={16} />
                          Cerrar sesión
                        </button>
                      </form>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-cream-100 hover:text-brand-500"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 hover:shadow-md"
              >
                Registrarse
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-cream-200 text-stone-700 transition hover:border-brand-300 hover:text-brand-500 lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-cream-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            <div className="mb-2">
              <NavbarSearch />
            </div>

            <Link
              href="/productos"
              onClick={() => setMobileOpen(false)}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                isActive('/productos')
                  ? 'bg-brand-50 text-brand-500'
                  : 'text-stone-700 hover:bg-cream-100'
              }`}
            >
              Catálogo
            </Link>

            {user ? (
              <>
                <Link
                  href="/historial"
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                    isActive('/historial')
                      ? 'bg-brand-50 text-brand-500'
                      : 'text-stone-700 hover:bg-cream-100'
                  }`}
                >
                  Mis compras
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
                  >
                    Cerrar sesión
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-cream-100"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-brand-500 px-3 py-2.5 text-center text-sm font-bold text-white transition hover:bg-brand-600"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}