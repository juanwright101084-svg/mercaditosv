import "server-only";
import { api, ApiError } from "@/lib/api";
import type { ApiItem, ApiList, Product } from "@/lib/types";

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await api<ApiList<Product>>("/products", {
      tags: ["products"],
      revalidate: 60,
    });

    // Maneja ambos formatos de respuesta
    if (Array.isArray(res)) {
      return res;
    }

    return res.data || [];
  } catch (error) {
    console.error("❌ Error fetching products:", error instanceof Error ? error.message : error);

    if (error instanceof ApiError) {
      console.error(`API Error [${error.status}]:`, error.message, error.details);
    }

    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!id) {
    console.warn("⚠️ Product ID is required");
    return null;
  }

  try {
    const res = await api<ApiItem<Product> | Product>(`/products/${id}`, {
      tags: ["products", `product-${id}`],
      revalidate: 3600, // 1 hora para productos individuales
    });

    // Maneja ambos formatos de respuesta
    if ("data" in res) {
      return res.data || null;
    }

    return res || null;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        console.warn(`⚠️ Product ${id} not found`);
        return null;
      }

      console.error(`❌ API Error [${error.status}]:`, error.message);
    } else {
      console.error("❌ Error fetching product:", error instanceof Error ? error.message : error);
    }

    return null;
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const res = await api<ApiList<Product>>(`/categories/${categoryId}`, {
      tags: ["categories", `category-${categoryId}`],
      revalidate: 60,
    });

    return res.data || [];
  } catch (error) {
    console.error(`❌ Error fetching products from category ${categoryId}:`, error);
    return [];
  }
}