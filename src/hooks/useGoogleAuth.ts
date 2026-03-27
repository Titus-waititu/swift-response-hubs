import { useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

interface GoogleCredentialResponse {
  credential: string;
}

interface DecodedGoogleToken {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

/**
 * Hook for handling Google OAuth authentication
 * Decodes the JWT token and extracts user information for local session
 */
export const useGoogleAuth = () => {
  const handleGoogleSuccess = useCallback(
    (credentialResponse: GoogleCredentialResponse | any) => {
      try {
        const credential = credentialResponse.credential;
        if (!credential) {
          throw new Error("No credential received from Google");
        }

        // Decode the JWT token without verification (public JWT)
        const decoded = jwtDecode<DecodedGoogleToken>(credential);

        // Extract user information
        const googleAuthData = {
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
          googleId: decoded.sub,
          credential: credential, // Store the full JWT for potential backend use
        };

        return googleAuthData;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to decode Google token";
        console.error("Google auth error:", errorMessage);
        toast.error(`Google sign in failed: ${errorMessage}`);
        return null;
      }
    },
    [],
  );

  return {
    handleGoogleSuccess,
  };
};
