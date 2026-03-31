import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Navigation } from "@/components/premium/Navigation";
import { Footer } from "@/components/premium/Footer";
import { signInToBackend } from "@/lib/backend-api";
import { loginSchema } from "@/lib/validation-schemas";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

const USER_SESSION_KEY = "swift-response-hub/user-session/v1";

interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: string;
  accessToken: string;
  refreshToken?: string;
}

export default function UserLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { handleGoogleSuccess } = useGoogleAuth();

  // Redirect if already logged in
  useEffect(() => {
    const session = window.localStorage.getItem(USER_SESSION_KEY);
    if (session) {
      navigate("/user-dashboard");
    }
  }, [navigate]);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setError("");

      const parsed = loginSchema.safeParse(value);
      if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        const errorMessages = Object.values(errors).flat().filter(Boolean);
        toast.error(
          errorMessages.join("\n") || "Please fix the errors in the form.",
        );
        return;
      }

      try {
        const authResponse = await signInToBackend(
          parsed.data.email.trim().toLowerCase(),
          parsed.data.password,
        );

        if (authResponse.success && authResponse.user && authResponse.tokens) {
          const session: UserSession = {
            userId: authResponse.user.id,
            email: authResponse.user.email,
            name: authResponse.user.fullName,
            role: authResponse.user.role,
            accessToken: authResponse.tokens.accessToken,
            refreshToken: authResponse.tokens.refreshToken,
          };

          window.localStorage.setItem(
            USER_SESSION_KEY,
            JSON.stringify(session),
          );
          toast.success(`Welcome back, ${authResponse.user.fullName}!`);
          navigate("/user-dashboard");
        } else {
          setError(authResponse.message || "Login failed");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Login failed. Please try again.",
        );
      }
    },
  });

  const handleGoogleLogin = (credentialResponse: any) => {
    const googleAuthData = handleGoogleSuccess(credentialResponse);
    if (googleAuthData) {
      // Store user session without Google JWT (won't work with backend API)
      const session: UserSession = {
        userId: googleAuthData.googleId,
        email: googleAuthData.email,
        name: googleAuthData.name || "User",
        role: "user",
        accessToken: "", // Don't store Google JWT
        refreshToken: undefined,
      };
      window.localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
      window.localStorage.setItem(
        "google-auth-session",
        JSON.stringify({ googleId: googleAuthData.googleId, email: googleAuthData.email, isGoogleAuth: true }),
      );
      toast.success(`Welcome back, ${googleAuthData.name}!`);
      navigate("/user-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-950 flex flex-col">
      <Navigation />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white dark:bg-blue-900 rounded-lg border border-blue-100 dark:border-blue-800 shadow-lg p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-teal-700 dark:bg-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-blue-950 dark:text-blue-50 mb-2">
                Welcome Back
              </h1>
              <p className="text-blue-600 dark:text-blue-300">
                Sign in to your SARS account to manage your reports
              </p>
            </div>

            {/* Form */}
            <form.Subscribe>
              {({ isSubmitting }) => (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                  className="space-y-6"
                >
                  {/* Email */}
                  <form.Field
                    name="email"
                    validators={{
                      onChange: ({ value }) => {
                        const parsed = loginSchema.shape.email.safeParse(value);
                        return parsed.success
                          ? undefined
                          : parsed.error.issues[0].message;
                      },
                    }}
                  >
                    {(field) => (
                      <div>
                        <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail
                            size={18}
                            className="absolute left-3 top-3 text-blue-400"
                          />
                          <Input
                            type="email"
                            name={field.name}
                            placeholder="you@example.com"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={`pl-10 bg-blue-50 dark:bg-blue-800 border-blue-200 dark:border-blue-700 ${
                              field.state.meta.errors.length
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            }`}
                            disabled={isSubmitting}
                          />
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  {/* Password */}
                  <form.Field
                    name="password"
                    validators={{
                      onChange: ({ value }) => {
                        const parsed =
                          loginSchema.shape.password.safeParse(value);
                        return parsed.success
                          ? undefined
                          : parsed.error.issues[0].message;
                      },
                    }}
                  >
                    {(field) => (
                      <div>
                        <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <Lock
                            size={18}
                            className="absolute left-3 top-3 text-blue-400"
                          />
                          <Input
                            type={showPassword ? "text" : "password"}
                            name={field.name}
                            placeholder="••••••••"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={`pl-10 pr-10 bg-blue-50 dark:bg-blue-800 border-blue-200 dark:border-blue-700 ${
                              field.state.meta.errors.length
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            }`}
                            disabled={isSubmitting}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-blue-400 hover:text-blue-600 disabled:opacity-50"
                            disabled={isSubmitting}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  {/* Error */}
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-blue-700 dark:text-blue-300">
                        Remember me
                      </span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-semibold py-2.5"
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              )}
            </form.Subscribe>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-grow bg-blue-200 dark:bg-blue-800" />
              <span className="text-sm text-blue-600 dark:text-blue-400">
                or
              </span>
              <div className="h-px flex-grow bg-blue-200 dark:bg-blue-800" />
            </div>

            {/* Google Login */}
            <div className="mb-6 rounded-lg border border-teal-200 dark:border-teal-700 bg-white dark:bg-slate-800 p-4 flex items-center justify-center min-h-16">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google sign-in failed")}
                size="large"
                text="signin_with"
                theme="light"
                locale="en"
              />
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-center text-sm mb-6">
              <Link
                to="/forgot-password"
                className="text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-blue-600 dark:text-blue-400 mt-6">
              Don't have an account?{" "}
              <Link
                to="/user-register"
                className="font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Info Text */}
          <p className="text-center text-sm text-blue-600 dark:text-blue-400 mt-6">
            Having trouble?{" "}
            <a
              href="#contact"
              className="font-semibold text-teal-700 dark:text-teal-400"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
