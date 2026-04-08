import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { loginWithGoogle } from "@/lib/backend-api";
import {
  AlertTriangle,
  Clock,
  LockKeyhole,
  MapPin,
  Radio,
  Shield,
  UserCircle2,
  CheckCircle2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useSignin } from "@/hooks/useAuth";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import type { DispatcherSession } from "@/components/dispatcher/DispatcherTypes";
import type { ResponderSession } from "@/components/responder/ResponderTypes";
import { AccessSignal } from "@/components/dispatcher/DispatcherShared";

const DISPATCHER_SESSION_KEY = "swift-response-hub/dispatcher-session/v1";
const RESPONDER_SESSION_KEY = "swift-response-hub/responder-session/v1";

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "dispatcher";

  const [activeTab, setActiveTab] = useState<"dispatcher" | "responder">(
    defaultRole as "dispatcher" | "responder",
  );

  const [dispatcherForm, setDispatcherForm] = useState({
    email: "",
    password: "",
  });

  const [responderForm, setResponderForm] = useState({
    email: "",
    password: "",
    unitLabel: "",
  });

  const signinMutation = useSignin();
  const { handleGoogleSuccess } = useGoogleAuth();

  // Redirect if already logged in
  useEffect(() => {
    const dispatcherSession = window.localStorage.getItem(
      DISPATCHER_SESSION_KEY,
    );
    const responderSession = window.localStorage.getItem(RESPONDER_SESSION_KEY);

    if (dispatcherSession) {
      navigate("/dispatcher");
    } else if (responderSession) {
      navigate("/responder");
    }
  }, [navigate]);

  const handleDispatcherLogin = async () => {
    const email = dispatcherForm.email.trim();
    const password = dispatcherForm.password.trim();

    if (!email || !password) {
      toast.error("Enter your dispatcher email and password");
      return;
    }

    const derivedName = email
      .split("@")[0]
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    signinMutation.mutate(
      { email, password },
      {
        onSuccess: (authResponse: any) => {
          const authResult = authResponse?.data || authResponse;
          const session: DispatcherSession = {
            userId: authResult?.user?.id || "",
            email,
            name: authResult?.user?.fullName || derivedName || "Dispatcher",
            accessToken: authResult?.tokens?.accessToken || "",
            refreshToken: authResult?.tokens?.refreshToken,
          };
          window.localStorage.setItem(
            DISPATCHER_SESSION_KEY,
            JSON.stringify(session),
          );
          toast.success("Welcome to Dispatcher Dashboard");
          navigate("/dispatcher");
        },
        onError: (error: any) => {
          console.error("Login error:", error);
          
          // Check for authentication/password errors (401 or 400 with specific messages)
          const errorMessage = error?.response?.data?.message || 
                             error?.response?.data?.error || 
                             error?.message || 
                             "Login failed";
          
          // Map specific errors to user-friendly messages
          if (error?.response?.status === 401 || 
              errorMessage.toLowerCase().includes("invalid") ||
              errorMessage.toLowerCase().includes("unauthorized") ||
              errorMessage.toLowerCase().includes("missing tokens")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(errorMessage);
          }
        },
      },
    );
  };

  const handleResponderLogin = async () => {
    const email = responderForm.email.trim();
    const unitLabel = responderForm.unitLabel.trim();
    const password = responderForm.password.trim();

    if (!email || !unitLabel || !password) {
      toast.error("Enter your email, unit label, and password");
      return;
    }

    const derivedName = email
      .split("@")[0]
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    signinMutation.mutate(
      { email, password },
      {
        onSuccess: (authResponse: any) => {
          const authResult = authResponse?.data || authResponse;
          const session: ResponderSession = {
            userId: authResult?.user?.id || "",
            email,
            name: authResult?.user?.fullName || derivedName || "Responder",
            unitLabel,
            accessToken: authResult?.tokens?.accessToken || "",
            refreshToken: authResult?.tokens?.refreshToken,
          };
          window.localStorage.setItem(
            RESPONDER_SESSION_KEY,
            JSON.stringify(session),
          );
          toast.success("Welcome to Responder Dashboard");
          navigate("/responder");
        },
        onError: (error: any) => {
          console.error("Login error:", error);
          
          // Check for authentication/password errors (401 or 400 with specific messages)
          const errorMessage = error?.response?.data?.message || 
                             error?.response?.data?.error || 
                             error?.message || 
                             "Login failed";
          
          // Map specific errors to user-friendly messages
          if (error?.response?.status === 401 || 
              errorMessage.toLowerCase().includes("invalid") ||
              errorMessage.toLowerCase().includes("unauthorized") ||
              errorMessage.toLowerCase().includes("missing tokens")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(errorMessage);
          }
        },
      },
    );
  };

  const handleDispatcherGoogleLogin = (credentialResponse: any) => {
    const googleAuthData = handleGoogleSuccess(credentialResponse);
    if (googleAuthData) {
      const session: DispatcherSession = {
        userId: googleAuthData.googleId,
        email: googleAuthData.email,
        name: googleAuthData.name || "Dispatcher",
        accessToken: "", // Don't store Google JWT
        refreshToken: undefined,
      };
      window.localStorage.setItem(
        DISPATCHER_SESSION_KEY,
        JSON.stringify(session),
      );
      window.localStorage.setItem(
        "google-auth-session",
        JSON.stringify({
          googleId: googleAuthData.googleId,
          email: googleAuthData.email,
          isGoogleAuth: true,
        }),
      );
      setDispatcherForm({ email: "", password: "" });
      toast.success(`Welcome back, ${googleAuthData.name}!`);
      navigate("/dispatcher");
    }
  };

  const handleResponderGoogleLogin = (credentialResponse: any) => {
    const googleAuthData = handleGoogleSuccess(credentialResponse);
    if (googleAuthData) {
      const session: ResponderSession = {
        userId: googleAuthData.googleId,
        email: googleAuthData.email,
        name: googleAuthData.name || "Responder",
        unitLabel: responderForm.unitLabel || "Unit Response",
        accessToken: "", // Don't store Google JWT
        refreshToken: undefined,
      };
      window.localStorage.setItem(
        RESPONDER_SESSION_KEY,
        JSON.stringify(session),
      );
      window.localStorage.setItem(
        "google-auth-session",
        JSON.stringify({
          googleId: googleAuthData.googleId,
          email: googleAuthData.email,
          isGoogleAuth: true,
        }),
      );
      setResponderForm({ email: "", password: "", unitLabel: "" });
      toast.success(`Welcome back, ${googleAuthData.name}!`);
      navigate("/responder");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute left-[-8rem] top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-24 h-72 w-72 rounded-full bg-info/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:py-16 lg:grid-cols-[1fr_500px]">
          {/* Left Column - Info */}
          <div>
            <Tabs
              value={activeTab}
              onValueChange={(val) =>
                setActiveTab(val as "dispatcher" | "responder")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dispatcher">Dispatcher</TabsTrigger>
                <TabsTrigger value="responder">Responder</TabsTrigger>
              </TabsList>

              <TabsContent value="dispatcher" className="mt-8 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 backdrop-blur-sm">
                    <LockKeyhole className="h-4 w-4 text-primary" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
                      Dispatcher Access
                    </span>
                  </div>
                  <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground md:text-4xl">
                    Manage live accident operations
                  </h1>
                  <p className="mt-4 text-base leading-7 text-muted-foreground">
                    Review incoming accident reports, dispatch responders, and
                    maintain the operational queue in real time.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-1">
                  <AccessSignal
                    icon={AlertTriangle}
                    title="Verify reports"
                    description="Assess incoming queue and validate accident reports."
                  />
                  <AccessSignal
                    icon={Users}
                    title="Assign units"
                    description="Dispatch the right responder quickly."
                  />
                  <AccessSignal
                    icon={Clock}
                    title="Track flow"
                    description="Monitor timing and resolution end to end."
                  />
                </div>
              </TabsContent>

              <TabsContent value="responder" className="mt-8 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 backdrop-blur-sm">
                    <Shield className="h-4 w-4 text-info" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-info">
                      Field Access
                    </span>
                  </div>
                  <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground md:text-4xl">
                    Manage field response
                  </h1>
                  <p className="mt-4 text-base leading-7 text-muted-foreground">
                    Accept assignments, track location, keep dispatch informed,
                    and update from the field in real time.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-1">
                  <AccessSignal
                    icon={CheckCircle2}
                    title="Accept tasks"
                    description="Review live accident assignments quickly."
                  />
                  <AccessSignal
                    icon={MapPin}
                    title="Track location"
                    description="Keep ETA and arrival updates flowing."
                  />
                  <AccessSignal
                    icon={Clock}
                    title="Close loops"
                    description="Track completed responses from the field."
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Login Form */}
          <Tabs
            value={activeTab}
            onValueChange={(val) =>
              setActiveTab(val as "dispatcher" | "responder")
            }
          >
            <TabsContent value="dispatcher">
              <Card className="overflow-hidden border-border/80 bg-card/88 shadow-[0_24px_100px_rgba(0,0,0,0.38)] backdrop-blur-xl">
                <div className="h-24 bg-gradient-to-b from-primary/18 via-info/10 to-transparent" />
                <CardHeader className="relative -mt-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-secondary/85 shadow-inner">
                    <UserCircle2 className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="mt-4 text-2xl text-foreground">
                    Dispatcher login
                  </CardTitle>
                  <CardDescription>
                    Sign in to access the dispatch console
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      className="border-border bg-secondary text-foreground"
                      placeholder="dispatcher@swift.local"
                      value={dispatcherForm.email}
                      onChange={(e) =>
                        setDispatcherForm({
                          ...dispatcherForm,
                          email: e.target.value,
                        })
                      }
                      disabled={signinMutation.isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Input
                      className="border-border bg-secondary text-foreground"
                      type="password"
                      placeholder="Enter password"
                      value={dispatcherForm.password}
                      onChange={(e) =>
                        setDispatcherForm({
                          ...dispatcherForm,
                          password: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !signinMutation.isPending) {
                          handleDispatcherLogin();
                        }
                      }}
                      disabled={signinMutation.isPending}
                    />
                  </div>

                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    onClick={handleDispatcherLogin}
                    disabled={signinMutation.isPending}
                  >
                    <LockKeyhole className="mr-2 h-4 w-4" />
                    {signinMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                  <div className="relative">
                    <Separator className="my-4" />
                    <div className="absolute inset-x-0 top-1/2 flex justify-center">
                      <span className="bg-card px-2 text-xs text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center rounded-lg border border-primary/20 bg-white dark:bg-slate-800 p-4 min-h-16 dark:border-primary/30">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDispatcherGoogleLogin}
                      className="w-full"
                    >
                      Sign in with Google
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="responder">
              <Card className="overflow-hidden border-border/80 bg-card/88 shadow-[0_24px_100px_rgba(0,0,0,0.38)] backdrop-blur-xl">
                <div className="h-24 bg-gradient-to-b from-info/18 via-success/10 to-transparent" />
                <CardHeader className="relative -mt-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-secondary/85 shadow-inner">
                    <UserCircle2 className="h-7 w-7 text-info" />
                  </div>
                  <CardTitle className="mt-4 text-2xl text-foreground">
                    Responder login
                  </CardTitle>
                  <CardDescription>
                    Sign in to access the field dashboard
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      className="border-border bg-secondary text-foreground"
                      placeholder="unit.alpha@swift.local"
                      value={responderForm.email}
                      onChange={(e) =>
                        setResponderForm({
                          ...responderForm,
                          email: e.target.value,
                        })
                      }
                      disabled={signinMutation.isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Unit label
                    </label>
                    <Input
                      className="border-border bg-secondary text-foreground"
                      placeholder="Unit Alpha-7"
                      value={responderForm.unitLabel}
                      onChange={(e) =>
                        setResponderForm({
                          ...responderForm,
                          unitLabel: e.target.value,
                        })
                      }
                      disabled={signinMutation.isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Input
                      className="border-border bg-secondary text-foreground"
                      type="password"
                      placeholder="Enter password"
                      value={responderForm.password}
                      onChange={(e) =>
                        setResponderForm({
                          ...responderForm,
                          password: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !signinMutation.isPending) {
                          handleResponderLogin();
                        }
                      }}
                      disabled={signinMutation.isPending}
                    />
                  </div>

                  <Button
                    className="w-full bg-info text-primary-foreground hover:bg-info/90 disabled:opacity-50"
                    onClick={handleResponderLogin}
                    disabled={signinMutation.isPending}
                  >
                    <LockKeyhole className="mr-2 h-4 w-4" />
                    {signinMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="relative">
                    <Separator className="my-4" />
                    <div className="absolute inset-x-0 top-1/2 flex justify-center">
                      <span className="bg-card px-2 text-xs text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center rounded-lg border border-info/20 bg-white dark:bg-slate-800 p-4 min-h-16 dark:border-info/30">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResponderGoogleLogin}
                      className="w-full"
                    >
                      Sign in with Google
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Auth Links */}
          <div className="mt-8 space-y-3 text-center">
            <Button
              variant="link"
              className="text-primary hover:text-primary/80"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot your password?
            </Button>
            <div className="relative">
              <Separator className="my-4" />
              <div className="absolute inset-x-0 top-1/2 flex justify-center">
                <span className="bg-background px-2 text-xs text-muted-foreground">
                  Not in dispatch?
                </span>
              </div>
            </div>
            <Button
              className="w-full bg-success text-primary-foreground hover:bg-success/90"
              onClick={() => navigate("/register")}
            >
              <UserCircle2 className="mr-2 h-4 w-4" />
              Register as User
            </Button>
            <p className="text-xs text-muted-foreground">
              Create an account to report accidents and manage your reports
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
