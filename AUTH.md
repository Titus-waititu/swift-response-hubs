# Authentication & Authorization System

## Overview

This document describes the JWT-based authentication system with role-based access control (RBAC) implemented in this application.

## Architecture

### Key Components

#### 1. **Zustand Auth Store** (`src/stores/authStore.ts`)

State management for authentication:

```typescript
interface AuthState {
  user: User | null; // Current authenticated user
  accessToken: string | null; // JWT access token
  isLoading: boolean; // Loading state
  error: string | null; // Error messages

  // Actions
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

**Features:**

- Persists auth state to localStorage via Zustand persist middleware
- Auto-restores session on page reload
- Clears auth data on logout

#### 2. **API Layer** (`src/lib/api.ts`)

Axios HTTP client with JWT interceptors:

```typescript
// Automatic JWT token injection
client.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Automatic 401 error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

**API Methods:**

- `authAPI.login(email, password)` → POST `/auth/signin`
- `authAPI.register(name, email, password)` → POST `/auth/signup`
- `authAPI.getCurrentUser()` → GET `/auth/me`
- `usersAPI.createUser(name, email, role)` → POST `/users`

#### 3. **Protected Routes** (`src/components/auth/ProtectedRoute.tsx`)

Route wrapper for authentication and authorization:

```typescript
<ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
  <SomeDashboard />
</ProtectedRoute>
```

**Behavior:**

- Redirects unauthenticated users to `/login`
- Shows "Access Denied" for unauthorized roles
- Supports role-based access control

## User Roles

```typescript
type UserRole = "USER" | "ADMIN" | "OFFICER" | "RESPONDER";
```

| Role          | Registration                 | Dashboard              | Permissions                           |
| ------------- | ---------------------------- | ---------------------- | ------------------------------------- |
| **USER**      | `POST /auth/signup` (Public) | `/dashboard/user`      | Report incidents, view own reports    |
| **ADMIN**     | Admin-only                   | `/dashboard/admin`     | Create users, manage system           |
| **OFFICER**   | Admin-only                   | `/dashboard/officer`   | Manage incidents, coordinate response |
| **RESPONDER** | Admin-only                   | `/dashboard/responder` | Respond to incidents                  |

## Authentication Flow

### User Registration Flow

```
1. User visits /register
2. Submits form with: name, email, password
3. Backend: POST /auth/signup
4. Backend assigns role='USER' automatically
5. Frontend redirects to /login
6. User signs in with email & password
```

**Registration Page** (`src/pages/auth/RegisterPage.tsx`):

- ✅ Name validation
- ✅ Email format validation
- ✅ Password strength (min 8 chars)
- ✅ Password confirmation match
- ✅ Loading state & error handling
- ✅ Success screen before redirect

### User Login Flow

```
1. User visits /login (SINGLE page for all roles)
2. Submits form with: email, password
3. Backend: POST /auth/signin
4. Backend returns: { accessToken, user: { id, email, name, role, ... } }
5. Frontend stores in Zustand & localStorage
6. Redirects based on role:
   - USER → /dashboard/user
   - ADMIN → /dashboard/admin
   - OFFICER → /dashboard/officer
   - RESPONDER → /dashboard/responder
```

**Login Page** (`src/pages/auth/LoginPage.tsx`):

- ✅ Email & password fields
- ✅ Email/password validation
- ✅ Loading state during submission
- ✅ Error messages
- ✅ Role-based redirect after login
- ✅ Links to register & forgot password
- ✅ Note about emergency personnel

### Emergency Personnel Account Creation

```
1. Admin logs in and visits /dashboard/admin
2. Uses "Create Emergency Personnel Account" form
3. Fills: name, email, role (ADMIN/OFFICER/RESPONDER)
4. Submits to: POST /users
5. Backend generates temporary password (or sends email with invite)
6. Success message shows created account details
```

**Admin Dashboard** (`src/pages/dashboard/AdminDashboard.tsx`):

- ✅ Role selector dropdown (ADMIN, OFFICER, RESPONDER)
- ✅ Form validation
- ✅ Success/error toasts
- ✅ Creates user without registration link

## Protected Routes

### Route Structure

```
Public Routes:
  /                          → Landing page (public)
  /login                     → Login (all roles)
  /register                  → User registration (public)

Protected Routes (Role-Based):
  /dashboard/user            → Protected by ["USER"]
  /dashboard/admin           → Protected by ["ADMIN"]
  /dashboard/officer         → Protected by ["OFFICER"]
  /dashboard/responder       → Protected by ["RESPONDER"]

Info Routes (Public):
  /features
  /documentation
  /about
```

### Access Control

```typescript
// Example: Officer-only dashboard
<Route
  path="/dashboard/officer"
  element={
    <ProtectedRoute allowedRoles={["OFFICER"]}>
      <OfficerDashboard />
    </ProtectedRoute>
  }
/>
```

**Behaviors:**

- No token → redirect to `/login`
- Valid token, wrong role → show "Access Denied"
- Valid token, correct role → render page

## Session Management

### Storage Strategy

Auth state stored in localStorage via Zustand persist middleware:

```json
{
  "auth-store": {
    "state": {
      "user": {
        "id": "user-123",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "USER"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### Token Handling

**In-Memory:**

- Access token stored in Zustand state
- On page reload, restored from localStorage

**HTTP-Only Cookie (Optional):**

- If backend uses httpOnly cookies, Axios automatically includes them
- `withCredentials: true` configured in API client

### Logout

```typescript
// Clears state
useAuthStore.getState().logout();

// Clears localStorage
// (Zustand persist middleware handles this automatically)

// Redirects to login
navigate("/login");
```

## Error Handling

### 401 Unauthorized

Automatically handled by Axios interceptor:

```typescript
// When server returns 401:
1. Logout user (clear state & localStorage)
2. Redirect to /login
3. User must re-authenticate
```

### Network Errors

Displayed in UI:

```typescript
// LoginPage.tsx example:
catch (err: any) {
  const message = err.response?.data?.message
    || err.message
    || 'Login failed. Please try again.';
  setError(message);
}
```

## Configuration

### Environment Variables

Create `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Backend API Endpoints

**Auth Endpoints:**

```
POST /auth/signin
  Request: { email, password }
  Response: { accessToken, user: { id, email, name, role, ... } }

POST /auth/signup
  Request: { name, email, password }
  Response: { accessToken, user: { ... } }
  Note: Backend assigns role="USER" automatically

GET /auth/me
  Request: Authorization: Bearer {token}
  Response: { user: { ... } }
```

**Admin Endpoints:**

```
POST /users
  Request: { name, email, role }
  Headers: Authorization: Bearer {adminToken}
  Response: { user: { id, email, name, role, ... } }

GET /users
  Headers: Authorization: Bearer {adminToken}
  Response: { users: [...] }

PUT /users/:id
  Headers: Authorization: Bearer {adminToken}
  Request: { ...updateFields }
  Response: { user: { ... } }

DELETE /users/:id
  Headers: Authorization: Bearer {adminToken}
  Response: { success: true }
```

## Usage Examples

### In Components

```typescript
import { useAuthStore } from '@/stores/authStore';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Check authentication status
function MyComponent() {
  const { user, accessToken, login, logout } = useAuthStore();

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      Welcome, {user.name}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// Protect a route
function App() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### API Calls

```typescript
import { authAPI, usersAPI } from "@/lib/api";

// Login
await authAPI.login("user@example.com", "password");

// Register (no token needed)
await authAPI.register("John", "john@example.com", "password");

// Get current user
const response = await authAPI.getCurrentUser();

// Create user (admin only)
await usersAPI.createUser("Officer Name", "officer@example.com", "OFFICER");
```

## Security Notes

⚠️ **Important Considerations:**

1. **Never store JWT in localStorage for sensitive applications**
   - This implementation stores it for simplicity
   - For production, use httpOnly cookies + CSRF tokens

2. **HTTPS Required**
   - JWTs must be transmitted over HTTPS
   - API_BASE_URL should use https in production

3. **Token Expiration**
   - Implement token refresh mechanism for long-lived sessions
   - Current: Simple access token (add refresh token support)

4. **CORS**
   - Configure CORS on backend to accept requests from frontend domain
   - Example: `http://localhost:3000` for dev

5. **Rate Limiting**
   - Implement rate limiting on `/auth/signin` to prevent brute force
   - Recommend: 5 attempts per minute per IP

6. **Password Requirements**
   - Frontend: Min 8 characters
   - Backend: Enforce stronger requirements (uppercase, numbers, symbols)
   - Use bcrypt or similar for hashing

## Testing

### Manual Test Scenarios

```
1. User Registration
   - Navigate to /register
   - Fill form with valid data
   - Should redirect to /login

2. User Login
   - Navigate to /login
   - Enter credentials
   - Should redirect to /dashboard/user
   - Token should be in localStorage

3. Page Reload
   - After login, refresh page
   - Should stay logged in (session restored)

4. Role-Based Access
   - Login as USER, try to access /dashboard/admin
   - Should see "Access Denied"

5. Admin User Creation
   - Login as ADMIN
   - Create new OFFICER account
   - Should show success message

6. Logout
   - Click logout button
   - Should redirect to /login
   - localStorage should be cleared

7. 401 Error
   - Delete token from localStorage
   - Reload page
   - Should redirect to /login
```

## File Structure

```
src/
├── stores/
│   └── authStore.ts              # Zustand auth state management
├── lib/
│   └── api.ts                    # Axios client + interceptors
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx    # Route protection wrapper
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx         # Single login for all roles
│   │   └── RegisterPage.tsx      # User registration
│   └── dashboard/
│       ├── UserDashboard.tsx     # User dashboard
│       ├── AdminDashboard.tsx    # Admin dashboard + user creation
│       ├── OfficerDashboard.tsx  # Officer dashboard
│       └── ResponderDashboard.tsx # Responder dashboard
└── App.tsx                       # Route configuration
```

## Next Steps

1. **Backend Implementation**
   - Implement JWT authentication in NestJS
   - Database schema for users
   - Password hashing (bcrypt)
   - Role-based authorization guards

2. **Enhanced Security**
   - Refresh token implementation
   - HTTP-only cookie support
   - CSRF protection
   - Rate limiting

3. **Additional Features**
   - Password reset via email
   - Email verification on signup
   - Account settings page
   - Audit logging

## Troubleshooting

### "Not authenticated" on page reload

**Issue:** User logged in, but loses session on refresh
**Solution:** Check if `zustand/middleware` persist is working

- Verify localStorage has `auth-store` key
- Check browser console for errors

### 401 errors on API calls

**Issue:** API returns 401 even with valid token
**Solution:**

- Verify token is being sent in headers
- Check if token is expired
- Verify backend JWT secret matches

### Wrong dashboard after login

**Issue:** Login succeeds but redirects to wrong dashboard
**Solution:**

- Verify role value returned from backend
- Check role-to-dashboard mapping in LoginPage.tsx
- Review backend user creation (ensures correct role)

---

**Last Updated:** March 26, 2026
