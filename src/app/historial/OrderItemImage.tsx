// src/app/historial/OrderItemImage.tsx
'use client';

interface OrderItemImageProps {
  src: string;
  alt: string;
}

export function OrderItemImage({ src, alt }: OrderItemImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-contain p-1"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        const parent = e.currentTarget.parentElement as HTMLElement;
        if (parent) {
          parent.innerHTML = '<span class="text-xl">🛍️</span>';
        }
      }}
    />
  );
}