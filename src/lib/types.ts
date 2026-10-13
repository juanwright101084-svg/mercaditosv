export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number | string;
  stock: number;
  is_featured: boolean | number;
  category: Category | null;
};

export type ApiList<T> = { data: T[] };
export type ApiItem<T> = { data: T };