import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Zap, Filter, Search, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AISignal {
  id: number;
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  reasoning: string;
  timestamp: string;
  target_price?: number;
  stop_loss?: number;
}

const AISignalCenter = () => {
  const [signals, setSignals] = useState<AISignal[]>([]);
  const [filteredSignals, setFilteredSignals] = useState<AISignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterSignals();
  }, [signals, filterType, filterRisk, searchTerm]);

  const fetchSignals = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_signals")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(50);

      if (error) throw error;
      
      setSignals(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching signals:", error);
      toast({
        title: "Error",
        description: "Failed to fetch AI signals",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const filterSignals = () => {
    let filtered = signals;

    if (filterType !== "all") {
      filtered = filtered.filter(signal => signal.signal === filterType);
    }

    if (filterRisk !== "all") {
      filtered = filtered.filter(signal => signal.risk === filterRisk);
    }

    if (searchTerm) {
      filtered = filtered.filter(signal => 
        signal.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signal.reasoning.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSignals(filtered);
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'text-profit';
      case 'SELL': return 'text-loss';
      case 'HOLD': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BUY': return <TrendingUp className="h-4 w-4" />;
      case 'SELL': return <TrendingDown className="h-4 w-4" />;
      case 'HOLD': return <AlertTriangle className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-profit/20 text-profit border-profit/30';
      case 'MEDIUM': return 'bg-warning/20 text-warning border-warning/30';
      case 'HIGH': return 'bg-loss/20 text-loss border-loss/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
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
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-profit">{signals.filter(s => s.signal === 'BUY').length}</div>
            <div className="text-sm text-muted-foreground">Buy Signals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-loss">{signals.filter(s => s.signal === 'SELL').length}</div>
            <div className="text-sm text-muted-foreground">Sell Signals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{signals.filter(s => s.signal === 'HOLD').length}</div>
            <div className="text-sm text-muted-foreground">Hold Signals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {signals.length > 0 ? Math.round(signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Confidence</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Signal Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search symbols or reasoning..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Signal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="BUY">Buy</SelectItem>
                <SelectItem value="SELL">Sell</SelectItem>
                <SelectItem value="HOLD">Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchSignals} variant="outline" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Signals List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Signals ({filteredSignals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSignals.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No signals match your current filters
              </div>
            ) : (
              filteredSignals.map((signal) => (
                <div key={signal.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full bg-muted ${getSignalColor(signal.signal)}`}>
                        {getSignalIcon(signal.signal)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg">{signal.symbol}</span>
                          <Badge variant={signal.signal === 'BUY' ? 'default' : signal.signal === 'SELL' ? 'destructive' : 'secondary'}>
                            {signal.signal}
                          </Badge>
                          <div className={`px-2 py-1 rounded-md text-xs border ${getRiskColor(signal.risk)}`}>
                            {signal.risk} RISK
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{signal.reasoning}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(signal.timestamp)}
                          </div>
                          {signal.target_price && (
                            <div>Target: ${signal.target_price}</div>
                          )}
                          {signal.stop_loss && (
                            <div>Stop Loss: ${signal.stop_loss}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{signal.confidence}%</div>
                      <div className="text-xs text-muted-foreground">Confidence</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISignalCenter;