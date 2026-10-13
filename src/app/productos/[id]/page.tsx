import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/products'
import ProductDetail from './product-detail'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return { title: 'Producto no encontrado' }
  }

  return {
    title: product.name,
    description: product.description || `${product.name} - $${product.price}`,
  }
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  return <ProductDetail product={product} />
}