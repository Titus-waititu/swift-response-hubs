import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { useAuthStore, type UserRole } from "@/stores/authStore";
import LandingPageHeader from "@/components/LandingPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { authAPI } from "@/lib/api";
import { loginSchema, type LoginFormValues } from "@/lib/validation-schemas";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser, setAccessToken, setError: setAuthError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError(null);
    setFieldErrors({});

    try {
      // Validate with Zod
      const validated = await loginSchema.parseAsync({ email, password });

      const response = await authAPI.login(
        validated.email.trim().toLowerCase(),
        validated.password,
      );

      const { user, tokens } = response.data || {};

      if (!tokens || !tokens.accessToken) {
        throw new Error("Invalid response: missing tokens or accessToken");
      }

      const { accessToken } = tokens;

      // Map backend roles to frontend roles
      const roleMap: Record<string, UserRole> = {
        admin: "ADMIN",
        user: "USER",
        officer: "OFFICER",
        emergency_responder: "RESPONDER",
        dispatcher: "DISPATCHER",
      };

      const normalizedUser = {
        id: user.id,
        email: user.email,
        name: user.fullName || user.name || "User",
        role: roleMap[user.role] || ("USER" as UserRole),
      };

      // Store in Zustand
      setAccessToken(accessToken);
      setUser(normalizedUser);

      // Redirect based on role
      const dashboardRoutes: Record<string, string> = {
        USER: "/dashboard/user",
        ADMIN: "/dashboard/admin",
        OFFICER: "/dashboard/officer",
        RESPONDER: "/dashboard/responder",
        DISPATCHER: "/dashboard/dispatcher",
      };

      const redirectUrl =
        dashboardRoutes[normalizedUser.role] || "/dashboard/user";
      navigate(redirectUrl);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((error) => {
          const fieldName = error.path.join(".");
          errors[fieldName] = error.message;
        });
        setFieldErrors(errors);
      } else {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again.";
        setServerError(message);
        setAuthError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LandingPageHeader />
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Main Login Card */}
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Server Error Alert */}
                {serverError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    disabled={isLoading}
                    className="h-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {fieldErrors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="h-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {fieldErrors.password && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-10"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* Forgot Password Link */}
                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    disabled={isLoading}
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot your password?
                  </button>
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 pt-4 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="text-primary hover:underline font-medium"
                    disabled={isLoading}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Personnel Note */}
          <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10 dark:border-primary/30">
            <CardContent className="pt-4">
              <p className="text-sm text-foreground/80">
                <span className="font-semibold">Emergency Personnel:</span>{" "}
                Admin accounts and special roles (Officer, Responder) are
                created by administrators only. Contact your administrator to
                create an account.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
