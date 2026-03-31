import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Settings,
  Bell,
  Lock,
  Database,
  Mail,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface SystemSettings {
  systemName: string;
  systemEmail: string;
  systemPhone: string;
  enableNotifications: boolean;
  enableEmailAlerts: boolean;
  autoBackup: boolean;
  backupFrequency: string;
  maxIncidentsPerDay: number;
  enableSMSAlerts: boolean;
  maintenanceMode: boolean;
}

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    systemName: "Swift Response Hub",
    systemEmail: "admin@swiftresponse.com",
    systemPhone: "+1 (555) 123-4567",
    enableNotifications: true,
    enableEmailAlerts: true,
    autoBackup: true,
    backupFrequency: "daily",
    maxIncidentsPerDay: 1000,
    enableSMSAlerts: true,
    maintenanceMode: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Settings</h1>
        <p className="text-slate-400 mt-1">
          Manage your system settings and preferences
        </p>
      </div>

      {/* System Information */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-slate-50">
              <Settings className="h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription className="text-slate-400">
              Basic system configuration
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="systemName" className="text-slate-300">
                System Name
              </Label>
              <Input
                id="systemName"
                value={settings.systemName}
                onChange={(e) =>
                  setSettings({ ...settings, systemName: e.target.value })
                }
                className="mt-1 bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                placeholder="Enter system name"
              />
              <p className="text-xs text-slate-500 mt-1">
                The name of your emergency response system
              </p>
            </div>
            <div>
              <Label htmlFor="systemEmail" className="text-slate-300">
                System Email
              </Label>
              <Input
                id="systemEmail"
                type="email"
                value={settings.systemEmail}
                onChange={(e) =>
                  setSettings({ ...settings, systemEmail: e.target.value })
                }
                className="mt-1 bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                placeholder="admin@example.com"
              />
              <p className="text-xs text-slate-500 mt-1">
                Primary contact email address
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="systemPhone" className="text-slate-300">
              System Phone
            </Label>
            <Input
              id="systemPhone"
              type="tel"
              value={settings.systemPhone}
              onChange={(e) =>
                setSettings({ ...settings, systemPhone: e.target.value })
              }
              className="mt-1 bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
              placeholder="+1 (555) 123-4567"
            />
            <p className="text-xs text-slate-500 mt-1">
              Primary contact phone number
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-50">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription className="text-slate-400">
            Configure notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-900">
              <div>
                <p className="font-medium text-slate-50">
                  Enable Notifications
                </p>
                <p className="text-sm text-slate-400">
                  Allow system-wide notifications
                </p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-900">
              <div>
                <p className="font-medium text-slate-50">Email Alerts</p>
                <p className="text-sm text-slate-400">
                  Send email notifications for critical incidents
                </p>
              </div>
              <Switch
                checked={settings.enableEmailAlerts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableEmailAlerts: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-900">
              <div>
                <p className="font-medium text-slate-50">SMS Alerts</p>
                <p className="text-sm text-slate-400">
                  Send SMS notifications to responders
                </p>
              </div>
              <Switch
                checked={settings.enableSMSAlerts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableSMSAlerts: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Database */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-50">
            <Database className="h-5 w-5" />
            Backup & Database
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage data backup settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-900">
            <div>
              <p className="font-medium text-slate-50">Automatic Backup</p>
              <p className="text-sm text-slate-400">
                Enable automatic daily backups
              </p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, autoBackup: checked })
              }
            />
          </div>

          {settings.autoBackup && (
            <div>
              <Label htmlFor="backupFrequency" className="text-slate-300">
                Backup Frequency
              </Label>
              <select
                id="backupFrequency"
                value={settings.backupFrequency}
                onChange={(e) =>
                  setSettings({ ...settings, backupFrequency: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-700 rounded-md mt-1 bg-slate-900 text-slate-50"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">
                How often backups will be created
              </p>
            </div>
          )}

          <div>
            <Button variant="outline" className="w-full gap-2">
              <Database className="h-4 w-4" />
              Backup Now
            </Button>
          </div>

          <div className="p-4 bg-blue-900 border border-blue-800 rounded-lg">
            <p className="text-sm text-blue-200">
              <strong>Last backup:</strong> 2024-03-20 at 02:30 AM
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-50">Performance Settings</CardTitle>
          <CardDescription className="text-slate-400">
            Optimize system performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="maxIncidents" className="text-slate-300">
              Max Incidents Per Day
            </Label>
            <Input
              id="maxIncidents"
              type="number"
              value={settings.maxIncidentsPerDay}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxIncidentsPerDay: parseInt(e.target.value),
                })
              }
              className="mt-1 bg-slate-900 border-slate-700 text-slate-50 placeholder-slate-500"
              placeholder="1000"
            />
            <p className="text-xs text-slate-500 mt-1">
              Maximum number of incidents the system can handle per day
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card className="border-orange-900 bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-500">
            <AlertCircle className="h-5 w-5" />
            Maintenance Mode
          </CardTitle>
          <CardDescription className="text-teal-700">
            Disable user access during maintenance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-teal-700 rounded-lg bg-slate-900">
            <div>
              <p className="font-medium text-orange-500">
                Enable Maintenance Mode
              </p>
              <p className="text-sm text-orange-400">
                Users will see a maintenance message
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, maintenanceMode: checked })
              }
            />
          </div>

          {settings.maintenanceMode && (
            <Alert className="border-teal-700 bg-teal-950">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <AlertDescription className="text-orange-400">
                Maintenance mode is currently active. Users will see a
                maintenance message instead of the application.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* API & Security */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-50">
            <Lock className="h-5 w-5" />
            API & Security
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage API keys and security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-600 rounded-lg">
            <p className="text-sm font-mono text-slate-400 break-all">
              api_key_xxxxxxxxxxxxxxxxxxxx
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Copy API Key</Button>
            <Button variant="outline" className="text-red-400 border-red-600">
              Regenerate Key
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-50">System Status</CardTitle>
          <CardDescription className="text-slate-400">
            Current system health and metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-green-900">
            <span className="text-sm font-medium text-green-400">
              API Status
            </span>
            <Badge className="bg-green-900 text-green-200">Online</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-green-900">
            <span className="text-sm font-medium text-green-400">Database</span>
            <Badge className="bg-green-900 text-green-200">Connected</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-green-900">
            <span className="text-sm font-medium text-green-400">
              Notification Service
            </span>
            <Badge className="bg-green-900 text-green-200">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-900 bg-slate-800">
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
          <CardDescription className="text-slate-400">
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-red-900 rounded-lg bg-red-950">
            <p className="text-sm text-red-400 font-medium mb-3">
              Clear System Cache
            </p>
            <Button variant="outline" className="text-red-400 border-red-700">
              Clear Cache
            </Button>
          </div>
          <div className="p-4 border border-red-900 rounded-lg bg-red-950">
            <p className="text-sm text-red-400 font-medium mb-3">
              Reset All Settings
            </p>
            <p className="text-xs text-red-500 mb-3">
              This will reset all system settings to defaults. This action
              cannot be undone.
            </p>
            <Button variant="outline" className="text-red-400 border-red-700">
              Reset Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Discard Changes</Button>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Badge component inline
const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

export default AdminSettingsPage;
