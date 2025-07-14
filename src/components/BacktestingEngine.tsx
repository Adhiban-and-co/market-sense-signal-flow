import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Calendar,
  DollarSign,
  AlertTriangle,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BacktestConfig {
  strategy: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  symbols: string[];
  riskModel: string;
  maxPositionSize: number;
  stopLoss: number;
  takeProfit: number;
}

interface BacktestResult {
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  avgTradeReturn: number;
  volatility: number;
  beta: number;
  alpha: number;
}

const BacktestingEngine = () => {
  const [config, setConfig] = useState<BacktestConfig>({
    strategy: "",
    startDate: "2023-01-01",
    endDate: "2024-01-01",
    initialCapital: 100000,
    symbols: ["AAPL", "MSFT", "GOOGL"],
    riskModel: "equal-weight",
    maxPositionSize: 25,
    stopLoss: 5,
    takeProfit: 15
  });

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BacktestResult | null>({
    totalReturn: 23.45,
    annualizedReturn: 18.7,
    sharpeRatio: 1.34,
    maxDrawdown: -12.3,
    winRate: 68.5,
    totalTrades: 147,
    avgTradeReturn: 2.1,
    volatility: 16.8,
    beta: 0.85,
    alpha: 4.2
  });

  const [selectedStrategy, setSelectedStrategy] = useState("");

  const strategyTemplates = [
    {
      name: "Mean Reversion",
      description: "Buy oversold stocks, sell overbought stocks",
      riskLevel: "Medium"
    },
    {
      name: "Momentum",
      description: "Follow trending stocks with strong momentum",
      riskLevel: "High"
    },
    {
      name: "RSI Crossover",
      description: "Trade based on RSI indicator signals",
      riskLevel: "Low"
    },
    {
      name: "Moving Average",
      description: "Golden cross and death cross signals",
      riskLevel: "Medium"
    },
    {
      name: "Bollinger Bands",
      description: "Trade band breaks and mean reversion",
      riskLevel: "Medium"
    }
  ];

  const handleRunBacktest = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate backtest progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low": return "text-profit bg-profit/10 border-profit/30";
      case "Medium": return "text-warning bg-warning/10 border-warning/30";
      case "High": return "text-loss bg-loss/10 border-loss/30";
      default: return "text-muted-foreground bg-muted/10 border-muted/30";
    }
  };

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? "text-profit" : "text-loss";
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Strategy Setup</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="strategy-name">Strategy Name</Label>
                  <Input
                    id="strategy-name"
                    placeholder="My Trading Strategy"
                    value={config.strategy}
                    onChange={(e) => setConfig({...config, strategy: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={config.startDate}
                      onChange={(e) => setConfig({...config, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={config.endDate}
                      onChange={(e) => setConfig({...config, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initial-capital">Initial Capital ($)</Label>
                  <Input
                    id="initial-capital"
                    type="number"
                    value={config.initialCapital}
                    onChange={(e) => setConfig({...config, initialCapital: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symbols">Symbols (comma-separated)</Label>
                  <Input
                    id="symbols"
                    placeholder="AAPL, MSFT, GOOGL"
                    value={config.symbols.join(", ")}
                    onChange={(e) => setConfig({...config, symbols: e.target.value.split(",").map(s => s.trim())})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="risk-model">Risk Model</Label>
                  <Select value={config.riskModel} onValueChange={(value) => setConfig({...config, riskModel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal-weight">Equal Weight</SelectItem>
                      <SelectItem value="market-cap">Market Cap Weighted</SelectItem>
                      <SelectItem value="risk-parity">Risk Parity</SelectItem>
                      <SelectItem value="momentum">Momentum Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-position">Max Position Size (%)</Label>
                  <Input
                    id="max-position"
                    type="number"
                    min="1"
                    max="100"
                    value={config.maxPositionSize}
                    onChange={(e) => setConfig({...config, maxPositionSize: Number(e.target.value)})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                    <Input
                      id="stop-loss"
                      type="number"
                      min="0"
                      max="50"
                      value={config.stopLoss}
                      onChange={(e) => setConfig({...config, stopLoss: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="take-profit">Take Profit (%)</Label>
                    <Input
                      id="take-profit"
                      type="number"
                      min="0"
                      max="100"
                      value={config.takeProfit}
                      onChange={(e) => setConfig({...config, takeProfit: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strategy-logic">Strategy Logic</Label>
                  <Textarea
                    id="strategy-logic"
                    placeholder="Enter your trading logic here..."
                    className="min-h-24"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {isRunning ? (
                    <Button onClick={() => setIsRunning(false)} variant="outline" size="sm">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={handleRunBacktest} disabled={!config.strategy}>
                      <Play className="h-4 w-4 mr-2" />
                      Run Backtest
                    </Button>
                  )}
                  
                  {isRunning && (
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="w-32" />
                      <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Estimated time: ~{Math.ceil((config.symbols.length * 30) / 60)} minutes
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {strategyTemplates.map((template) => (
                  <Card key={template.name} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge className={`text-xs px-2 py-1 border ${getRiskColor(template.riskLevel)}`}>
                            {template.riskLevel}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setSelectedStrategy(template.name)}
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {results ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Total Return</span>
                    </div>
                    <div className={`text-2xl font-bold ${getPerformanceColor(results.totalReturn)}`}>
                      {results.totalReturn > 0 ? '+' : ''}{results.totalReturn}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                    </div>
                    <div className="text-2xl font-bold">{results.sharpeRatio}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Max Drawdown</span>
                    </div>
                    <div className="text-2xl font-bold text-loss">{results.maxDrawdown}%</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Win Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-profit">{results.winRate}%</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Annualized Return</span>
                      <span className={`font-medium ${getPerformanceColor(results.annualizedReturn)}`}>
                        {results.annualizedReturn}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Volatility</span>
                      <span className="font-medium">{results.volatility}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alpha</span>
                      <span className={`font-medium ${getPerformanceColor(results.alpha)}`}>
                        {results.alpha}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Beta</span>
                      <span className="font-medium">{results.beta}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Trade Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Trades</span>
                      <span className="font-medium">{results.totalTrades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Trade Return</span>
                      <span className={`font-medium ${getPerformanceColor(results.avgTradeReturn)}`}>
                        {results.avgTradeReturn}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win Rate</span>
                      <span className="font-medium text-profit">{results.winRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profit Factor</span>
                      <span className="font-medium">1.67</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Backtest Report
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    Detailed performance chart and trade log will be displayed here
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center text-muted-foreground py-12">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No backtest results yet. Run a backtest to see performance metrics.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backtest History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Previous backtest results will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BacktestingEngine;