import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-brand-purple" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">Configure your preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Coming soon - configure your account preferences and application settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Settings panel will be available in a future update.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;