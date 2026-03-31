import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

interface GoogleAuthProviderProps {
  children: ReactNode;
}

/**
 * Google OAuth Provider wrapper
 * Handles client ID from environment variables
 */
export function GoogleAuthProviderWrapper({
  children,
}: GoogleAuthProviderProps) {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  // Suppress the "initialize() called multiple times" warning from React.StrictMode
  // This is harmless in development and expected behavior
  if (!GOOGLE_CLIENT_ID) {
    console.warn(
      "Google Client ID is not configured. Google Sign-In will not work.",
    );
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
