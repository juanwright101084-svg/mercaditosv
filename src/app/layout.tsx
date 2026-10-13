// src/app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'MercaditoSV — Todo lo que necesitas, en un clic',
    template: '%s | MercaditoSV',
  },
  description:
    'Tu mercado en línea. Bebidas, snacks, abarrotes y más. Envío gratis en tu primera compra.',
  keywords: [
    'mercadito',
    'supermercado',
    'tienda en línea',
    'abarrotes',
    'bebidas',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream-50 text-stone-900">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: '#ffffff',
              border: '1px solid #f5ede0',
              borderRadius: '0.75rem',
            },
          }}
        />
      </body>
    </html>
  );
}