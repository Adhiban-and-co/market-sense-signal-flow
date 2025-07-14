import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Target,
  AlertCircle,
  Plus,
  Minus
} from "lucide-react";

interface Holding {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
  allocation: number;
}

interface PortfolioMetrics {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  dayChange: number;
  dayChangePercent: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
}

const PortfolioManager = () => {
  const [holdings, setHoldings] = useState<Holding[]>([
    {
      symbol: "AAPL",
      quantity: 50,
      avgPrice: 150.25,
      currentPrice: 175.50,
      value: 8775,
      gainLoss: 1262.50,
      gainLossPercent: 16.78,
      allocation: 35.1
    },
    {
      symbol: "MSFT",
      quantity: 25,
      avgPrice: 280.00,
      currentPrice: 295.75,
      value: 7393.75,
      gainLoss: 393.75,
      gainLossPercent: 5.63,
      allocation: 29.6
    },
    {
      symbol: "GOOGL",
      quantity: 15,
      avgPrice: 120.50,
      currentPrice: 135.25,
      value: 2028.75,
      gainLoss: 221.25,
      gainLossPercent: 12.24,
      allocation: 8.1
    },
    {
      symbol: "TSLA",
      quantity: 30,
      avgPrice: 200.00,
      currentPrice: 185.50,
      value: 5565,
      gainLoss: -435,
      gainLossPercent: -7.25,
      allocation: 22.3
    },
    {
      symbol: "NVDA",
      quantity: 10,
      avgPrice: 450.00,
      currentPrice: 485.25,
      value: 4852.50,
      gainLoss: 352.50,
      gainLossPercent: 7.83,
      allocation: 19.4
    }
  ]);

  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalValue: 125430.50,
    totalGainLoss: 15640.25,
    totalGainLossPercent: 12.47,
    dayChange: 2340.75,
    dayChangePercent: 1.90,
    sharpeRatio: 1.25,
    maxDrawdown: -8.5,
    winRate: 67.3
  });

  const [rebalanceNeeded, setRebalanceNeeded] = useState(true);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setHoldings(prev => prev.map(holding => ({
        ...holding,
        currentPrice: holding.currentPrice * (1 + (Math.random() - 0.5) * 0.02),
        value: holding.quantity * holding.currentPrice,
        gainLoss: (holding.currentPrice - holding.avgPrice) * holding.quantity,
        gainLossPercent: ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getRiskLevel = (allocation: number) => {
    if (allocation > 30) return { level: "HIGH", color: "text-loss" };
    if (allocation > 20) return { level: "MEDIUM", color: "text-warning" };
    return { level: "LOW", color: "text-profit" };
  };

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? "text-profit" : "text-loss";
  };

  const topPerformers = [...holdings].sort((a, b) => b.gainLossPercent - a.gainLossPercent).slice(0, 3);
  const worstPerformers = [...holdings].sort((a, b) => a.gainLossPercent - b.gainLossPercent).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Portfolio Value</span>
            </div>
            <div className="text-2xl font-bold">${metrics.totalValue.toLocaleString()}</div>
            <div className={`text-sm flex items-center gap-1 ${getPerformanceColor(metrics.dayChange)}`}>
              {metrics.dayChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              ${Math.abs(metrics.dayChange).toFixed(2)} ({metrics.dayChangePercent.toFixed(2)}%) today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Return</span>
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.totalGainLoss)}`}>
              ${metrics.totalGainLoss.toLocaleString()}
            </div>
            <div className={`text-sm ${getPerformanceColor(metrics.totalGainLoss)}`}>
              {metrics.totalGainLossPercent.toFixed(2)}% all time
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
            </div>
            <div className="text-2xl font-bold">{metrics.sharpeRatio}</div>
            <div className="text-sm text-muted-foreground">Risk-adjusted return</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Max Drawdown</span>
            </div>
            <div className="text-2xl font-bold text-loss">{metrics.maxDrawdown}%</div>
            <div className="text-sm text-muted-foreground">Largest peak-to-trough decline</div>
          </CardContent>
        </Card>
      </div>

      {/* Rebalance Alert */}
      {rebalanceNeeded && (
        <Card className="border-warning bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                <div>
                  <div className="font-semibold">Portfolio Rebalancing Recommended</div>
                  <div className="text-sm text-muted-foreground">
                    Some positions have drifted significantly from target allocations
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="holdings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Current Holdings
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Position
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdings.map((holding) => {
                  const risk = getRiskLevel(holding.allocation);
                  return (
                    <div key={holding.symbol} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-lg">{holding.symbol}</div>
                          <Badge variant="outline">{holding.quantity} shares</Badge>
                          <div className={`text-xs px-2 py-1 rounded ${risk.color} bg-current/10`}>
                            {risk.level} CONCENTRATION
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${holding.value.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{holding.allocation}% of portfolio</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Avg Cost</div>
                          <div className="font-medium">${holding.avgPrice.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Current Price</div>
                          <div className="font-medium">${holding.currentPrice.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Gain/Loss</div>
                          <div className={`font-medium ${getPerformanceColor(holding.gainLoss)}`}>
                            ${holding.gainLoss.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Return</div>
                          <div className={`font-medium ${getPerformanceColor(holding.gainLoss)}`}>
                            {holding.gainLossPercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Progress value={holding.allocation} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-profit" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.map((holding, index) => (
                    <div key={holding.symbol} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{index + 1}.</div>
                        <div className="font-semibold">{holding.symbol}</div>
                      </div>
                      <div className="text-profit font-medium">
                        +{holding.gainLossPercent.toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-loss" />
                  Worst Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {worstPerformers.map((holding, index) => (
                    <div key={holding.symbol} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{index + 1}.</div>
                        <div className="font-semibold">{holding.symbol}</div>
                      </div>
                      <div className="text-loss font-medium">
                        {holding.gainLossPercent.toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Portfolio Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdings.map((holding) => (
                  <div key={holding.symbol} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{holding.symbol}</span>
                      <span className="text-sm text-muted-foreground">{holding.allocation}%</span>
                    </div>
                    <Progress value={holding.allocation} className="h-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-profit">{metrics.winRate}%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{holdings.length}</div>
                <div className="text-sm text-muted-foreground">Positions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{Math.max(...holdings.map(h => h.allocation)).toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Largest Position</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioManager;