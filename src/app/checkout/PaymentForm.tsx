// src/app/checkout/PaymentForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { Loader2, Lock } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { markOrderAsPaid } from '@/app/actions/orders';

interface PaymentFormProps {
  total: number;
  orderId: number;
}

export function PaymentForm({ total, orderId }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe aún no está listo');
      return;
    }

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success?order_id=${orderId}`,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast.error('Pago rechazado', {
        description: error.message ?? 'Verifica los datos de tu tarjeta',
      });
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Marcar la orden como pagada
      const result = await markOrderAsPaid(orderId);

      if ('error' in result && result.error) {
        console.warn('No se pudo marcar como pagada:', result.error);
      }

      toast.success('¡Pago exitoso!', {
        description: 'Gracias por tu compra',
      });
      clearCart();
      router.push(`/success?order_id=${orderId}`);
      return;
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border-2 border-cream-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100">
            <Lock size={16} className="text-brand-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Información de pago
            </h3>
            <p className="text-xs text-stone-500">
              Pago seguro procesado por Stripe
            </p>
          </div>
        </div>

        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-brand flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Procesando pago...
          </>
        ) : (
          <>🔒 Pagar ${total.toFixed(2)}</>
        )}
      </button>

      <p className="text-center text-xs text-stone-500">
        Al confirmar aceptas nuestros términos y condiciones
      </p>
    </form>
  );
}