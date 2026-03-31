import { ReactNode } from "react";

interface GoogleAuthProviderProps {
  children: ReactNode;
}

/**
 * Google Auth Provider wrapper
 * Note: We now use server-side OAuth redirect instead of client-side GoogleLogin
 * This wrapper is kept for backward compatibility but doesn't wrap with GoogleOAuthProvider
 */
export function GoogleAuthProviderWrapper({
  children,
}: GoogleAuthProviderProps) {
  // Server-side OAuth redirect handles authentication
  // No client-side GoogleOAuthProvider needed
  return <>{children}</>;
}
