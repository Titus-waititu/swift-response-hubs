import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navigation from "@/components/premium/Navigation";
import Footer from "@/components/premium/Footer";
import {
  createUserAccount,
  signInToBackend,
  loginWithGoogle,
} from "@/lib/backend-api";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validation-schemas";

const USER_SESSION_KEY = "swift-response-hub/user-session/v1";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as RegisterFormValues,
    onSubmit: async ({ value }) => {
      const parsed = registerSchema.safeParse(value);
      if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        const errorMessages = Object.values(errors).flat().filter(Boolean);
        toast.error(
          errorMessages.join("\n") || "Please fix the errors in the form.",
        );
        return { success: false, errors };
      }

      try {
        await createUserAccount({
          fullName: parsed.data.name.trim(),
          email: parsed.data.email.trim().toLowerCase(),
          username: parsed.data.email.trim().toLowerCase().split("@")[0],
          password: parsed.data.password,
          role: "user",
        });

        const authResponse = await signInToBackend(
          parsed.data.email.trim().toLowerCase(),
          parsed.data.password,
        );

        if (authResponse.success && authResponse.user && authResponse.tokens) {
          const session = {
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
          toast.success("Account created successfully!");
          navigate("/dashboard");
        }
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Registration failed. Please try again.";
        toast.error(msg);
      }
    },
  });

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Redirecting to Google sign-in...");
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <Navigation />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white">
              Create Account
            </h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
              Join Swift Response Hub today
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <form.Subscribe>
              {({ isSubmitting }) => (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                  className="space-y-5"
                >
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) =>
                        registerSchema.shape.name.safeParse(value).success
                          ? undefined
                          : "Name must be at least 2 characters",
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-900 dark:text-white">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                          <input
                            type="text"
                            name={field.name}
                            placeholder="John Doe"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={`w-full border bg-slate-50 py-2 pl-10 pr-4 text-slate-900 placeholder-slate-500 transition-colors hover:bg-white focus:bg-white focus:outline-none focus:ring-1 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 ${
                              field.state.meta.errors.length
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:border-cyan-500 focus:ring-cyan-500 dark:border-slate-600 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                            }`}
                            disabled={isSubmitting}
                          />
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field
                    name="email"
                    validators={{
                      onChange: ({ value }) =>
                        registerSchema.shape.email.safeParse(value).success
                          ? undefined
                          : "Please enter a valid email address",
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-900 dark:text-white">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                          <input
                            type="email"
                            name={field.name}
                            placeholder="you@example.com"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={`w-full border bg-slate-50 py-2 pl-10 pr-4 text-slate-900 placeholder-slate-500 transition-colors hover:bg-white focus:bg-white focus:outline-none focus:ring-1 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 ${
                              field.state.meta.errors.length
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:border-cyan-500 focus:ring-cyan-500 dark:border-slate-600 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                            }`}
                            disabled={isSubmitting}
                          />
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field
                    name="password"
                    validators={{
                      onChange: ({ value }) =>
                        registerSchema.shape.password.safeParse(value).success
                          ? undefined
                          : "Password must be strong (8+ chars, uppercase, lowercase, numbers)",
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-900 dark:text-white">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name={field.name}
                            placeholder="Min. 8 characters"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={`w-full border bg-slate-50 py-2 pl-10 pr-10 text-slate-900 placeholder-slate-500 transition-colors hover:bg-white focus:bg-white focus:outline-none focus:ring-1 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 ${
                              field.state.meta.errors.length
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:border-cyan-500 focus:ring-cyan-500 dark:border-slate-600 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                            }`}
                            disabled={isSubmitting}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            disabled={isSubmitting}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field
                    name="confirmPassword"
                    validators={{
                      onChangeListenDependencies: ["password"],
                      onChange: ({ value, fieldApi }) => {
                        if (value !== fieldApi.form.getFieldValue("password")) {
                          return "Passwords do not match";
                        }
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-900 dark:text-white">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name={field.name}
                            placeholder="Confirm your password"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={`w-full border bg-slate-50 py-2 pl-10 pr-10 text-slate-900 placeholder-slate-500 transition-colors hover:bg-white focus:bg-white focus:outline-none focus:ring-1 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 ${
                              field.state.meta.errors.length
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:border-cyan-500 focus:ring-cyan-500 dark:border-slate-600 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                            }`}
                            disabled={isSubmitting}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            disabled={isSubmitting}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-cyan-600 py-2 font-medium text-white hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              )}
            </form.Subscribe>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-grow bg-slate-300 dark:bg-slate-600" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                or
              </span>
              <div className="h-px flex-grow bg-slate-300 dark:bg-slate-600" />
            </div>

            {/* Google Login */}
            <div className="mb-6 flex justify-center p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 min-h-14">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full"
              >
                Sign up with Google
              </Button>
            </div>

            {/* Sign In Link */}
            <div className="border-t border-slate-200 pt-6 text-center dark:border-slate-700">
              <form.Subscribe selector={(state) => [state.isSubmitting]}>
                {([isSubmitting]) => (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Already have an account?{" "}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => navigate("/user-login")}
                      className="font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </form.Subscribe>
            </div>
          </div>

          {/* Footer Note */}
          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Regular users can create accounts here. Staff accounts are created
            by administrators.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
