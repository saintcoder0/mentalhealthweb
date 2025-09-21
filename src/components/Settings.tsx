import { useState } from "react";
import { Settings as SettingsIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/20 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className="fixed right-4 top-4 w-80 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-300">
        <Card className="border-0 bg-transparent">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <SettingsIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Settings</CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-muted/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive updates and reminders
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Sound Effects</Label>
                  <p className="text-xs text-muted-foreground">
                    Play sounds for interactions
                  </p>
                </div>
                <Switch
                  checked={sound}
                  onCheckedChange={setSound}
                />
              </div>
            </div>

            {/* Version Info */}
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Peace Pulse Journal</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Helper function for conditional classes
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
