import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, TrendingDown, TrendingUp, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../supabaseClient";

const RiskManager = () => {
  const { toast } = useToast();
  const [riskSettings, setRiskSettings] = useState({
    maxPortfolioRisk: 2.5,
    maxPositionSize: 10,
    stopLossEnabled: true,
    stopLossPercentage: 5,
    takeProfitEnabled: true,
    takeProfitPercentage: 15,
    maxDrawdown: 20,
    riskPerTrade: 1
  });

  const [riskMetrics, setRiskMetrics] = useState({
    currentDrawdown: 8.2,
    var95: 12.5,
    sharpeRatio: 1.85,
    beta: 0.92,
    correlationRisk: "MEDIUM"
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: "warning", message: "Portfolio risk approaching limit (82%)", active: true },
    { id: 2, type: "info", message: "High correlation detected in tech positions", active: true },
    { id: 3, type: "danger", message: "Stop loss triggered on TSLA position", active: false }
  ]);

  const handleSaveSettings = async () => {
    try {
      const { error } = await supabase
        .from("risk_settings")
        .upsert({
          id: 1,
          ...riskSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Risk management settings updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save risk settings.",
        variant: "destructive",
      });
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW": return "text-profit";
      case "MEDIUM": return "text-warning";
      case "HIGH": return "text-loss";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Risk Management</h2>
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Risk Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxRisk">Max Portfolio Risk (%)</Label>
                <Input
                  id="maxRisk"
                  type="number"
                  value={riskSettings.maxPortfolioRisk}
                  onChange={(e) => setRiskSettings(prev => ({
                    ...prev,
                    maxPortfolioRisk: parseFloat(e.target.value)
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="maxPosition">Max Position Size (%)</Label>
                <Input
                  id="maxPosition"
                  type="number"
                  value={riskSettings.maxPositionSize}
                  onChange={(e) => setRiskSettings(prev => ({
                    ...prev,
                    maxPositionSize: parseFloat(e.target.value)
                  }))}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="stopLoss">Stop Loss Protection</Label>
                <Switch
                  id="stopLoss"
                  checked={riskSettings.stopLossEnabled}
                  onCheckedChange={(checked) => setRiskSettings(prev => ({
                    ...prev,
                    stopLossEnabled: checked
                  }))}
                />
              </div>
              {riskSettings.stopLossEnabled && (
                <Input
                  type="number"
                  placeholder="Stop Loss %"
                  value={riskSettings.stopLossPercentage}
                  onChange={(e) => setRiskSettings(prev => ({
                    ...prev,
                    stopLossPercentage: parseFloat(e.target.value)
                  }))}
                />
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="takeProfit">Take Profit</Label>
                <Switch
                  id="takeProfit"
                  checked={riskSettings.takeProfitEnabled}
                  onCheckedChange={(checked) => setRiskSettings(prev => ({
                    ...prev,
                    takeProfitEnabled: checked
                  }))}
                />
              </div>
              {riskSettings.takeProfitEnabled && (
                <Input
                  type="number"
                  placeholder="Take Profit %"
                  value={riskSettings.takeProfitPercentage}
                  onChange={(e) => setRiskSettings(prev => ({
                    ...prev,
                    takeProfitPercentage: parseFloat(e.target.value)
                  }))}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Risk Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-primary" />
              Current Risk Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Current Drawdown</span>
                <div className="flex items-center gap-2">
                  <Progress value={riskMetrics.currentDrawdown} className="w-20" />
                  <span className="text-sm font-medium">{riskMetrics.currentDrawdown}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Value at Risk (95%)</span>
                <span className="text-sm font-medium">${riskMetrics.var95}k</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Sharpe Ratio</span>
                <span className="text-sm font-medium text-profit">{riskMetrics.sharpeRatio}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Portfolio Beta</span>
                <span className="text-sm font-medium">{riskMetrics.beta}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Correlation Risk</span>
                <Badge variant="secondary" className={getRiskColor(riskMetrics.correlationRisk)}>
                  {riskMetrics.correlationRisk}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Risk Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  alert.active ? "border-warning bg-warning/5" : "border-border bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle 
                    className={`h-4 w-4 ${
                      alert.type === "danger" ? "text-loss" : 
                      alert.type === "warning" ? "text-warning" : "text-info"
                    }`} 
                  />
                  <span className="text-sm">{alert.message}</span>
                </div>
                <Badge variant={alert.active ? "destructive" : "secondary"}>
                  {alert.active ? "Active" : "Resolved"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskManager;