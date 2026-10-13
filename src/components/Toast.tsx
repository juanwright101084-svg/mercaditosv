// src/components/Toast.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Entrada: pequeño delay para que se anime
    const showTimer = setTimeout(() => setVisible(true), 10);

    // Salida automática
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Esperar animación de salida
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-sm transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-white p-4 shadow-lg ring-1 ring-black/5">
        {/* Icono de check */}
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <svg
            className="h-5 w-5 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        {/* Contenido */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-stone-900">{message}</p>
          <Link
            href="/carrito"
            className="mt-1 inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Ver carrito →
          </Link>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 rounded-lg p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
          aria-label="Cerrar"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}