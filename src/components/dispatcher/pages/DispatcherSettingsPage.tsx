import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { Alert, AlertDescription } from "../../ui/alert";
import { toast } from "sonner";
import { Settings, Bell, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

interface DispatcherSettings {
  autoNotifications: boolean;
  soundAlerts: boolean;
  criticalHighlighting: boolean;
  responseTimeAlert: number;
  maxQueueItems: number;
  maintenanceMode: boolean;
}

export default function DispatcherSettingsPage() {
  const [settings, setSettings] = useState<DispatcherSettings>({
    autoNotifications: true,
    soundAlerts: true,
    criticalHighlighting: true,
    responseTimeAlert: 15,
    maxQueueItems: 100,
    maintenanceMode: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
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
          Manage dispatcher preferences and system settings
        </p>
      </div>

      {/* Alerts & Notifications */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-50">
            <Bell className="h-5 w-5" />
            Alerts & Notifications
          </CardTitle>
          <CardDescription className="text-slate-400">
            Configure notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-900">
              <div>
                <p className="font-medium text-slate-50">Auto Notifications</p>
                <p className="text-sm text-slate-400">
                  Automatically notify for new incidents
                </p>
              </div>
              <Switch
                checked={settings.autoNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-900">
              <div>
                <p className="font-medium text-slate-50">Sound Alerts</p>
                <p className="text-sm text-slate-400">
                  Enable audio alerts for critical incidents
                </p>
              </div>
              <Switch
                checked={settings.soundAlerts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, soundAlerts: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-900">
              <div>
                <p className="font-medium text-slate-50">
                  Critical Highlighting
                </p>
                <p className="text-sm text-slate-400">
                  Highlight critical incidents in queue
                </p>
              </div>
              <Switch
                checked={settings.criticalHighlighting}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, criticalHighlighting: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-50">Performance Settings</CardTitle>
          <CardDescription className="text-slate-400">
            Optimize dispatcher console performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="responseTime" className="text-slate-300">
              Response Time Alert Threshold (minutes)
            </Label>
            <Input
              id="responseTime"
              type="number"
              value={settings.responseTimeAlert}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  responseTimeAlert: parseInt(e.target.value),
                })
              }
              className="mt-1 bg-slate-900 border-slate-700 text-slate-50 placeholder-slate-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Alert when response exceeds this time
            </p>
          </div>

          <div>
            <Label htmlFor="maxQueue" className="text-slate-300">
              Max Queue Items
            </Label>
            <Input
              id="maxQueue"
              type="number"
              value={settings.maxQueueItems}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxQueueItems: parseInt(e.target.value),
                })
              }
              className="mt-1 bg-slate-900 border-slate-700 text-slate-50 placeholder-slate-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Maximum incidents to display in queue
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-50">System Status</CardTitle>
          <CardDescription className="text-slate-400">
            Current system health and connectivity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-green-900">
            <span className="text-sm font-medium text-green-400">
              API Status
            </span>
            <Badge className="bg-green-900 text-green-200">Connected</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-green-900">
            <span className="text-sm font-medium text-green-400">Database</span>
            <Badge className="bg-green-900 text-green-200">Connected</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-green-900">
            <span className="text-sm font-medium text-green-400">
              Queue Service
            </span>
            <Badge className="bg-green-900 text-green-200">Active</Badge>
          </div>
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
            Manage API access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-600 rounded-lg">
            <p className="text-sm font-mono text-slate-400 break-all">
              api_key_dispatcher_xxxxxxxxxxxxxxxxxxxx
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

      {/* Maintenance Mode */}
      <Card className="border-orange-900 bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-500">
            <AlertCircle className="h-5 w-5" />
            Maintenance Mode
          </CardTitle>
          <CardDescription className="text-teal-700">
            Temporarily disable dispatcher console
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-teal-700 rounded-lg bg-slate-900">
            <div>
              <p className="font-medium text-orange-500">
                Enable Maintenance Mode
              </p>
              <p className="text-sm text-orange-400">
                Disable access temporarily
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
                Maintenance mode is active. Dispatcher console will be
                inaccessible.
              </AlertDescription>
            </Alert>
          )}
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
}

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
