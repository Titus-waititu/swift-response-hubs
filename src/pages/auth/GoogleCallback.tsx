import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore, type UserRole } from "@/stores/authStore";
import { toast } from "sonner";

export default function GoogleCallbackHandler() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setAccessToken } = useAuthStore();

  useEffect(() => {
    async function handleGoogleCallback() {
      try {
        console.log("🔍 Google callback - processing URL params...");

        // Get tokens from URL query parameters
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");
        const role = searchParams.get("role");
        const id = searchParams.get("id");
        const email = searchParams.get("email");
        const username = searchParams.get("username");

        console.log("📝 Params received:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          role,
          id,
          email,
          username,
        });

        if (!accessToken || !refreshToken || !role) {
          throw new Error("Missing token, refreshToken, or role from backend");
        }

        const roleMap: Record<string, UserRole> = {
          admin: "ADMIN",
          officer: "OFFICER",
          responder: "RESPONDER",
          dispatcher: "DISPATCHER",
          user: "USER",
        };

        const userData = {
          id: id || "",
          email: email || "",
          name: username || "User",
          role: (roleMap[role.toLowerCase()] || "USER") as UserRole,
        };

        console.log("💾 Saving user data to store...", userData);
        setAccessToken(accessToken);
        setUser(userData);

        // Store tokens for later use
        localStorage.setItem(
          "auth-tokens",
          JSON.stringify({
            accessToken,
            refreshToken,
          }),
        );

        toast.success("Google login successful!");
        const redirectPath =
          role.toLowerCase() === "admin"
            ? "/dashboard/admin"
            : role.toLowerCase() === "officer"
              ? "/dashboard/officer"
              : role.toLowerCase() === "responder"
                ? "/dashboard/responder"
                : role.toLowerCase() === "dispatcher"
                  ? "/dashboard/dispatcher"
                  : "/dashboard/user";

        console.log("🔄 Redirecting to:", redirectPath);
        navigate(redirectPath, { replace: true });
      } catch (err) {
        console.error("❌ Google login error:", err);
        toast.error("Google login failed. Please try again.");
        navigate("/auth/login", { replace: true });
      }
    }

    handleGoogleCallback();
  }, [navigate, searchParams, setUser, setAccessToken]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <p className="text-lg font-semibold text-muted-foreground">
        Logging in with Google...
      </p>
    </div>
  );
}
