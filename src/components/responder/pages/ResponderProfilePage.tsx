import { User as UserType } from "@/stores/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResponderProfilePageProps {
  user: UserType | null;
}

export default function ResponderProfilePage({
  user,
}: ResponderProfilePageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          My Profile
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Personal information and settings
        </p>
      </div>

      {/* Profile Information */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            Account Information
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Your profile details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-slate-900 dark:text-slate-50 font-medium">
                  {user?.name || "N/A"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-slate-900 dark:text-slate-50 font-medium">
                  {user?.email || "N/A"}
                </p>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Role
              </label>
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <Badge variant="default">{user?.role || "N/A"}</Badge>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Account Status
              </label>
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            Preferences
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Customize your dashboard experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium">Notifications:</span> Enabled for
              critical incidents
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium">Theme:</span> Auto (matches system
              preference)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <span className="font-semibold">Responder Dashboard:</span> You have
            read-only access to incident assignments. For critical updates or
            changes, please contact your supervisor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
