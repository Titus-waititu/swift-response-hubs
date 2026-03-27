# Quick Start Guide - JWT Authentication System

## Prerequisites

- Node.js & pnpm installed
- Backend API running at `http://localhost:3000/api` (or configured API_BASE_URL)
- `.env` file configured

## Configuration

### 1. Set Environment Variables

Create or update `.env`:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Running the Application

### Development

```bash
# Install dependencies
pnpm install

# Start dev server (runs on http://localhost:8081)
pnpm dev
```

### Production Build

```bash
# Build for production
pnpm build

# Preview build locally
pnpm preview
```

## Testing the Auth System

### 1. User Registration

**URL:** `http://localhost:8081/register`

**Steps:**

1. Fill in name, email, password (min 8 chars)
2. Confirm password
3. Click "Sign Up"
4. Should see success message
5. Will redirect to `/login` after 2 seconds

**Expected Result:** User created with role="USER"

### 2. User Login

**URL:** `http://localhost:8081/login`

**Steps:**

1. Enter email and password
2. Click "Sign In"
3. Loading state appears while authenticating
4. On success: redirected to `/dashboard/user` (for USER role)
5. Check browser localStorage: key `auth-store` should contain token & user data

**Expected Result:** Token stored in localStorage, user redirected to dashboard

### 3. Session Persistence

**Steps:**

1. After logging in, refresh the page (F5)
2. Should remain logged in (session restored from localStorage)
3. Should NOT see redirect to login

**Expected Result:** Session persists across page reloads

### 4. Admin User Creation (Requires Admin Account)

**URL:** `http://localhost:8081/dashboard/admin`

**Steps:**

1. Login as ADMIN user
2. Fill "Create Emergency Personnel Account" form:
   - Name: Officer Name
   - Email: officer@example.com
   - Role: (select OFFICER or RESPONDER)
3. Click "Create Account"
4. Should see success toast

**Expected Result:** New user created with specified role

### 5. Role-Based Access Control

**Steps:**

1. Login as USER role
2. Try to access `/dashboard/admin` manually in URL
3. Should see "Access Denied" message
4. Return to `/dashboard/user`

**Expected Result:** Unauthorized access blocked, friendly error message shown

### 6. Logout

**Steps:**

1. On any dashboard page, click "Logout" button
2. Should redirect to `/login`
3. Check localStorage: `auth-store` should be empty

**Expected Result:** Session cleared, redirected to login

## Testing with Mock Backend

If you don't have a running backend yet, you can mock API responses:

### Option 1: Use Mock Service Worker (MSW)

1. Install MSW: `pnpm add -D msw`
2. Create `src/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/auth/signin", async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      accessToken: "mock-token-" + Date.now(),
      user: {
        id: "1",
        email: body.email,
        name: "Mock User",
        role: "USER",
      },
    });
  }),

  http.post("/api/auth/signup", async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      accessToken: "mock-token-" + Date.now(),
      user: {
        id: "2",
        email: body.email,
        name: body.name,
        role: "USER",
      },
    });
  }),

  http.post("/api/users", async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      user: {
        id: Math.random().toString(),
        email: body.email,
        name: body.name,
        role: body.role,
      },
    });
  }),
];
```

3. Setup MSW in `src/main.tsx`:

```typescript
import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers";

const server = setupServer(...handlers);
server.listen();
```

### Option 2: Browser DevTools Network Interception

Use Chrome DevTools to mock responses by editing network requests.

## Common Issues & Solutions

### Issue: "Not authenticated" after login

**Cause:** Token not being stored
**Solution:**

1. Check browser console for errors
2. Check localStorage has `auth-store` key
3. Verify API_BASE_URL is correct in `.env`

### Issue: API returns "Cannot find module 'zustand'"

**Cause:** Dependencies not installed
**Solution:**

```bash
pnpm install
```

### Issue: Forever loading on login

**Cause:** API not responding
**Solution:**

1. Verify backend is running on the configured URL
2. Check API_BASE_URL in `.env`
3. Check browser console for network errors
4. Ensure CORS is enabled on backend

### Issue: Get redirected to /login after every action

**Cause:** 401 error (token expired or invalid)
**Solution:**

1. Check if backend is validating JWT correctly
2. Verify backend JWT secret matches frontend expectations
3. Check token expiration time

### Issue: Admin button not visible in dashboard

**Cause:** You're not logged in as ADMIN role
**Solution:**

1. Create ADMIN account via backend (or mock)
2. Login with ADMIN account
3. Navigate to `/dashboard/admin`

## File Locations

```
src/
├── stores/
│   └── authStore.ts              # Zustand auth state
├── lib/
│   └── api.ts                    # Axios + interceptors
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx    # Route protection
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx         # Login (all roles)
│   │   └── RegisterPage.tsx      # User registration
│   └── dashboard/
│       ├── UserDashboard.tsx
│       ├── AdminDashboard.tsx
│       ├── OfficerDashboard.tsx
│       └── ResponderDashboard.tsx
└── App.tsx                       # Routes

Configuration:
├── .env                          # Environment variables
├── .env.example                  # Example env template
├── AUTH.md                       # Full authentication docs
└── QUICK_START.md                # This file
```

## API Endpoints Reference

### Authentication

```
POST /auth/signin
  Body: { email, password }
  Response: { accessToken, user }
  Status: 200 OK | 401 Unauthorized | 400 Bad Request

POST /auth/signup
  Body: { name, email, password }
  Response: { accessToken, user }
  Status: 200 OK | 400 Bad Request | 409 Conflict (email exists)

GET /auth/me
  Headers: Authorization: Bearer {token}
  Response: { user }
  Status: 200 OK | 401 Unauthorized
```

### User Management (Admin Only)

```
POST /users
  Headers: Authorization: Bearer {adminToken}
  Body: { name, email, role }
  Response: { user }
  Status: 200 OK | 401 Unauthorized | 403 Forbidden

GET /users
  Headers: Authorization: Bearer {adminToken}
  Response: { users: [...] }
  Status: 200 OK | 401 Unauthorized | 403 Forbidden

PUT /users/:id
  Headers: Authorization: Bearer {adminToken}
  Body: { ...updates }
  Response: { user }
  Status: 200 OK | 404 Not Found | 403 Forbidden

DELETE /users/:id
  Headers: Authorization: Bearer {adminToken}
  Response: { success: true }
  Status: 200 OK | 404 Not Found | 403 Forbidden
```

## Debugging

### Enable Console Logging

Add to `src/lib/api.ts`:

```typescript
// Request logging
client.interceptors.request.use((config) => {
  console.log("API Request:", config.url, config);
  return config;
});

// Response logging
client.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);
```

### Check Auth State

In browser console:

```javascript
// Check Zustand state
import { useAuthStore } from "./stores/authStore";
const state = useAuthStore.getState();
console.log(state);

// Check localStorage
console.log(JSON.parse(localStorage.getItem("auth-store")));
```

## Support

For issues or questions, refer to `AUTH.md` for detailed documentation.

---

**Last Updated:** March 26, 2026
