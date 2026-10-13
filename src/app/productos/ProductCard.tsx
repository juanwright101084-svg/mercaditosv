// src/app/productos/ProductCard.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/store/cartStore';
import { ProductImage } from './ProductImage';

interface Product {
  id: number;
  name: string;
  price: string | number;
  image?: string;
  stock?: number;
  category_id?: number;
  category?: { id: number; name: string } | null;
}

interface ProductCardProps {
  product: Product;
}

const IMAGE_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL ?? 'http://127.0.0.1:8000';

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const price = Number(product.price) || 0;
  const stock = Number(product.stock) || 0;
  const isAvailable = stock > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAvailable) {
      toast.error('Producto agotado');
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price,
      quantity: 1,
      stock,
      category: product.category?.name,
      image: product.image,
    });

    setAdded(true);
    toast.success('Agregado al carrito', {
      description: product.name,
    });

    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card group relative flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm">
      {/* Badge de stock (esquina superior) */}
      <div className="absolute left-3 top-3 z-10">
        {isAvailable ? (
          <span className="rounded-full bg-success-50 px-2.5 py-1 text-xs font-bold text-success-700">
            En stock
          </span>
        ) : (
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
            Agotado
          </span>
        )}
      </div>

      {/* Imagen — link al detalle */}
      <Link
        href={`/productos/${product.id}`}
        className="relative flex aspect-square items-center justify-center overflow-hidden bg-cream-50"
      >
        {product.image ? (
          <ProductImage
            src={`${IMAGE_URL}${product.image.replace(/\\\//g, '/')}`}
            alt={product.name}
          />
        ) : (
          <span className="text-5xl">📦</span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-accent-600">
          {product.category?.name || 'Sin categoría'}
        </p>

        <Link href={`/productos/${product.id}`}>
          <h3 className="mb-3 line-clamp-2 min-h-[2.5rem] text-base font-bold leading-snug text-stone-900 transition hover:text-brand-500">
            {product.name}
          </h3>
        </Link>

        {/* Precio */}
        <div className="mt-auto mb-3 flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-brand-500">
            ${price.toFixed(2)}
          </span>
        </div>

        {/* Botón agregar */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={!isAvailable}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition ${
            !isAvailable
              ? 'cursor-not-allowed bg-stone-300'
              : added
                ? 'bg-success-600'
                : 'bg-brand-500 hover:bg-brand-600 hover:shadow-md active:scale-[0.98]'
          }`}
        >
          {added ? (
            <>
              <Check size={16} />
              Agregado
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              {isAvailable ? 'Agregar' : 'Agotado'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}