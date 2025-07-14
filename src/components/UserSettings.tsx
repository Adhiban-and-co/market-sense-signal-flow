import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Target,
  AlertTriangle,
  Mail,
  Smartphone,
  Save,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name: string;
  email: string;
  riskTolerance: number;
  investmentGoals: string[];
  tradingExperience: string;
  preferredAssets: string[];
}

interface NotificationSettings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  signalAlerts: boolean;
  portfolioUpdates: boolean;
  marketNews: boolean;
  priceTargets: boolean;
}

interface TradingPreferences {
  autoExecution: boolean;
  maxPositionSize: number;
  defaultStopLoss: number;
  defaultTakeProfit: number;
  riskPerTrade: number;
  tradingHours: string;
}

const UserSettings = () => {
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Trader",
    email: "john@example.com",
    riskTolerance: 6,
    investmentGoals: ["Growth", "Income"],
    tradingExperience: "intermediate",
    preferredAssets: ["Stocks", "ETFs", "Options"]
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailAlerts: true,
    pushNotifications: true,
    signalAlerts: true,
    portfolioUpdates: true,
    marketNews: false,
    priceTargets: true
  });

  const [tradingPrefs, setTradingPrefs] = useState<TradingPreferences>({
    autoExecution: false,
    maxPositionSize: 25,
    defaultStopLoss: 5,
    defaultTakeProfit: 15,
    riskPerTrade: 2,
    tradingHours: "market"
  });

  const [theme, setTheme] = useState("dark");
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const investmentGoalOptions = [
    "Growth", "Income", "Preservation", "Speculation", "Retirement", "Education"
  ];

  const assetClassOptions = [
    "Stocks", "ETFs", "Options", "Futures", "Forex", "Crypto", "Bonds"
  ];

  const handleSaveSettings = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
      setUnsavedChanges(false);
    }, 1000);
  };

  const getRiskLabel = (value: number) => {
    if (value <= 3) return { label: "Conservative", color: "text-profit" };
    if (value <= 6) return { label: "Moderate", color: "text-warning" };
    return { label: "Aggressive", color: "text-loss" };
  };

  const riskInfo = getRiskLabel(profile.riskTolerance);

  return (
    <div className="space-y-6">
      {unsavedChanges && (
        <Card className="border-warning bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span>You have unsaved changes</span>
              </div>
              <Button onClick={handleSaveSettings} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => {
                      setProfile({...profile, name: e.target.value});
                      setUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => {
                      setProfile({...profile, email: e.target.value});
                      setUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Trading Experience</Label>
                  <Select 
                    value={profile.tradingExperience} 
                    onValueChange={(value) => {
                      setProfile({...profile, tradingExperience: value});
                      setUnsavedChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (1-5 years)</SelectItem>
                      <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Investment Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Risk Tolerance</Label>
                  <div className="px-3">
                    <Slider
                      value={[profile.riskTolerance]}
                      onValueChange={(value) => {
                        setProfile({...profile, riskTolerance: value[0]});
                        setUnsavedChanges(true);
                      }}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Conservative</span>
                      <span className={riskInfo.color}>{riskInfo.label} ({profile.riskTolerance}/10)</span>
                      <span>Aggressive</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Investment Goals</Label>
                  <div className="flex flex-wrap gap-2">
                    {investmentGoalOptions.map((goal) => (
                      <Badge
                        key={goal}
                        variant={profile.investmentGoals.includes(goal) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const newGoals = profile.investmentGoals.includes(goal)
                            ? profile.investmentGoals.filter(g => g !== goal)
                            : [...profile.investmentGoals, goal];
                          setProfile({...profile, investmentGoals: newGoals});
                          setUnsavedChanges(true);
                        }}
                      >
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Asset Classes</Label>
                  <div className="flex flex-wrap gap-2">
                    {assetClassOptions.map((asset) => (
                      <Badge
                        key={asset}
                        variant={profile.preferredAssets.includes(asset) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const newAssets = profile.preferredAssets.includes(asset)
                            ? profile.preferredAssets.filter(a => a !== asset)
                            : [...profile.preferredAssets, asset];
                          setProfile({...profile, preferredAssets: newAssets});
                          setUnsavedChanges(true);
                        }}
                      >
                        {asset}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alert Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                  </div>
                  <Switch
                    id="email-alerts"
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) => {
                      setNotifications({...notifications, emailAlerts: checked});
                      setUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => {
                      setNotifications({...notifications, pushNotifications: checked});
                      setUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <Label htmlFor="signal-alerts">AI Signal Alerts</Label>
                  </div>
                  <Switch
                    id="signal-alerts"
                    checked={notifications.signalAlerts}
                    onCheckedChange={(checked) => {
                      setNotifications({...notifications, signalAlerts: checked});
                      setUnsavedChanges(true);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="portfolio-updates">Portfolio Updates</Label>
                  <Switch
                    id="portfolio-updates"
                    checked={notifications.portfolioUpdates}
                    onCheckedChange={(checked) => {
                      setNotifications({...notifications, portfolioUpdates: checked});
                      setUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="market-news">Market News</Label>
                  <Switch
                    id="market-news"
                    checked={notifications.marketNews}
                    onCheckedChange={(checked) => {
                      setNotifications({...notifications, marketNews: checked});
                      setUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="price-targets">Price Target Alerts</Label>
                  <Switch
                    id="price-targets"
                    checked={notifications.priceTargets}
                    onCheckedChange={(checked) => {
                      setNotifications({...notifications, priceTargets: checked});
                      setUnsavedChanges(true);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Max Position Size (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[tradingPrefs.maxPositionSize]}
                      onValueChange={(value) => {
                        setTradingPrefs({...tradingPrefs, maxPositionSize: value[0]});
                        setUnsavedChanges(true);
                      }}
                      max={50}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-muted-foreground mt-1">
                      {tradingPrefs.maxPositionSize}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Default Stop Loss (%)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={tradingPrefs.defaultStopLoss}
                    onChange={(e) => {
                      setTradingPrefs({...tradingPrefs, defaultStopLoss: Number(e.target.value)});
                      setUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Default Take Profit (%)</Label>
                  <Input
                    type="number"
                    min="5"
                    max="100"
                    value={tradingPrefs.defaultTakeProfit}
                    onChange={(e) => {
                      setTradingPrefs({...tradingPrefs, defaultTakeProfit: Number(e.target.value)});
                      setUnsavedChanges(true);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Execution Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-execution">Auto-Execute Signals</Label>
                  <Switch
                    id="auto-execution"
                    checked={tradingPrefs.autoExecution}
                    onCheckedChange={(checked) => {
                      setTradingPrefs({...tradingPrefs, autoExecution: checked});
                      setUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Trading Hours</Label>
                  <Select 
                    value={tradingPrefs.tradingHours} 
                    onValueChange={(value) => {
                      setTradingPrefs({...tradingPrefs, tradingHours: value});
                      setUnsavedChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Hours Only</SelectItem>
                      <SelectItem value="extended">Extended Hours</SelectItem>
                      <SelectItem value="24/7">24/7 (Crypto)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Risk Per Trade (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[tradingPrefs.riskPerTrade]}
                      onValueChange={(value) => {
                        setTradingPrefs({...tradingPrefs, riskPerTrade: value[0]});
                        setUnsavedChanges(true);
                      }}
                      max={10}
                      min={0.5}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-muted-foreground mt-1">
                      {tradingPrefs.riskPerTrade}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Display Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-muted-foreground py-8">
                Security settings will be implemented with proper authentication system
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSaveSettings} disabled={!unsavedChanges}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default UserSettings;