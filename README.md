# 🛒 MercaditoSV

> Tu mercado en línea. Encuentra todo lo que necesitas con envío gratis en tu primera compra.

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org)
[![Laravel](https://img.shields.io/badge/Laravel-12-red?logo=laravel)](https://laravel.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-purple?logo=stripe)](https://stripe.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Un **e-commerce full-stack** estilo supermercado en línea, construido con **Next.js 16** en el frontend y **Laravel 12** en el backend. Incluye búsqueda en vivo, filtros por categoría, carrito persistente, checkout real con **Stripe** y panel de historial de compras.

---

## ✨ Características

### 🎨 Frontend (Next.js 16)
- **Diseño premium** — Identidad visual propia (MercaditoSV) con paleta rojo frambuesa + ámbar
- **Búsqueda en vivo** — Dropdown de sugerencias con debounce de 300ms
- **Filtros por categoría** — Bebidas, Snacks, Postres, Lácteos, Limpieza
- **Carrito persistente** — Estado global con **Zustand** + localStorage
- **Server Actions** — Para mutaciones seguras (crear orden, pagar, logout)
- **Revalidación de caché** — Con `revalidatePath` después de cada mutación
- **100% responsive** — Mobile-first con Tailwind CSS 4
- **Toasts** — Feedback visual con **Sonner**
- **Loading skeletons** — UX fluida mientras cargan datos

### 🔐 Autenticación
- **Registro** con creación automática de `Client` + `User`
- **Login** con tokens de **Laravel Sanctum**
- **Cookies httpOnly** para el token (seguro contra XSS)
- **Cookie visible** para el usuario (para mostrar nombre en navbar)
- **Middleware** (`proxy.ts`) protege rutas privadas

### 💳 Pagos con Stripe
- **PaymentIntent** desde el backend
- **Stripe Elements** en el frontend (`<PaymentElement>`)
- Confirmación de pago con `stripe.confirmPayment()`
- Estados de orden: `pending` → `paid` → `shipped` → `delivered`
- **Modo test** con tarjeta `4242 4242 4242 4242`

### 📦 Backend (Laravel 12)
- API REST con **Sanctum**
- Recursos de API (`OrderResource`, `ProductResource`)
- Búsqueda con query params (`?search=`, `?category_id=`, `?featured=`, `?limit=`)
- Validación con **Form Requests**
- Relaciones Eloquent (`Order`, `OrderItem`, `Product`, `Category`, `Client`, `User`, `Payment`)

---

## 📸 Screenshots

> Puedes agregar tus capturas en una carpeta `docs/` y enlazarlas aquí.

| Home | Catálogo |
|------|----------|
| ![Home](docs/home.png) | ![Catálogo](docs/catalogo.png) |

| Carrito | Checkout con Stripe |
|---------|---------------------|
| ![Carrito](docs/carrito.png) | ![Checkout](docs/checkout.png) |

| Historial de compras | Login |
|----------------------|-------|
| ![Historial](docs/historial.png) | ![Login](docs/login.png) |

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Uso |
|------------|-----|
| **Next.js 16** | Framework (App Router + Turbopack) |
| **React 19** | UI |
| **TypeScript** | Tipado estático |
| **Tailwind CSS 4** | Estilos |
| **Zustand** | Estado global del carrito |
| **Stripe.js** | Pagos |
| **Lucide React** | Iconos |
| **Sonner** | Notificaciones toast |

### Backend
| Tecnología | Uso |
|------------|-----|
| **Laravel 12** | Framework |
| **Sanctum** | Autenticación por tokens |
| **Stripe PHP SDK** | PaymentIntent |
| **SQLite** | Base de datos |
| **Composer** | Gestor de dependencias |

---

## 📁 Estructura del Proyecto

```
mercaditosv/
├── tienda/                       # Frontend (Next.js 16)
│   ├── src/
│   │   ├── app/
│   │   │   ├── actions/          # Server Actions
│   │   │   │   ├── auth.ts       # login, register, logout
│   │   │   │   ├── orders.ts     # createOrder, getMyOrders, markOrderAsPaid
│   │   │   │   └── payments.ts   # createPaymentIntent
│   │   │   ├── api/search/       # Route Handler
│   │   │   ├── carrito/          # Página del carrito
│   │   │   ├── checkout/         # Checkout + Stripe
│   │   │   │   ├── page.tsx
│   │   │   │   ├── PaymentForm.tsx
│   │   │   │   └── StripeProvider.tsx
│   │   │   ├── historial/        # Historial de compras
│   │   │   ├── login/            # Login
│   │   │   ├── productos/        # Catálogo + detalle
│   │   │   ├── registro/         # Registro
│   │   │   ├── layout.tsx        # Layout raíz (Navbar + Footer)
│   │   │   ├── page.tsx          # Home
│   │   │   └── globals.css       # Design system
│   │   ├── components/
│   │   │   ├── Navbar.tsx        # Navbar con menú usuario
│   │   │   ├── NavbarSearch.tsx  # Buscador con dropdown
│   │   │   └── Footer.tsx        # Footer
│   │   └── lib/
│   │       ├── store/cartStore.ts # Zustand
│   │       └── products.ts        # API de productos
│   └── package.json
│
└── ejercicio-pedidos/            # Backend (Laravel 12)
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/      # AuthController, OrderController, ProductController, PaymentController
    │   │   ├── Requests/         # Form Requests
    │   │   └── Resources/        # API Resources
    │   └── Models/               # User, Client, Product, Category, Order, OrderItem, Payment
    ├── database/migrations/      # Migraciones
    ├── routes/api.php            # Rutas API
    └── .env                      # Configuración
```

---

## 🚀 Instalación

### Requisitos previos
- **Node.js** 20+
- **PHP** 8.2+
- **Composer**
- **pnpm** (recomendado) o npm

### 1. Clonar el repositorio

```bash
git clone https://github.com/juanwright101084-svg/mercaditosv.git
cd mercaditosv
```

### 2. Configurar el Backend (Laravel)

```bash
cd ejercicio-pedidos
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

El backend estará corriendo en `http://127.0.0.1:8000`

### 3. Configurar el Frontend (Next.js)

En otra terminal:

```bash
cd tienda
pnpm install
cp .env.example .env.local
pnpm dev
```

El frontend estará corriendo en `http://localhost:3000`

---

## 🔧 Variables de Entorno

### Backend: `ejercicio-pedidos/.env`

```env
APP_NAME=MercaditoSV
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=sqlite

# Stripe (modo test)
STRIPE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET=sk_test_xxxxxxxxxxxxx
```

### Frontend: `tienda/.env.local`

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_IMAGE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

> ⚠️ **Nota:** Las claves de Stripe son de **prueba** y no procesan pagos reales. Obtén las tuyas en https://dashboard.stripe.com/test/apikeys

---

## 💳 Probar el Pago con Stripe

Usa la tarjeta de prueba de Stripe durante el checkout:

| Campo | Valor |
|-------|-------|
| **Número** | `4242 4242 4242 4242` |
| **Fecha** | `12/34` (cualquier fecha futura) |
| **CVC** | `123` |
| **Código Postal** | `12345` |

**Más tarjetas de prueba:** https://stripe.com/docs/testing

---

## 🎯 Rutas del Frontend

| Ruta | Descripción | Protegida |
|------|-------------|-----------|
| `/` | Home con hero, categorías y destacados | ❌ |
| `/productos` | Catálogo con filtros | ❌ |
| `/productos/[id]` | Detalle de producto | ❌ |
| `/carrito` | Carrito de compras | ❌ |
| `/checkout` | Checkout con Stripe | ✅ |
| `/success` | Confirmación de pago | ✅ |
| `/historial` | Historial de compras | ✅ |
| `/login` | Iniciar sesión | ❌ |
| `/registro` | Crear cuenta | ❌ |

## 🎯 Endpoints del Backend

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/register` | Registrar usuario | ❌ |
| POST | `/api/login` | Login | ❌ |
| POST | `/api/logout` | Logout | ✅ |
| GET | `/api/products` | Listar productos (`?search=`, `?category_id=`, `?featured=`, `?limit=`) | ❌ |
| GET | `/api/products/{id}` | Detalle de producto | ❌ |
| GET | `/api/categories` | Listar categorías | ❌ |
| POST | `/api/orders` | Crear orden | ✅ |
| GET | `/api/orders` | Listar mis órdenes | ✅ |
| PUT | `/api/orders/{id}` | Actualizar orden | ✅ |
| POST | `/api/payments` | Crear PaymentIntent de Stripe | ✅ |

---

## 📦 Scripts Disponibles

### Frontend
```bash
pnpm dev        # Servidor de desarrollo
pnpm build      # Build de producción
pnpm start      # Servidor de producción
pnpm lint       # Linter
```

### Backend
```bash
php artisan serve           # Servidor de desarrollo
php artisan migrate         # Migraciones
php artisan migrate:fresh --seed  # Resetear DB con datos
php artisan tinker          # Consola interactiva
php artisan route:list      # Listar rutas
```

---

## 🏗️ Decisiones Técnicas

### ¿Por qué Server Actions en vez de API Routes?
- **Menos código** — no hay que crear endpoints separados
- **Seguridad** — el token nunca se expone al cliente
- **Revalidación integrada** — `revalidatePath` invalida caché automáticamente

### ¿Por qué Sanctum y no JWT?
- **Simplicidad** — tokens de API sin manejo de expiración
- **Primera clase en Laravel** — soporte oficial
- **Cookies httpOnly** — más seguras contra XSS que localStorage

### ¿Por qué Zustand y no Redux?
- **Menos boilerplate** — 10 líneas vs 100
- **Persistencia built-in** — `persist` middleware para localStorage
- **Tamaño** — ~1KB vs ~15KB de Redux

---

## 🌐 Deploy

### Frontend en Vercel

1. Sube el código a GitHub
2. Ve a [vercel.com](https://vercel.com) → Import Project
3. Selecciona el repo y el directorio `tienda/`
4. Configura las variables de entorno:
   ```
   NEXT_PUBLIC_API_URL=https://tu-backend.railway.app/api
   NEXT_PUBLIC_IMAGE_URL=https://tu-backend.railway.app
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
5. Deploy

### Backend en Railway

1. Ve a [railway.app](https://railway.app) → New Project
2. Conecta tu repo de GitHub (directorio `ejercicio-pedidos/`)
3. Agrega las variables de entorno (`.env`)
4. Configura el comando de start: `php artisan serve --host=0.0.0.0 --port=$PORT`
5. Deploy

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👤 Autor

**Juan Guzman**

- GitHub: [@juanwright101084-svg](https://github.com/juanwright101084-svg)
- Repositorio: [mercaditosv](https://github.com/juanwright101084-svg/mercaditosv)
- Email: juanwright101084@gmail.com

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org) — Framework de React
- [Laravel](https://laravel.com) — Framework de PHP
- [Stripe](https://stripe.com) — Procesamiento de pagos
- [Tailwind CSS](https://tailwindcss.com) — Framework de CSS
- [Lucide](https://lucide.dev) — Iconos
- [Vercel](https://vercel.com) — Hosting del frontend

---

<div align="center">

**⭐ Si te gustó este proyecto, dale una estrella en GitHub ⭐**

Hecho con ❤️ por [Juan Guzman](https://github.com/juanwright101084-svg)

</div>