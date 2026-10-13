'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

// URL para las imágenes (SIN /api)
const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL ?? 'http://127.0.0.1:8000'

export default function CarritoPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore()
  const [removingId, setRemovingId] = useState<number | null>(null)

  const handleRemove = (id: number) => {
    setRemovingId(id)
    setTimeout(() => {
      removeItem(id)
      setRemovingId(null)
    }, 300)
  }

  if (items.length === 0) {
    return (
      <main className='min-h-screen bg-gradient-to-b from-stone-50 to-white px-4 py-12 text-stone-900 sm:px-6'>
        <div className='mx-auto max-w-2xl'>
          <div className='rounded-3xl border-2 border-dashed border-stone-300 bg-white p-12 text-center shadow-sm'>
            <div className='mb-4 text-6xl'>🛒</div>
            <h2 className='text-2xl font-extrabold text-stone-900'>Tu carrito está vacío</h2>
            <p className='mt-3 text-stone-600'>
              Comienza a agregar productos y disfruta de nuestras ofertas
            </p>
            <Link
              href='/productos'
              className='mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-3 font-bold text-white transition hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800'
            >
              <ShoppingBag size={20} />
              Ver catálogo
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const total = getTotal()
  const impuesto = total * 0.16
  const totalConImpuesto = total + impuesto

  return (
    <main className='min-h-screen bg-stone-50 px-4 py-8 text-stone-900 sm:px-6 lg:py-12'>
      <div className='mx-auto max-w-6xl'>
        {/* Header */}
        <div className='mb-8'>
          <Link
            href='/productos'
            className='mb-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition hover:text-indigo-700'
          >
            <ArrowLeft size={16} />
            Volver al catálogo
          </Link>
          <h1 className='text-4xl font-extrabold'>🛒 Mi carrito</h1>
          <p className='mt-2 text-stone-600'>
            {items.length} producto{items.length !== 1 ? 's' : ''} en tu carrito
          </p>
        </div>

        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Lista de productos */}
          <div className='lg:col-span-2'>
            <div className='space-y-4'>
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-300 ${
                    removingId === item.id ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  <div className='flex gap-4 md:gap-6'>
                    {/* Imagen */}
                    <div className='flex-shrink-0'>
                      {item.image ? (
                        <div className='flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-stone-100 md:h-28 md:w-28'>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`${IMAGE_URL}${item.image}`}
                            alt={item.name}
                            className='h-full w-full object-contain p-2'
                            onError={(e) => {
                              console.error(
                                '❌ Error imagen:',
                                e.currentTarget.src
                              )
                              e.currentTarget.style.display = 'none'
                              const parent = e.currentTarget
                                .parentElement as HTMLElement
                              if (parent) {
                                parent.innerHTML =
                                  '<span class="text-3xl">🛍️</span>'
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className='flex h-24 w-24 items-center justify-center rounded-xl bg-stone-100 text-3xl md:h-28 md:w-28'>
                          🛍️
                        </div>
                      )}
                    </div>

                    {/* Info del producto */}
                    <div className='flex-1'>
                      <Link
                        href={`/productos/${item.id}`}
                        className='text-lg font-bold text-stone-900 transition hover:text-indigo-600'
                      >
                        {item.name}
                      </Link>
                      {item.category && (
                        <p className='mt-1 text-xs font-medium uppercase tracking-wide text-indigo-600'>
                          {item.category}
                        </p>
                      )}
                      <p className='mt-3 text-2xl font-extrabold text-amber-600'>
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    {/* Cantidad */}
                    <div className='flex flex-col items-center justify-between'>
                      <div className='flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 p-2'>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className='h-8 w-8 rounded font-bold text-stone-600 transition hover:bg-stone-200 disabled:opacity-30'
                        >
                          −
                        </button>
                        <span className='w-6 text-center font-bold text-stone-900'>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= 999}
                          className='h-8 w-8 rounded font-bold text-stone-600 transition hover:bg-stone-200 disabled:opacity-30'
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className='mt-4 text-right'>
                        <p className='text-sm text-stone-500'>Subtotal</p>
                        <p className='text-xl font-bold text-stone-900'>
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Eliminar */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className='text-red-500 transition hover:text-red-700 hover:bg-red-50 rounded-lg p-2'
                      title='Eliminar del carrito'
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón limpiar carrito */}
            <button
              onClick={() => {
                if (
                  confirm('¿Estás seguro de que quieres vaciar el carrito?')
                ) {
                  clearCart()
                }
              }}
              className='mt-6 w-full rounded-lg border-2 border-dashed border-red-300 bg-red-50 py-3 font-semibold text-red-600 transition hover:bg-red-100'
            >
              Vaciar carrito
            </button>
          </div>

          {/* Resumen de compra */}
          <div className='h-fit'>
            <div className='rounded-2xl border border-stone-200 bg-white p-6 shadow-sm'>
              <h2 className='mb-4 text-xl font-bold text-stone-900'>Resumen</h2>

              <div className='space-y-3 border-b border-stone-200 pb-4'>
                <div className='flex justify-between text-sm'>
                  <span className='text-stone-600'>Subtotal</span>
                  <span className='font-semibold text-stone-900'>
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-stone-600'>Impuestos (16%)</span>
                  <span className='font-semibold text-stone-900'>
                    ${impuesto.toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-stone-600'>Envío</span>
                  <span className='font-semibold text-emerald-600'>GRATIS</span>
                </div>
              </div>

              <div className='mt-4 flex justify-between text-2xl font-extrabold'>
                <span>Total:</span>
                <span className='text-amber-600'>
                  ${totalConImpuesto.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className='mt-6 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-bold text-white transition hover:shadow-lg hover:from-amber-600 hover:to-amber-700'
              >
                Proceder al pago →
              </button>

              <Link
                href='/productos'
                className='mt-3 block w-full rounded-lg border-2 border-stone-200 bg-white py-3 text-center font-semibold text-stone-900 transition hover:border-indigo-600 hover:text-indigo-600'
              >
                Seguir comprando
              </Link>

              {/* Métodos de pago */}
              <div className='mt-6 space-y-2 border-t border-stone-200 pt-6'>
                <p className='text-xs font-semibold uppercase tracking-wide text-stone-600'>
                  Métodos de pago
                </p>
                <div className='flex gap-2 text-2xl'>
                  <span title='Tarjeta de crédito'>💳</span>
                  <span title='PayPal'>🅿️</span>
                  <span title='Transferencia bancaria'>🏦</span>
                  <span title='Stripe'>💰</span>
                </div>
              </div>

              {/* Seguridad */}
              <div className='mt-6 rounded-lg bg-emerald-50 p-3'>
                <p className='text-xs font-semibold text-emerald-900'>
                  ✓ Compra 100% segura con SSL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}