import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore, UserRole } from "@/stores/authStore";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user, accessToken } = useAuthStore();

  // Check if user is authenticated
  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has allowed role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md border-warning">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Access Denied
                </h2>
                <p className="text-sm text-gray-600">
                  You don't have permission to access this page. Your role is{" "}
                  <span className="font-medium">{user.role}</span>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
