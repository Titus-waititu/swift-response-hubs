import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import AppHeader from "@/components/AppHeader";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "@/lib/validation-schemas";
import { useForgotPassword } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");

    try {
      // Validate the form
      await forgotPasswordSchema.parseAsync({ email });

      // Call the forgot password API
      await forgotPasswordMutation.mutateAsync({ email });

      setIsSubmitted(true);
      toast.success("Password reset link sent to your email");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const fieldName = err.path.join(".");
          errors[fieldName] = err.message;
        });
        setFieldErrors(errors);
      } else {
        // Extract error message from API response
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to send reset link. Please try again.";
        setGeneralError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const reportNavItems = [
    {
      label: "Back to Login",
      path: "/login",
      icon: ArrowLeft,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        brandTo="/forgot-password"
        brandLabel="Account Recovery"
        navItems={reportNavItems}
      />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute left-[-8rem] top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-32 h-72 w-72 rounded-full bg-info/10 blur-3xl" />

        <div className="relative mx-auto max-w-md px-4 py-12 md:py-16">
          <Card className="overflow-hidden border-border/80 bg-card/85 backdrop-blur-sm">
            <div className="h-20 bg-gradient-to-b from-primary/20 via-info/10 to-transparent" />

            <CardHeader className="relative -mt-8 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-secondary/85">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="mt-4 text-2xl text-foreground">
                {isSubmitted ? "Check your email" : "Forgot password?"}
              </CardTitle>
              <CardDescription className="mt-2">
                {isSubmitted
                  ? "Password reset link sent successfully. Check your email to continue."
                  : "Enter your email and we'll send you a link to reset your password."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {generalError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                      <p className="text-sm text-red-800 dark:text-red-200">
                        {generalError}
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-foreground">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className={`border-border bg-secondary text-foreground`}
                      disabled={forgotPasswordMutation.isPending}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {fieldErrors.email && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={forgotPasswordMutation.isPending}
                  >
                    {forgotPasswordMutation.isPending
                      ? "Sending..."
                      : "Send Reset Link"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-border text-foreground"
                    onClick={() => navigate("/login")}
                    disabled={forgotPasswordMutation.isPending}
                  >
                    Back to Login
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                      <CheckCircle2 className="h-8 w-8 text-success" />
                    </div>
                  </div>

                  <div className="space-y-3 text-center">
                    <p className="text-sm text-muted-foreground">
                      We've sent a password reset link to{" "}
                      <span className="font-medium text-foreground">
                        {email}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      The link will expire in 24 hours. If you don't see the
                      email, check your spam folder.
                    </p>
                  </div>

                  <Button
                    type="button"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => navigate("/login")}
                  >
                    Return to Login
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-border text-foreground"
                    onClick={() => {
                      setEmail("");
                      setIsSubmitted(false);
                    }}
                  >
                    Try another email
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
