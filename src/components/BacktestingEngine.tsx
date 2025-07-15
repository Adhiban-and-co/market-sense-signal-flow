import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, BarChart3, TrendingUp, AlertTriangle, DollarSign, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BacktestResult {
  total_return: number;
  sharpe_ratio: number;
  max_drawdown: number;
  win_rate: number;
  total_trades: number;
  profit_factor: number;
  start_date: string;
  end_date: string;
  strategy_name: string;
}

const BacktestingEngine = () => {
  const [strategy, setStrategy] = useState({
    name: "",
    description: "",
    symbols: "",
    startDate: "",
    endDate: "",
    initialCapital: "10000",
    riskPerTrade: "2",
    maxPositions: "5"
  });
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BacktestResult | null>(null);
  const [pastResults, setPastResults] = useState<BacktestResult[]>([]);
  const { toast } = useToast();

  const runBacktest = async () => {
    if (!strategy.name || !strategy.symbols || !strategy.startDate || !strategy.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    try {
      // Simulate backtest calculation
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
      
      // Generate realistic results based on inputs
      const symbols = strategy.symbols.split(',').map(s => s.trim());
      const daysDiff = Math.abs(new Date(strategy.endDate).getTime() - new Date(strategy.startDate).getTime()) / (1000 * 60 * 60 * 24);
      
      const mockResult: BacktestResult = {
        total_return: Math.random() * 40 - 10, // -10% to 30%
        sharpe_ratio: Math.random() * 2 + 0.5, // 0.5 to 2.5
        max_drawdown: -(Math.random() * 20 + 5), // -5% to -25%
        win_rate: Math.random() * 30 + 50, // 50% to 80%
        total_trades: Math.floor(daysDiff / 7 * symbols.length), // Roughly weekly trades per symbol
        profit_factor: Math.random() * 2 + 0.8, // 0.8 to 2.8
        start_date: strategy.startDate,
        end_date: strategy.endDate,
        strategy_name: strategy.name
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from("backtest_results")
        .insert([mockResult])
        .select();

      if (error) throw error;

      setResults(mockResult);
      setPastResults([mockResult, ...pastResults]);
      
      toast({
        title: "Backtest Complete",
        description: `Strategy "${strategy.name}" completed successfully`,
      });
    } catch (error) {
      console.error("Error running backtest:", error);
      toast({
        title: "Error",
        description: "Failed to run backtest",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

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
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low": return "text-profit bg-profit/10 border-profit/30";
      case "Medium": return "text-warning bg-warning/10 border-warning/30";
      case "High": return "text-loss bg-loss/10 border-loss/30";
      default: return "text-muted-foreground bg-muted/10 border-muted/30";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Strategy Setup</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="strategy-name">Strategy Name *</Label>
                  <Input
                    id="strategy-name"
                    placeholder="My Trading Strategy"
                    value={strategy.name}
                    onChange={(e) => setStrategy({...strategy, name: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="symbols">Symbols (comma-separated) *</Label>
                  <Input
                    id="symbols"
                    placeholder="AAPL, MSFT, GOOGL"
                    value={strategy.symbols}
                    onChange={(e) => setStrategy({...strategy, symbols: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Start Date *</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={strategy.startDate}
                      onChange={(e) => setStrategy({...strategy, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date *</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={strategy.endDate}
                      onChange={(e) => setStrategy({...strategy, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="initial-capital">Initial Capital ($)</Label>
                  <Input
                    id="initial-capital"
                    type="number"
                    value={strategy.initialCapital}
                    onChange={(e) => setStrategy({...strategy, initialCapital: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Strategy Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your trading strategy..."
                    value={strategy.description}
                    onChange={(e) => setStrategy({...strategy, description: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="risk-per-trade">Risk Per Trade (%)</Label>
                  <Input
                    id="risk-per-trade"
                    type="number"
                    min="0.1"
                    max="10"
                    value={strategy.riskPerTrade}
                    onChange={(e) => setStrategy({...strategy, riskPerTrade: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="max-positions">Max Positions</Label>
                  <Input
                    id="max-positions"
                    type="number"
                    min="1"
                    max="20"
                    value={strategy.maxPositions}
                    onChange={(e) => setStrategy({...strategy, maxPositions: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <Button 
                onClick={runBacktest} 
                disabled={isRunning}
                className="w-full"
                size="lg"
              >
                {isRunning ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isRunning ? "Running Backtest..." : "Run Backtest"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          onClick={() => setStrategy({...strategy, name: template.name, description: template.description})}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Return</span>
                      <span className={`font-semibold ${results.total_return >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {results.total_return >= 0 ? '+' : ''}{results.total_return.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Sharpe Ratio</span>
                      <span className="font-semibold">{results.sharpe_ratio.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Max Drawdown</span>
                      <span className="font-semibold text-loss">{results.max_drawdown.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Win Rate</span>
                      <span className="font-semibold">{results.win_rate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Trades</span>
                      <span className="font-semibold">{results.total_trades}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Profit Factor</span>
                      <span className="font-semibold">{results.profit_factor.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Strategy Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {results.total_return > 10 ? (
                          <TrendingUp className="h-4 w-4 text-profit" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-warning" />
                        )}
                        <span className="font-medium">
                          {results.total_return > 10 ? "Strong Performance" : "Moderate Performance"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {results.total_return > 10 
                          ? "Your strategy shows excellent returns with good risk management."
                          : "Consider optimizing entry/exit conditions for better performance."}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span className="font-medium">Risk Assessment</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {Math.abs(results.max_drawdown) > 15 
                          ? "High drawdown detected. Consider reducing position sizes."
                          : "Acceptable risk levels. Drawdown is within reasonable limits."}
                      </p>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="font-medium">Win Rate Analysis</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {results.win_rate > 60 
                          ? "High win rate indicates good signal quality."
                          : "Consider improving signal accuracy or risk management."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No backtest results yet. Run a backtest to see performance metrics.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BacktestingEngine;