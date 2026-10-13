// src/app/historial/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, ShoppingBag } from 'lucide-react';
import { getMyOrders } from '@/app/actions/orders';
import { OrderItemImage } from './OrderItemImage';

export const metadata = { title: 'Mis compras | MercaditoSV' };

const IMAGE_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL ?? 'http://127.0.0.1:8000';

interface OrderItem {
  product_id: number;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number | string;
  subtotal: number | string;
}

interface Order {
  id: number;
  status: string;
  total: number | string;
  client_name?: string;
  created_at: string;
  items?: OrderItem[];
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  pending: {
    label: 'Pendiente',
    bg: 'bg-accent-100',
    text: 'text-accent-700',
  },
  paid: {
    label: 'Pagado',
    bg: 'bg-success-100',
    text: 'text-success-700',
  },
  shipped: {
    label: 'Enviado',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
  },
  delivered: {
    label: 'Entregado',
    bg: 'bg-success-100',
    text: 'text-success-700',
  },
};

async function OrderList() {
  const orders = await getMyOrders();

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-cream-200 bg-white p-12 text-center">
        <Package size={48} className="mx-auto mb-4 text-stone-400" />
        <h2 className="mb-2 text-xl font-bold text-stone-900">
          Aún no tienes compras
        </h2>
        <p className="mb-6 text-stone-600">
          Cuando hagas tu primer pedido, aparecerá aquí
        </p>
        <Link
          href="/productos"
          className="btn-brand inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold"
        >
          <ShoppingBag size={20} />
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order: Order) => {
        const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;

        return (
          <div
            key={order.id}
            className="rounded-2xl border border-cream-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Orden #{order.id}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  {new Date(order.created_at).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${status.bg} ${status.text}`}
              >
                {status.label}
              </span>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="space-y-3 border-t border-cream-100 pt-4">
                {order.items.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cream-50">
                      {item.product_image ? (
                        <OrderItemImage
                          src={`${IMAGE_URL}${item.product_image.replace(
                            /\\\//g,
                            '/'
                          )}`}
                          alt={item.product_name}
                        />
                      ) : (
                        <span className="text-xl">🛍️</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-stone-900">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-stone-500">
                        {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-stone-900">
                      ${Number(item.subtotal).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-cream-100 pt-4">
              <span className="text-sm text-stone-600">Total</span>
              <span className="text-xl font-extrabold text-brand-500">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HistorialPage() {
  return (
    <main className="min-h-screen bg-cream-50 px-4 py-8 text-stone-900 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand-500 transition hover:text-brand-600"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-extrabold">Mis compras</h1>
          <p className="mt-2 text-stone-600">
            Historial de todos tus pedidos
          </p>
        </header>

        <Suspense
          fallback={
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-cream-200 bg-white p-6"
                >
                  <div className="mb-3 h-4 w-24 rounded bg-cream-100" />
                  <div className="h-6 w-48 rounded bg-cream-100" />
                </div>
              ))}
            </div>
          }
        >
          <OrderList />
        </Suspense>
      </div>
    </main>
  );
}