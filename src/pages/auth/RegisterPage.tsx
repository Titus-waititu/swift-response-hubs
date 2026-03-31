import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
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
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { createUserAccount, loginWithGoogle } from "@/lib/backend-api";
import { toast } from "sonner";
import { registerSchema } from "@/lib/validation-schemas";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Redirecting to Google sign-in...");
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError(null);
    setFieldErrors({});

    try {
      // Validate the form
      await registerSchema.parseAsync({
        name,
        email,
        password,
        confirmPassword,
      });

      // Create user account using the correct endpoint (/users, not /auth/signup)
      await createUserAccount({
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        username: email.trim().toLowerCase().split("@")[0],
        password: password,
        role: "user",
      });

      setIsSuccess(true);
      toast.success("Account created successfully! Redirecting to login...");

      // Redirect to login page to sign in
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
          "Registration failed. Please try again.";
        setServerError(message);
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <LandingPageHeader />
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
          <Card className="w-full max-w-md border-success/30 bg-success/5 dark:bg-success/10">
            <CardContent className="pt-12 pb-8">
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Account Created!
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your account has been created successfully.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground/70 pt-2">
                  Redirecting you to sign in...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <LandingPageHeader />
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>
                Join us as a user to report incidents
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

                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    disabled={isLoading}
                    className={`h-10 ${
                      fieldErrors.name
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {fieldErrors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

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
                    className={`h-10 ${
                      fieldErrors.email
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
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
                    className={`h-10 ${
                      fieldErrors.password
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {fieldErrors.password && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.password}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters with uppercase, lowercase, and
                    a number
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    className={`h-10 ${
                      fieldErrors.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.confirmPassword}
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
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>

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
                    className="w-full"
                  >
                    Sign up with Google
                  </Button>
                </div>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 pt-4 border-t text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-primary hover:underline font-medium"
                    disabled={isLoading}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
