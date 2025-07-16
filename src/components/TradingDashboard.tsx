import { useEffect, useState } from "react"; 
import { supabase } from "../supabaseClient";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Target, 
  Settings, 
  RefreshCw,
  Clock,
  DollarSign,
  BarChart3
} from "lucide-react";
import AISignalCenter from "./AISignalCenter";
import PortfolioManager from "./PortfolioManager";
import BacktestingEngine from "./BacktestingEngine";
import UserSettings from "./UserSettings";
import SignalGenerator from "./SignalGenerator";
import RiskManager from "./RiskManager";
import MarketScanner from "./MarketScanner";
import TradingAlerts from "./TradingAlerts";
import PerformanceAnalytics from "./PerformanceAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const TradingDashboard = () => {
  const [aiSignals, setAiSignals] = useState<any[]>([]);

useEffect(() => {
  const fetchSignals = async () => {
    const { data, error } = await supabase
      .from("ai_signals")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error.message);
    } else {
      console.log("Signals from Supabase:", data);
      setAiSignals(data);
    }
  };

  fetchSignals();
}, []);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "signals", label: "AI Signals", icon: Zap },
    { id: "generate", label: "Generate Signals", icon: Activity },
    { id: "backtest", label: "Backtesting", icon: Target },
    { id: "portfolio", label: "Portfolio", icon: DollarSign },
    { id: "risk", label: "Risk Manager", icon: Target },
    { id: "scanner", label: "Market Scanner", icon: Activity },
    { id: "alerts", label: "Trading Alerts", icon: Zap },
    { id: "analytics", label: "Performance", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const marketData = [
    { symbol: "SPY", price: 485.62, change: 2.45, changePercent: 0.51 },
    { symbol: "QQQ", price: 412.88, change: -1.23, changePercent: -0.30 },
    { symbol: "BTC", price: 67420.50, change: 1250.30, changePercent: 1.89 },
    { symbol: "ETH", price: 3842.15, change: -85.45, changePercent: -2.18 },
  ];
  
  const handleRefresh = () => {
    setLastUpdated(new Date().toLocaleTimeString());
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="w-64">
          <SidebarContent>
            <div className="p-4 border-b border-sidebar-border">
              <h1 className="text-xl font-bold text-sidebar-foreground">AI Trading Assistant</h1>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        className={activeSection === item.id ? "bg-sidebar-accent" : ""}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Last updated: {lastUpdated}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-profit rounded-full animate-pulse" />
                <span className="text-sm">Market Open</span>
              </div>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 p-6 space-y-6">
            {activeSection === "dashboard" && (
              <>
                {/* Market Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {marketData.map((asset) => (
                    <Card key={asset.symbol}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{asset.symbol}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${asset.price.toLocaleString()}</div>
                        <div className={`flex items-center gap-1 text-sm ${
                          asset.change >= 0 ? "text-profit" : "text-loss"
                        }`}>
                          {asset.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          ${Math.abs(asset.change).toFixed(2)} ({Math.abs(asset.changePercent).toFixed(2)}%)
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* AI Signals Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Latest AI Signals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {aiSignals.map((signal, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="font-semibold">{signal.symbol}</div>
                            <Badge 
                              variant={signal.signal === "BUY" ? "default" : signal.signal === "SELL" ? "destructive" : "secondary"}
                            >
                              {signal.signal}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{signal.confidence}% confidence</div>
                            <div className="text-xs text-muted-foreground">{signal.risk} risk</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Portfolio Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Portfolio Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-profit">+12.4%</div>
                        <div className="text-sm text-muted-foreground">Total Return</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">$125,430</div>
                        <div className="text-sm text-muted-foreground">Portfolio Value</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">1.25</div>
                        <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeSection === "signals" && <AISignalCenter />}
            {activeSection === "generate" && <SignalGenerator />}
            {activeSection === "backtest" && <BacktestingEngine />}
            {activeSection === "portfolio" && <PortfolioManager />}
            {activeSection === "risk" && <RiskManager />}
            {activeSection === "scanner" && <MarketScanner />}
            {activeSection === "alerts" && <TradingAlerts />}
            {activeSection === "analytics" && <PerformanceAnalytics />}
            {activeSection === "settings" && <UserSettings />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TradingDashboard;
