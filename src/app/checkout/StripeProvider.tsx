// src/app/checkout/StripeProvider.tsx
'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentForm } from './PaymentForm';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
);

interface StripeProviderProps {
  clientSecret: string;
  total: number;
  orderId: number;
}

export function StripeProvider({
  clientSecret,
  total,
  orderId,
}: StripeProviderProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#e11d48',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#e11d48',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '12px',
          },
        },
        locale: 'es',
      }}
    >
      <PaymentForm total={total} orderId={orderId} />
    </Elements>
  );
}