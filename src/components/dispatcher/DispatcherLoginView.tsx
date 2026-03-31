import {
  AlertTriangle,
  Clock,
  LockKeyhole,
  UserCircle2,
  Users,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { AccessSignal } from "./DispatcherShared";

interface DispatcherLoginViewProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
  onGoogleLogin: (credentialResponse: any) => void;
  isLoading?: boolean;
}

export default function DispatcherLoginView({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onLogin,
  onGoogleLogin,
  isLoading = false,
}: DispatcherLoginViewProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute left-[-8rem] top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-[-6rem] top-24 h-72 w-72 rounded-full bg-warning/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1360px] gap-5 px-4 py-10 md:py-14 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 backdrop-blur-sm">
            <LockKeyhole className="h-4 w-4 text-primary" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
              Dispatcher Access
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground md:text-5xl">
            Sign in to open the live dispatch console
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Authenticate into the dispatcher workspace to review incoming
            accidents, update lifecycle status, and maintain the full
            operational queue.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <AccessSignal
              icon={AlertTriangle}
              title="Verify reports"
              description="Assess the incoming queue and move valid accident reports into review."
            />
            <AccessSignal
              icon={Users}
              title="Assign units"
              description="Dispatch the right responder to the right scene quickly."
            />
            <AccessSignal
              icon={Clock}
              title="Track flow"
              description="Monitor timing, escalation, and resolution end to end."
            />
          </div>
        </div>

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
              Start a local dispatcher session for this prototype and unlock
              dashboard actions.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Dispatcher email
              </label>
              <Input
                className="border-border bg-secondary text-foreground"
                placeholder="dispatcher@swift.local"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                disabled={isLoading}
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
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !isLoading) {
                    onLogin();
                  }
                }}
                disabled={isLoading}
              />
            </div>

            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              onClick={onLogin}
              disabled={isLoading}
            >
              <LockKeyhole className="mr-2 h-4 w-4" />
              {isLoading ? "Signing in..." : "Sign In to Dispatcher Dashboard"}
            </Button>

            <div className="relative">
              <Separator className="my-4" />
              <div className="absolute inset-x-0 top-1/2 flex justify-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={onGoogleLogin}
                onError={() => {}}
                size="large"
                width="100%"
                flow="auth-code"
              />
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/55 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                Note
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Use your dispatcher credentials or sign in with Google to access
                the dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
