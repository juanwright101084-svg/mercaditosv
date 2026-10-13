// src/app/productos/[id]/product-detail.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { useCartStore } from '@/lib/store/cartStore'
import { Heart, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: string | number
  stock: number
  category: { id: number; name: string }
  description?: string
  image?: string
  is_featured?: boolean
}

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)

  const productId = params.id

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `http://127.0.0.1:8000/api/products/${productId}`
        )

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo cargar el producto`)
        }

        const data = await response.json()
        setProduct(data.data || data)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity,
      stock: product.stock,
      category: product.category?.name,
      image: product.image,
    })

    toast.success('¡Añadido al carrito!', {
      description: `${product.name} (x${quantity})`,
      action: {
        label: 'Ver carrito',
        onClick: () => router.push('/carrito'),
      },
      duration: 3500,
    })

    setQuantity(1)
  }

  const handleToggleFavorite = () => {
    if (!product) return

    const newState = !isFavorite
    setIsFavorite(newState)

    if (newState) {
      toast.info('Guardado en favoritos', {
        description: product.name,
        duration: 2500,
      })
    } else {
      toast('Eliminado de favoritos', {
        description: product.name,
        duration: 2500,
      })
    }
  }

  const handleQuantityChange = (value: number) => {
    if (product && value > 0 && value <= product.stock) {
      setQuantity(value)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-8">
            <div className="h-8 w-32 bg-stone-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-stone-200 rounded-2xl animate-pulse" />
              <div className="space-y-4">
                <div className="h-8 w-48 bg-stone-200 rounded animate-pulse" />
                <div className="h-6 w-32 bg-stone-200 rounded animate-pulse" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 bg-stone-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-8 sm:px-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">
            {error || 'Producto no encontrado'}
          </p>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            <ArrowLeft size={20} />
            Volver al catálogo
          </Link>
        </div>
      </main>
    )
  }

  const imagen = product.image?.replace(/\\\//g, '/')

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8 text-stone-900 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200">
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-gradient-to-br from-indigo-100 to-violet-50 rounded-xl overflow-hidden flex items-center justify-center border border-stone-200">
              {imagen && !imageError ? (
                <img
                  src={`http://127.0.0.1:8000${imagen}`}
                  alt={product.name}
                  className="h-full w-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-7xl animate-bounce">📦</span>
              )}
            </div>
            {product.is_featured && (
              <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full text-center">
                ⭐ Producto Destacado
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-2">
                  {product.category?.name || 'Sin categoría'}
                </p>
                <h1 className="text-4xl font-extrabold text-stone-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              {product.description && (
                <p className="text-stone-600 leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="border-t border-b border-stone-200 py-4 space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-indigo-600">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <span className="text-sm text-stone-500">USD</span>
                </div>
                <p
                  className={`text-sm font-semibold ${
                    product.stock > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} unidades disponibles`
                    : 'Producto Agotado'}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              {product.stock > 0 ? (
                <>
                  <div className="flex items-center gap-4 bg-stone-100 rounded-lg p-2">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus size={20} className="text-stone-600" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value) || 1)
                      }
                      className="w-16 text-center font-bold bg-transparent border-0 text-stone-900"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus size={20} className="text-stone-600" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCart size={20} />
                    Añadir al Carrito
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full bg-stone-300 text-stone-600 font-bold py-3 px-4 rounded-lg cursor-not-allowed"
                >
                  Producto Agotado
                </button>
              )}

              <button
                onClick={handleToggleFavorite}
                className={`w-full border-2 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  isFavorite
                    ? 'bg-red-50 border-red-500 text-red-600'
                    : 'border-stone-200 text-stone-600 hover:border-red-500'
                }`}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? 'Guardado' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200">
          <h2 className="text-2xl font-bold mb-4">Más Productos</h2>
          <Link
            href="/productos"
            className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
          >
            Ver todo el catálogo →
          </Link>
        </div>
      </div>
    </main>
  )
}