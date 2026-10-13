// src/app/productos/ProductImage.tsx
'use client';

interface ProductImageProps {
  src: string;
  alt: string;
}

export function ProductImage({ src, alt }: ProductImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-contain p-4 group-hover:scale-110 transition-transform"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}