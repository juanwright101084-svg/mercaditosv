// src/lib/store/cartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  stock: number
  category?: string
  image?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  getTotal: () => number
  getTotalItems: () => number
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        const items = get().items
        const existingItem = items.find((i) => i.id === item.id)
        const safeQuantity = Number(item.quantity) || 1
        const safePrice = Number(item.price) || 0
        const safeStock = Number(item.stock) || 999

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    quantity: Math.min(
                      (Number(i.quantity) || 0) + safeQuantity,
                      Number(i.stock) || safeStock
                    ),
                  }
                : i
            ),
          })
        } else {
          set({
            items: [
              ...items,
              {
                ...item,
                price: safePrice,
                quantity: safeQuantity,
                stock: safeStock,
              },
            ],
          })
        }
      },

      removeItem: (id: number) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },

      updateQuantity: (id: number, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: Math.min(
                    quantity,
                    Number(item.stock) || 999
                  ),
                }
              : item
          ),
        })
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          return total + (Number(item.price) || 0) * (Number(item.quantity) || 0)
        }, 0)
      },

      getTotalItems: () => {
        return get().items.reduce(
          (sum, item) => sum + (Number(item.quantity) || 0),
          0
        )
      },

      clearCart: () => {
        set({ items: [] })
      },
    }),
    {
      name: 'cart-storage',
      version: 2, // ← Incrementar versión fuerza migración
      migrate: (persistedState: any, version: number) => {
        // Cualquier versión anterior: limpiar items con datos inválidos
        if (version < 2) {
          const rawItems = persistedState?.state?.items ?? []
          const cleanedItems = rawItems
            .filter((item: any) => item && item.id != null)
            .map((item: any) => ({
              id: Number(item.id),
              name: String(item.name ?? 'Producto'),
              price: Number(item.price) || 0,
              quantity: Number(item.quantity) || 1,
              stock: Number(item.stock) || 999,
              category: item.category,
              image: item.image,
            }))
          return { state: { items: cleanedItems }, version: 2 }
        }
        return persistedState
      },
    }
  )
)