import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Navigation from "@/components/premium/Navigation";
import Footer from "@/components/premium/Footer";
import { createUserAccount, signInToBackend } from "@/lib/backend-api";

const USER_SESSION_KEY = "swift-response-hub/user-session/v1";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      setError("Please enter your full name");
      return false;
    }
    if (!form.email.trim()) {
      setError("Please enter your email");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!form.password) {
      setError("Please enter a password");
      return false;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsRegistering(true);
    try {
      // Create user account
      await createUserAccount({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        username: form.email.trim().toLowerCase().split("@")[0],
        password: form.password,
        role: "user",
      });

      // Auto sign in after registration
      const authResponse = await signInToBackend(
        form.email.trim().toLowerCase(),
        form.password,
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

        window.localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setIsRegistering(false);
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
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-white">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-slate-900 placeholder-slate-500 transition-colors hover:bg-white focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                    disabled={isRegistering}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-slate-900 placeholder-slate-500 transition-colors hover:bg-white focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                    disabled={isRegistering}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 bg-slate-50 py-2 pl-10 pr-10 text-slate-900 placeholder-slate-500 transition-colors hover:bg-white focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                    disabled={isRegistering}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    disabled={isRegistering}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-white">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 bg-slate-50 py-2 pl-10 pr-10 text-slate-900 placeholder-slate-500 transition-colors hover:bg-white focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                    disabled={isRegistering}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    disabled={isRegistering}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isRegistering}
                className="w-full bg-cyan-600 py-2 font-medium text-white hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-700"
              >
                {isRegistering ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 border-t border-slate-200 pt-6 text-center dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/user-login")}
                  className="font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                >
                  Sign in
                </button>
              </p>
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
