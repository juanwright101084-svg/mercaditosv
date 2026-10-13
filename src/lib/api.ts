import "server-only";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_BASE_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

type ApiOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
  auth?: boolean; // adjunta el token de la cookie "session"
  tags?: string[]; // para revalidateTag()
  revalidate?: number | false; // segundos de caché
};

export async function api<T>(
  path: string,
  { auth = false, tags, revalidate, headers, ...init }: ApiOptions = {},
): Promise<T> {
  if (!BASE_URL) throw new Error("Falta API_BASE_URL en .env.local");

  const h = new Headers(headers);
  h.set("Accept", "application/json");
  if (init.body && !h.has("Content-Type")) {
    h.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = (await cookies()).get("session")?.value;
    if (token) h.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: h,
    next: { tags, revalidate },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.message ?? `Error ${res.status} al llamar a ${path}`,
      data,
    );
  }

  return data as T;
}