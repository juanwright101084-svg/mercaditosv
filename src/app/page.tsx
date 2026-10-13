// src/app/page.tsx
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Truck,
  ShieldCheck,
  Zap,
  Coffee,
  Cookie,
  Cake,
  Milk,
  SprayCan,
} from 'lucide-react';
import { getProducts } from '@/lib/products';
import { HomeHero } from './HomeHero';
import { ProductCard } from './productos/ProductCard';

const CATEGORIES = [
  { id: 1, name: 'Bebidas', icon: Coffee, color: 'text-brand-500' },
  { id: 2, name: 'Snacks', icon: Cookie, color: 'text-accent-600' },
  { id: 3, name: 'Postres', icon: Cake, color: 'text-pink-500' },
  { id: 4, name: 'Lácteos', icon: Milk, color: 'text-blue-500' },
  { id: 5, name: 'Limpieza', icon: SprayCan, color: 'text-success-600' },
];

const BENEFITS = [
  {
    icon: Truck,
    title: 'Envío gratis',
    description: 'En tu primera compra mayor a $20',
    color: 'text-brand-500',
    bg: 'bg-brand-50',
  },
  {
    icon: ShieldCheck,
    title: 'Pago seguro',
    description: 'Procesado con Stripe',
    color: 'text-success-600',
    bg: 'bg-success-50',
  },
  {
    icon: Zap,
    title: 'Entrega rápida',
    description: 'En menos de 24 horas',
    color: 'text-accent-600',
    bg: 'bg-accent-50',
  },
];

interface Product {
  id: number;
  name: string;
  price: string | number;
  image?: string;
  stock?: number;
  category_id?: number;
  category?: { id: number; name: string } | null;
  is_featured?: boolean;
}

async function FeaturedProducts() {
  let products: Product[] = [];

  try {
    const data = await getProducts();
    products = data ?? [];
  } catch (err) {
    console.error('Error cargando destacados:', err);
    return null;
  }

  const featured = products.filter((p) => p.is_featured).slice(0, 4);
  const toShow = featured.length > 0 ? featured : products.slice(0, 4);

  if (toShow.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent-100 px-3 py-1">
            <Sparkles size={14} className="text-accent-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-accent-700">
              Destacados de la semana
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900">
            Lo más vendido
          </h2>
        </div>
        <Link
          href="/productos"
          className="hidden items-center gap-2 text-sm font-semibold text-brand-500 transition hover:text-brand-600 sm:inline-flex"
        >
          Ver todo
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {toShow.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500"
        >
          Ver todo el catálogo
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream-50 px-4 py-8 text-stone-900 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <HomeHero />

        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-extrabold text-stone-900">
            Compra por categoría
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/productos?category=${cat.id}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-cream-200 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-100 transition group-hover:bg-brand-50">
                    <Icon size={26} className={cat.color} />
                  </div>
                  <span className="text-sm font-bold text-stone-900">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <FeaturedProducts />

        <section className="mb-16 grid gap-4 sm:grid-cols-3">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className={`rounded-2xl border border-cream-200 p-6 ${benefit.bg}`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Icon size={24} className={benefit.color} />
                </div>
                <h3 className="mb-1 text-lg font-bold text-stone-900">
                  {benefit.title}
                </h3>
                <p className="text-sm text-stone-600">{benefit.description}</p>
              </div>
            );
          })}
        </section>

        <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-8 text-center shadow-xl sm:p-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            ¿No tienes cuenta?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/90">
            Regístrate gratis y aprovecha envío gratis en tu primera compra
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 font-bold text-stone-900 shadow-lg transition hover:bg-accent-400 hover:shadow-xl"
            >
              Registrarme gratis
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Explorar catálogo
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}