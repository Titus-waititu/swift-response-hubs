import { loginWithGoogle } from "./backend-api";
import { toast } from "sonner";

/**
 * Role-based redirect mapping
 */
export const getRoleRoute = (role: string | null | undefined): string => {
  if (!role) return "/";

  const roleRouteMap: Record<string, string> = {
    USER: "/user-dashboard",
    DISPATCHER: "/dispatcher",
    RESPONDER: "/responder",
    OFFICER: "/officer-dashboard",
    ADMIN: "/admin-dashboard",
  };

  return roleRouteMap[role?.toUpperCase() || ""] || "/";
};

/**
 * Handle Google login by redirecting to backend OAuth endpoint
 */
export const handleGoogleAuthRedirect = async () => {
  try {
    await loginWithGoogle();
    // Note: loginWithGoogle redirects away, so this won't execute
    toast.success("Redirecting to Google sign-in...");
  } catch (error: any) {
    toast.error(error.message || "Google login failed");
  }
};

/**
 * Map user role string to route path
 * Used after OAuth callback
 */
export const roleToRoute = (role?: string): string => {
  return getRoleRoute(role);
};
