import { User as UserType } from "@/stores/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserSettingsPageProps {
  user: UserType | null;
}

export default function UserSettingsPage({ user }: UserSettingsPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Manage your account and preferences
        </p>
      </div>

      {/* Account Information */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            Account Information
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Your profile details and account settings
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

      {/* Notification Preferences */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Manage how you receive updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium">Email Notifications:</span> Enabled
              for report updates
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium">Status Alerts:</span> Enabled for
              critical updates
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            Privacy & Security
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Your data is protected and secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              All your incident reports are encrypted and securely stored. You
              have full control over your data.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <span className="font-semibold">Need Help?</span> If you have
            questions or need support, please contact our support team through
            the emergency hotline or visit our help center.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
