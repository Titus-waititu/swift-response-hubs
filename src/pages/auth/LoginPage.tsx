import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
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
import { AlertCircle } from "lucide-react";
import { authAPI } from "@/lib/api";
import { loginWithGoogle } from "@/lib/backend-api";
import { loginSchema, type LoginFormValues } from "@/lib/validation-schemas";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser, setAccessToken, setError: setAuthError } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Redirecting to Google sign-in...");
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
    }
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginFormValues,
    onSubmit: async ({ value }) => {
      const parsed = loginSchema.safeParse(value);
      if (!parsed.success) {
        // Show all validation errors in a toast
        const errors = parsed.error.flatten().fieldErrors;
        const errorMessages = Object.values(errors).flat().filter(Boolean);
        toast.error(
          errorMessages.join("\n") || "Please fix the errors in the form.",
        );
        return {
          success: false,
          errors,
        };
      }
      setServerError(null);
      try {
        const response = await authAPI.login(
          parsed.data.email.trim().toLowerCase(),
          parsed.data.password,
        );

        const { user, tokens } = response.data || response;

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
        toast.success("Login successful!");

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
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Login failed. Please try again.";

        // Show user-friendly message for invalid credentials
        if (
          err.response?.status === 401 ||
          message.toLowerCase().includes("unauthorized") ||
          message.toLowerCase().includes("invalid")
        ) {
          setServerError("Invalid email or password");
          setAuthError("Invalid email or password");
          toast.error("Invalid email or password");
        } else {
          setServerError(message);
          setAuthError(message);
          toast.error(message);
        }
      }
    },
  });

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
              <form.Subscribe>
                {({ isSubmitting }) => (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.handleSubmit();
                    }}
                    className="space-y-4"
                  >
                    {/* Server Error Alert */}
                    {serverError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{serverError}</AlertDescription>
                      </Alert>
                    )}

                    {/* Email Field */}
                    <form.Field
                      name="email"
                      validators={{
                        onChange: ({ value }) =>
                          loginSchema.shape.email.safeParse(value).success
                            ? undefined
                            : "Invalid email address",
                      }}
                    >
                      {(field) => (
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium"
                          >
                            Email
                          </Label>
                          <Input
                            id="email"
                            name={field.name}
                            type="email"
                            placeholder="you@example.com"
                            disabled={isSubmitting}
                            className={`h-10 ${
                              field.state.meta.errors.length
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            }`}
                            value={String(field.state.value || "")}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(() => e.target.value as any)
                            }
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                              {field.state.meta.errors.join(", ")}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>

                    {/* Password Field */}
                    <form.Field
                      name="password"
                      validators={{
                        onChange: ({ value }) =>
                          loginSchema.shape.password.safeParse(value).success
                            ? undefined
                            : "Password must be at least 6 characters",
                      }}
                    >
                      {(field) => (
                        <div className="space-y-2">
                          <Label
                            htmlFor="password"
                            className="text-sm font-medium"
                          >
                            Password
                          </Label>
                          <Input
                            id="password"
                            name={field.name}
                            type="password"
                            placeholder="••••••••"
                            disabled={isSubmitting}
                            className={`h-10 ${
                              field.state.meta.errors.length
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            }`}
                            value={String(field.state.value || "")}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(() => e.target.value as any)
                            }
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                              {field.state.meta.errors.join(", ")}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full h-10"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <>Logging in...</> : "Sign In"}
                      </Button>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-center">
                      <button
                        type="button"
                        className="text-sm text-primary hover:underline mt-2"
                        disabled={isSubmitting}
                        onClick={() => navigate("/forgot-password")}
                      >
                        Forgot your password?
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                      <Separator className="my-4" />
                      <div className="absolute inset-x-0 top-1/2 flex justify-center">
                        <span className="bg-background px-2 text-xs text-muted-foreground">
                          Or
                        </span>
                      </div>
                    </div>

                    {/* Google Login */}
                    <div className="flex items-center justify-center rounded-lg border border-primary/20 bg-white dark:bg-slate-800 p-4 min-h-16 dark:border-primary/30">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleLogin}
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        Sign in with Google
                      </Button>
                    </div>
                  </form>
                )}
              </form.Subscribe>

              {/* Sign Up Link */}
              <div className="mt-6 pt-4 border-t text-center">
                <form.Subscribe selector={(state) => [state.isSubmitting]}>
                  {([isSubmitting]) => (
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="text-primary hover:underline font-medium"
                        disabled={isSubmitting}
                      >
                        Sign up
                      </button>
                    </p>
                  )}
                </form.Subscribe>
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
