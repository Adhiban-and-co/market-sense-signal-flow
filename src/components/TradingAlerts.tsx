import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Plus, Trash2, Mail, Smartphone, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../supabaseClient";

const TradingAlerts = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("price");
  const [alerts, setAlerts] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    emailAddress: "user@example.com",
    phoneNumber: ""
  });

  const [newPriceAlert, setNewPriceAlert] = useState({
    symbol: "",
    condition: "above",
    price: "",
    enabled: true
  });

  const [newSignalAlert, setNewSignalAlert] = useState({
    type: "any",
    minConfidence: "70",
    symbols: "",
    enabled: true
  });

  const mockAlerts = [
    {
      id: 1,
      type: "price",
      symbol: "AAPL",
      condition: "above",
      targetPrice: 190,
      currentPrice: 185.64,
      enabled: true,
      created: "2025-01-15"
    },
    {
      id: 2,
      type: "price",
      symbol: "TSLA",
      condition: "below",
      targetPrice: 240,
      currentPrice: 248.48,
      enabled: true,
      created: "2025-01-14"
    },
    {
      id: 3,
      type: "signal",
      description: "BUY signals with >80% confidence",
      enabled: true,
      triggered: 3,
      created: "2025-01-13"
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);
  }, []);

  const handleCreatePriceAlert = async () => {
    if (!newPriceAlert.symbol || !newPriceAlert.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const alert = {
      ...newPriceAlert,
      id: Date.now(),
      type: "price",
      currentPrice: 0, // Would fetch from API
      created: new Date().toISOString().split('T')[0]
    };

    setAlerts(prev => [...prev, alert]);
    setNewPriceAlert({ symbol: "", condition: "above", price: "", enabled: true });
    
    toast({
      title: "Alert Created",
      description: `Price alert for ${alert.symbol} has been set.`,
    });
  };

  const handleCreateSignalAlert = async () => {
    const alert = {
      id: Date.now(),
      type: "signal",
      description: `${newSignalAlert.type.toUpperCase()} signals with >${newSignalAlert.minConfidence}% confidence`,
      enabled: newSignalAlert.enabled,
      triggered: 0,
      created: new Date().toISOString().split('T')[0],
      ...newSignalAlert
    };

    setAlerts(prev => [...prev, alert]);
    setNewSignalAlert({ type: "any", minConfidence: "70", symbols: "", enabled: true });
    
    toast({
      title: "Alert Created",
      description: "Signal alert has been configured.",
    });
  };

  const handleDeleteAlert = (alertId: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast({
      title: "Alert Deleted",
      description: "Alert has been removed.",
    });
  };

  const handleToggleAlert = (alertId: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  const saveNotificationSettings = async () => {
    try {
      const { error } = await supabase
        .from("notification_settings")
        .upsert({
          id: 1,
          ...notificationSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Notification preferences updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trading Alerts</h2>
        <Badge variant="outline">
          {alerts.filter(a => a.enabled).length} Active
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="price">Price Alerts</TabsTrigger>
          <TabsTrigger value="signals">Signal Alerts</TabsTrigger>
          <TabsTrigger value="settings">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="price" className="space-y-4">
          {/* Create Price Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Create Price Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Symbol</Label>
                  <Input
                    placeholder="e.g., AAPL"
                    value={newPriceAlert.symbol}
                    onChange={(e) => setNewPriceAlert(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  />
                </div>
                <div>
                  <Label>Condition</Label>
                  <Select
                    value={newPriceAlert.condition}
                    onValueChange={(value) => setNewPriceAlert(prev => ({ ...prev, condition: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Above</SelectItem>
                      <SelectItem value="below">Below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Target Price</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newPriceAlert.price}
                    onChange={(e) => setNewPriceAlert(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleCreatePriceAlert} className="w-full">
                    Create Alert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Alerts List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Price Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.filter(alert => alert.type === "price").map((alert: any) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={alert.enabled}
                        onCheckedChange={() => handleToggleAlert(alert.id)}
                      />
                      <div>
                        <div className="font-semibold">{alert.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          Alert when price goes {alert.condition} ${alert.targetPrice}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm">Current: ${alert.currentPrice}</div>
                        <div className="text-xs text-muted-foreground">Target: ${alert.targetPrice}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          {/* Create Signal Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Create Signal Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Signal Type</Label>
                  <Select
                    value={newSignalAlert.type}
                    onValueChange={(value) => setNewSignalAlert(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Signal</SelectItem>
                      <SelectItem value="buy">BUY Only</SelectItem>
                      <SelectItem value="sell">SELL Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Min Confidence %</Label>
                  <Input
                    type="number"
                    value={newSignalAlert.minConfidence}
                    onChange={(e) => setNewSignalAlert(prev => ({ ...prev, minConfidence: e.target.value }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleCreateSignalAlert} className="w-full">
                    Create Alert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signal Alerts List */}
          <Card>
            <CardHeader>
              <CardTitle>Signal Alert Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.filter(alert => alert.type === "signal").map((alert: any) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={alert.enabled}
                        onCheckedChange={() => handleToggleAlert(alert.id)}
                      />
                      <div>
                        <div className="font-semibold">{alert.description}</div>
                        <div className="text-sm text-muted-foreground">
                          Triggered {alert.triggered} times
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label>Email Notifications</Label>
                  </div>
                  <Switch
                    checked={notificationSettings.emailEnabled}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({
                      ...prev,
                      emailEnabled: checked
                    }))}
                  />
                </div>
                {notificationSettings.emailEnabled && (
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={notificationSettings.emailAddress}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      emailAddress: e.target.value
                    }))}
                  />
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <Label>Push Notifications</Label>
                  </div>
                  <Switch
                    checked={notificationSettings.pushEnabled}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({
                      ...prev,
                      pushEnabled: checked
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <Label>SMS Alerts</Label>
                  </div>
                  <Switch
                    checked={notificationSettings.smsEnabled}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({
                      ...prev,
                      smsEnabled: checked
                    }))}
                  />
                </div>
                {notificationSettings.smsEnabled && (
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={notificationSettings.phoneNumber}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      phoneNumber: e.target.value
                    }))}
                  />
                )}
              </div>

              <Button onClick={saveNotificationSettings}>
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingAlerts;