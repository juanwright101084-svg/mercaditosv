// src/app/checkout/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart, Loader2, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { createOrder } from '@/app/actions/orders';
import { createPaymentIntent } from '@/app/actions/payments';
import { StripeProvider } from './StripeProvider';

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  const total = getTotal();
  const impuesto = total * 0.16;
  const totalConImpuesto = total + impuesto;

  const handleCreateOrderAndIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_user='))
        ?.split('=')[1];

      if (!cookieValue) {
        toast.error('Debes iniciar sesión');
        setLoading(false);
        return;
      }

      const user = JSON.parse(decodeURIComponent(cookieValue));
      const clientId = user.client_id;

      if (!clientId) {
        toast.error('Tu cuenta no tiene un cliente asociado');
        setLoading(false);
        return;
      }

      const orderItems = items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const orderResult = await createOrder({
        client_id: clientId,
        status: 'pending',
        items: orderItems,
      });

      if ('error' in orderResult && orderResult.error) {
        toast.error('Error al crear la orden', {
          description: orderResult.error,
        });
        setLoading(false);
        return;
      }

      const createdOrder = orderResult.order;

      if (!createdOrder?.id) {
        toast.error('No se pudo obtener el ID de la orden');
        setLoading(false);
        return;
      }

      const paymentResult = await createPaymentIntent(createdOrder.id);

      if (paymentResult.error || !paymentResult.client_secret) {
        toast.error('Error al iniciar el pago', {
          description: paymentResult.error ?? 'Intenta de nuevo',
        });
        setLoading(false);
        return;
      }

      setClientSecret(paymentResult.client_secret);
      setOrderId(createdOrder.id);
      setLoading(false);
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Error inesperado');
      setLoading(false);
    }
  };

  if (items.length === 0 && !clientSecret) {
    return (
      <main className="min-h-screen bg-cream-50 px-4 py-12 text-stone-900 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
              <ShoppingCart size={40} className="text-brand-500" />
            </div>
          </div>
          <h1 className="mb-4 text-3xl font-extrabold">Tu carrito está vacío</h1>
          <p className="mb-6 text-stone-600">
            Agrega productos antes de proceder al pago
          </p>
          <Link
            href="/productos"
            className="btn-brand inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold"
          >
            <ShoppingCart size={20} />
            Ver catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream-50 px-4 py-8 text-stone-900 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/carrito"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand-500 transition hover:text-brand-600"
        >
          <ArrowLeft size={16} />
          Volver al carrito
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-extrabold">Checkout</h1>
          <p className="mt-2 text-stone-600">
            Completa tu compra de forma segura
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {clientSecret && orderId ? (
              <StripeProvider
                clientSecret={clientSecret}
                total={totalConImpuesto}
                orderId={orderId}
              />
            ) : (
              <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Tu pedido</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b border-cream-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-bold text-stone-900">{item.name}</p>
                        <p className="text-sm text-stone-500">
                          Cantidad: {item.quantity} × $
                          {Number(item.price).toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold text-stone-900">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-fit">
            <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Resumen</h2>

              <div className="space-y-3 border-b border-cream-200 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Impuestos (16%)</span>
                  <span className="font-semibold">${impuesto.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Envío</span>
                  <span className="font-semibold text-success-600">GRATIS</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-2xl font-extrabold">
                <span>Total:</span>
                <span className="text-brand-500">
                  ${totalConImpuesto.toFixed(2)}
                </span>
              </div>

              {!clientSecret ? (
                <>
                  <form onSubmit={handleCreateOrderAndIntent} className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-brand flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Preparando pago...
                        </>
                      ) : (
                        'Continuar al pago'
                      )}
                    </button>
                  </form>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-500">
                    <ShieldCheck size={14} className="text-success-600" />
                    Pago 100% seguro con Stripe
                  </div>
                </>
              ) : (
                <div className="mt-6 rounded-lg bg-success-50 p-3 text-center text-xs font-semibold text-success-700">
                  ✓ Orden creada — completa el pago
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}