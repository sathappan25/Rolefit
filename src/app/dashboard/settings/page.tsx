"use client";

import * as React from "react";
import { Trash2, Moon } from "lucide-react";
import { useApp } from "@/lib/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/shared/page-header";

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { clearAnalysis } = useApp();
  const [dark, setDark] = React.useState(false);
  const [emailNotif, setEmailNotif] = React.useState(true);
  const [productUpdates, setProductUpdates] = React.useState(false);

  React.useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = (next: boolean) => {
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("rolefit:theme", next ? "dark" : "light");
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="Manage your RoleFit preferences." />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="divide-y py-0">
          <SettingRow title="Dark mode" description="Switch between light and dark themes.">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <Switch checked={dark} onCheckedChange={toggleDark} aria-label="Toggle dark mode" />
            </div>
          </SettingRow>
          <SettingRow title="Email notifications" description="Get notified about your career insights.">
            <Switch checked={emailNotif} onCheckedChange={setEmailNotif} aria-label="Toggle email notifications" />
          </SettingRow>
          <SettingRow title="Product updates" description="Receive news about new RoleFit features.">
            <Switch checked={productUpdates} onCheckedChange={setProductUpdates} aria-label="Toggle product updates" />
          </SettingRow>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Clear analysis data</p>
              <p className="text-sm text-muted-foreground">Remove your current resume analysis from this device.</p>
            </div>
            <Button variant="outline" size="sm" onClick={clearAnalysis}>
              <Trash2 className="h-4 w-4" />
              Clear analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
