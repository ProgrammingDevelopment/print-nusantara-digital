# Elka Grafika Printing

## Project Overview

`elka-grafika-printing` is a modern React + TypeScript storefront built with Vite, Tailwind CSS, shadcn-ui, and Supabase. It supports authenticated browsing, product catalog filtering, cart checkout, profile management, and serverless Vercel API endpoints for product, order, auth, and event-driven operations.

## Architecture

```mermaid
flowchart TD
  subgraph Frontend
    A[Browser / User Client]
    B[React SPA (Vite)]
    A --> B
    B --> C[Supabase Client SDK]
    B --> D[API Routes /api/*]
  end

  subgraph Backend
    D --> E[Vercel Serverless Functions]
    E --> F[Supabase Admin / Database]
    E --> G[In-memory SSE Event Bus]
  end

  subgraph DataStore
    F --> H[products table]
    F --> I[orders table]
    F --> J[order_items table]
    F --> K[profiles table]
    F --> L[cart_items table]
  end

  A -.->|Geolocation| M[Region Selector]
  M --> B
  E -.->|X-Admin-Token / Bearer Token| S[Security Middleware]
```

## Core Features

- Authenticated sign-up / sign-in via Supabase, with profile row creation.
- Product browsing with category filtering, search, and pagination.
- Cart management with quantity updates and checkout flow.
- Order creation and admin-safe order CRUD.
- User profile editing for address, phone, and customer details.
- SSE event stream support via `/api/events` for realtime notifications.
- Geo-aware API endpoint selection logic in `src/lib/load-balancer.ts`.

## API Endpoints

### `api/auth/signup`
- Creates a Supabase user with `email_confirm: true`.
- Creates a matching `profiles` row in Supabase.
- Returns created user metadata.

### `api/auth/signin`
- Validates email/password via Supabase admin session call.
- Returns a session object that the client sets locally.

### `api/products`
- `GET`: read products with category, search, limit, offset filters.
- `POST`, `PUT`, `PATCH`, `DELETE`: admin CRUD protected by `ADMIN_API_TOKEN`.

### `api/orders`
- `GET`: paginated orders with nested `order_items(*, products(*))` to avoid N+1 queries.
- `POST`: creates an order and batched order item inserts.
- `PUT/PATCH`: updates order records.
- `DELETE`: deletes orders.

### `api/events`
- Opens a Server-Sent Events stream for frontend subscriptions.
- Includes heartbeat support to keep local connections alive.

## Methods and Algorithms

### GEO load balancing

- `src/lib/load-balancer.ts` uses browser geolocation to compute the nearest region endpoint.
- It applies the Haversine formula to measure distance between the user and each candidate region.
- The nearest endpoint is selected for API traffic when `VITE_API_REGIONS` is configured.

### Product catalog performance

- Product reads are paginated with `limit` and `offset` to keep query complexity low.
- Search is executed using Supabase full-text filters via `ilike`.
- Category filters are applied before pagination.

### Order & N+1 prevention

- Order reads use a nested Supabase select:
  - `order_items(*, products(*))`
- This fetches order items and associated product details in one database request.
- Order creation inserts the order first, then inserts all order items in a single batched insert.

### API security

- `api/_lib/security.ts` validates header tokens using constant-time comparison.
- CORS is enabled for `GET, POST, PUT, PATCH, DELETE, OPTIONS` in `api/_lib/http.ts`.
- The API helper rejects unsupported methods and returns structured JSON errors.

## Project Structure

```text
src/
  App.tsx               # Route definitions and app shell
  main.tsx              # React entrypoint
  pages/                # Page-level UI views
    Auth.tsx
    ProductsDB.tsx
    Cart.tsx
    Orders.tsx
    Profile.tsx
  components/           # UI components and layout
  integrations/         # Supabase client and typed database schema
  lib/                  # Helpers, API wrapper, formatter, load balancer
  hooks/                # Reusable auth and cart hooks
api/
  auth/                 # Auth serverless endpoints
  products.ts           # Product API route
  orders.ts             # Order API route
  events.ts             # SSE endpoint
  webhooks/             # Webhook receivers
  _lib/                 # Shared API utilities and security helpers
```
```

## Deployment Notes

- Local development: `npm run dev`
- Vercel local mode: `npm run dev:vercel`
- Production build: `npm run build`

## Environment Variables

Required:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_API_TOKEN`
- `WEBHOOK_SECRET`

Optional:

- `EVENTS_CLIENT_TOKEN`
- `VITE_EVENTS_CLIENT_TOKEN`
- `VITE_API_REGIONS`
- `VITE_API_REGION` (override by region name or area)

### Example VITE_API_REGIONS

```env
VITE_API_REGIONS=[
  {
    "region": "asia-southeast1",
    "area": "South East Asia",
    "url": "https://asia.elka-grafika-printing.com",
    "lat": -6.2,
    "lon": 106.8
  },
  {
    "region": "europe-west1",
    "area": "Europe",
    "url": "https://eu.elka-grafika-printing.com",
    "lat": 50.0,
    "lon": 8.0
  },
  {
    "region": "us-central1",
    "area": "North America",
    "url": "https://us.elka-grafika-printing.com",
    "lat": 39.0,
    "lon": -98.0
  }
]
```

```env
VITE_API_REGION=asia-southeast1
```

## Package Name Update

This repository now uses the package name `elka-grafika-printing` in `package.json`.

## Notes

- The frontend is built as a React SPA with page routing handled by `react-router-dom`.
- Supabase auth state is managed with a custom `useAuth` hook.
- The profile page is authenticated and redirects unauthenticated users to `/auth`.
- For production-grade multi-region event delivery, replace the in-memory SSE bus with a durable pub/sub system.
