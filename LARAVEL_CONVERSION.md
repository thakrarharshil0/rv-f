# Laravel Conversion Status

## What Was Converted

A full Laravel backend replacement has been added at:
- `laravel-app`

The storefront continues to use the same API contract, and the app now runs against the Laravel backend.

## Laravel API Coverage

Implemented endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/health

- GET /api/products
- GET /api/products/{id}

- GET /api/cart
- POST /api/cart/items
- PATCH /api/cart/items/{itemId}
- DELETE /api/cart/items/{itemId}

- GET /api/favorites
- POST /api/favorites
- DELETE /api/favorites/{productId}

- POST /api/orders

## Auth

- JWT auth implemented using firebase/php-jwt.
- Middleware handles authenticated requests.

## Database Migration

- Laravel migrations added for users, products, carts, favorites, orders, and order_items.
- Seeder imports products from `server/data/db.json`.
- Seeded users:
  - Customer: test@example.com / secret123

## Frontend Integration Changes

- Storefront API base now defaults to `/api` (proxy-friendly).
- Main Vite proxy added to route `/api` -> Laravel (127.0.0.1:4000).
- `start.sh` launches Laravel backend on port 4000.

## Run

1. Backend (Laravel)
- cd laravel-app
- php artisan migrate:fresh --seed
- php artisan serve --host=127.0.0.1 --port=4000

2. Storefront
- npm run dev

## Notes

- Legacy Node backend is no longer required for normal operation.
- If you want a full monolith UI replacement for the React storefront, that would be a separate phase.
