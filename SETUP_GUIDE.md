# FitFloor Setup Guide

Complete development setup for the FitFloor e-commerce platform.

## Project Structure

```
FitFloor E-Commerce/
├── src/                    # Main React app (customer store)
├── laravel-app/            # Laravel backend API
├── public/                 # Static assets
├── vite.config.js          # Main app Vite config (port 5173)
└── package.json            # Main app dependencies
```

## Quick Start (2 Terminal Windows)

### Terminal 1: Start Backend Server
```bash
cd laravel-app
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=4000
```
Backend runs on: `http://localhost:4000`

### Terminal 2: Start Main Store App
```bash
npm install  # First time only
npm run dev
```
Store app runs on: `http://localhost:5173`

## API Documentation

### Base URL
- Development: `http://localhost:4000`
- All endpoints use JSON request/response bodies

### Authentication Endpoints

**Customer Register**
```
POST /api/auth/register
Body: { name, email, password }
Response: { token, user: { id, name, email, createdAt } }
```

**Customer Login**
```
POST /api/auth/login
Body: { email, password }
Response: { token, user: { id, name, email, createdAt } }
```

**Get Current User**
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: { user: { id, name, email, createdAt } }
```

### Product Endpoints

**Get All Products**
```
GET /api/products
Query: ?category=shoes&search=nike
Response: { items: [{ id, name, category, price, quantity, ... }] }
```

**Get Single Product**
```
GET /api/products/{id}
Response: { item: { id, name, category, price, quantity, ... } }
```

### Cart Endpoints (Authenticated)

**Get Cart**
```
GET /api/cart
Headers: Authorization: Bearer {token}
Response: { items: [{ userId, productId, name, price, ... }] }
```

**Add to Cart**
```
POST /api/cart/items
Headers: Authorization: Bearer {token}
Body: { productId, name, price, image, size, color, quantity }
Response: { item: { ... } }
```

**Remove from Cart**
```
DELETE /api/cart/{id}
Headers: Authorization: Bearer {token}
Response: { message: "Item removed" }
```

### Favorites Endpoints (Authenticated)

**Get Favorites**
```
GET /api/favorites
Headers: Authorization: Bearer {token}
Response: { items: [{ productId, createdAt, ... }] }
```

**Add to Favorites**
```
POST /api/favorites
Headers: Authorization: Bearer {token}
Body: { productId }
Response: { item: { ... } }
```

**Remove from Favorites**
```
DELETE /api/favorites/{productId}
Headers: Authorization: Bearer {token}
Response: { message: "Removed" }
```

### Orders Endpoints (Authenticated)

**Create Order**
```
POST /api/orders
Headers: Authorization: Bearer {token}
Body: { items: [...], total, shippingAddress }
Response: { order: { id, userId, items, total, status: 'pending', ... } }
```

## Architecture Overview

### Frontend Stack
- **React 18** with Vite
- **React Router 6** for navigation
- **CSS3** for styling with FitFloor design system
- **Context API** for state (Auth, Cart, Favorites)
- **localStorage** for persistence

### Backend Stack
- **Laravel** backend API
- **JWT** authentication with 7-day tokens
- **bcrypt** for password hashing
- **SQLite or MySQL/PostgreSQL** for persistence

## Data Persistence

The backend stores products, carts, favorites, orders, and users in the configured database.

## Frontend Features

✅ **Customer Authentication** - Register, login, persistent sessions
✅ **Product Browsing** - Categories, search, filtering
✅ **Shopping Cart** - Add/remove items, local sync to backend
✅ **Favorites** - Save favorite products
✅ **Checkout** - Place orders with shipping address
✅ **Responsive Design** - Mobile, tablet, desktop

## Development Workflow

### Making API Changes

1. Update endpoint in `laravel-app/routes/api.php`
2. Update corresponding method in the matching controller
3. Update component that calls it
4. Test with the store app or API client

### Adding New Features

**Frontend Feature:**
1. Create component in `src/components/`
2. Add page in `src/pages/` if needed
3. Add route in `src/App.jsx`
4. Use existing contexts (Auth, Cart, Favorites) or create a new one

**Backend Feature:**
1. Add endpoint to `laravel-app/routes/api.php`
2. Update database structure and seeders if needed
3. Add corresponding API controller method
4. Test with curl or Postman

## Troubleshooting

### Backend won't start
- Check if port 4000 is in use: `lsof -i :4000`
- Ensure dependencies are installed
- Check PHP version and extensions

### Frontend can't reach API
- Ensure backend is running
- Check API base URL in `src/lib/api.js` (should be `http://localhost:4000`)
- Check browser console for CORS errors

### Lost token on refresh
- Tokens are stored in localStorage automatically
- Session is restored on app startup from `AuthContext`

## Production Deployment

### Before Deploying

1. **Security**
   - Update `JWT_SECRET` environment variable
   - Enable HTTPS on production
   - Add rate limiting to API

2. **Database**
   - Use a production database server
   - Set up regular backups
   - Run migrations before deployment

3. **Environment**
   - Set production API URLs
   - Configure environment variables
   - Update CORS origins
   - Set up reverse proxy if needed

4. **Frontend**
   - Build: `npm run build`
   - Output: `dist/` folder
   - Serve via CDN or static host

5. **Backend**
   - Use production PHP runtime
   - Set up process manager or managed hosting
   - Configure logging
   - Set up monitoring and alerts

## Key Technologies

| Component | Technology | Version |
|-----------|------------|---------|
| Frontend | React | 18.x |
| Backend | Laravel | 11.x |
| Build Tool | Vite | 4.x+ |
| Router | React Router | 6.x |
| Auth | JWT | Standard |
| Styling | CSS3 | Native |

## Support & Documentation

- React: https://react.dev
- Laravel: https://laravel.com
- Vite: https://vitejs.dev
- JWT: https://jwt.io

---

**Project Setup**: FitFloor E-Commerce Platform v1.0  
**Last Updated**: 2024  
**Status**: Development ✅
