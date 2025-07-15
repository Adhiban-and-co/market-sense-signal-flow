import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Portfolio {
  id: number;
  symbol: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  type: 'STOCK' | 'CRYPTO' | 'ETF';
  created_at: string;
}

const PortfolioManager = () => {
  const [holdings, setHoldings] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddPositionOpen, setIsAddPositionOpen] = useState(false);
  const [newPosition, setNewPosition] = useState({
    symbol: "",
    quantity: "",
    avgPrice: "",
    type: "STOCK"
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHoldings(data || []);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      toast({
        title: "Error",
        description: "Failed to fetch portfolio data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addPosition = async () => {
    if (!newPosition.symbol || !newPosition.quantity || !newPosition.avgPrice) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("portfolio")
        .insert([{
          symbol: newPosition.symbol.toUpperCase(),
          quantity: parseFloat(newPosition.quantity),
          avg_price: parseFloat(newPosition.avgPrice),
          current_price: parseFloat(newPosition.avgPrice), // Initial price same as avg
          type: newPosition.type
        }])
        .select();

      if (error) throw error;

      if (data) {
        setHoldings([...holdings, ...data]);
      }
      setNewPosition({ symbol: "", quantity: "", avgPrice: "", type: "STOCK" });
      setIsAddPositionOpen(false);
      
      toast({
        title: "Success",
        description: "Position added successfully",
      });
    } catch (error) {
      console.error("Error adding position:", error);
      toast({
        title: "Error",
        description: "Failed to add position",
        variant: "destructive",
      });
    }
  };

  const deletePosition = async (id: number) => {
    try {
      const { error } = await supabase
        .from("portfolio")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setHoldings(holdings.filter(h => h.id !== id));
      toast({
        title: "Success",
        description: "Position deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting position:", error);
      toast({
        title: "Error",
        description: "Failed to delete position",
        variant: "destructive",
      });
    }
  };

  const calculateMetrics = () => {
    const totalValue = holdings.reduce((sum, holding) => sum + (holding.quantity * holding.current_price), 0);
    const totalCost = holdings.reduce((sum, holding) => sum + (holding.quantity * holding.avg_price), 0);
    const totalPnL = totalValue - totalCost;
    const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;
    
    return { totalValue, totalPnL, totalPnLPercent };
  };

  const { totalValue, totalPnL, totalPnLPercent } = calculateMetrics();

  const getRiskLevel = (allocation: number) => {
    if (allocation > 30) return { level: "HIGH", color: "text-loss" };
    if (allocation > 20) return { level: "MEDIUM", color: "text-warning" };
    return { level: "LOW", color: "text-profit" };
  };

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? "text-profit" : "text-loss";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Portfolio Value</span>
            </div>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total P&L</span>
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(totalPnL)}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString()}
            </div>
            <div className={`text-sm ${getPerformanceColor(totalPnL)}`}>
              {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Positions</span>
            </div>
            <div className="text-2xl font-bold">{holdings.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Holdings
            <Dialog open={isAddPositionOpen} onOpenChange={setIsAddPositionOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Position
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Position</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                      id="symbol"
                      placeholder="AAPL"
                      value={newPosition.symbol}
                      onChange={(e) => setNewPosition({...newPosition, symbol: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="100"
                      value={newPosition.quantity}
                      onChange={(e) => setNewPosition({...newPosition, quantity: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="avgPrice">Average Price</Label>
                    <Input
                      id="avgPrice"
                      type="number"
                      placeholder="150.50"
                      value={newPosition.avgPrice}
                      onChange={(e) => setNewPosition({...newPosition, avgPrice: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={newPosition.type} onValueChange={(value) => setNewPosition({...newPosition, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STOCK">Stock</SelectItem>
                        <SelectItem value="CRYPTO">Crypto</SelectItem>
                        <SelectItem value="ETF">ETF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsAddPositionOpen(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={addPosition} className="flex-1">Add Position</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {holdings.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No positions found. Add your first position to get started.
              </div>
            ) : (
              holdings.map((holding) => {
                const currentValue = holding.quantity * holding.current_price;
                const costBasis = holding.quantity * holding.avg_price;
                const pnl = currentValue - costBasis;
                const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
                const allocation = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
                const risk = getRiskLevel(allocation);

                return (
                  <div key={holding.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-lg">{holding.symbol}</div>
                        <Badge variant={holding.type === "STOCK" ? "default" : holding.type === "CRYPTO" ? "secondary" : "outline"}>
                          {holding.type}
                        </Badge>
                        <div className={`text-xs px-2 py-1 rounded ${risk.color} bg-current/10`}>
                          {risk.level} RISK
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold">${currentValue.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{allocation.toFixed(1)}% allocation</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePosition(holding.id)}
                          className="text-loss hover:text-loss"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Quantity</div>
                        <div className="font-medium">{holding.quantity}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg Price</div>
                        <div className="font-medium">${holding.avg_price.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Current Price</div>
                        <div className="font-medium">${holding.current_price.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">P&L</div>
                        <div className={`font-medium ${getPerformanceColor(pnl)}`}>
                          {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress value={allocation} className="h-2" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioManager;