import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, TrendingUp, TrendingDown, Eye, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MarketScanner = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("custom");
  const [scanResults, setScanResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  
  const [customFilters, setCustomFilters] = useState({
    priceMin: "",
    priceMax: "",
    volumeMin: "",
    marketCap: "any",
    sector: "any",
    rsiMin: "",
    rsiMax: "",
    changePercent: ""
  });

  const presetScans = [
    { id: "momentum", name: "Momentum Stocks", description: "High volume, trending up" },
    { id: "oversold", name: "Oversold Opportunities", description: "RSI < 30, good fundamentals" },
    { id: "breakout", name: "Breakout Candidates", description: "Near 52-week highs, high volume" },
    { id: "dividend", name: "Dividend Aristocrats", description: "High dividend yield, stable" },
    { id: "growth", name: "Growth Stocks", description: "High growth rate, momentum" },
    { id: "value", name: "Value Plays", description: "Low P/E, undervalued" }
  ];

  const mockResults = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 185.64,
      change: 3.45,
      changePercent: 1.89,
      volume: "45.2M",
      rsi: 68.5,
      marketCap: "2.85T",
      score: 8.7
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      price: 875.32,
      change: -12.45,
      changePercent: -1.40,
      volume: "52.8M",
      rsi: 45.2,
      marketCap: "2.15T",
      score: 9.2
    },
    {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      price: 248.48,
      change: 8.92,
      changePercent: 3.72,
      volume: "78.5M",
      rsi: 75.3,
      marketCap: "790B",
      score: 7.8
    }
  ];

  const handleCustomScan = () => {
    setIsScanning(true);
    // Simulate API call
    setTimeout(() => {
      setScanResults(mockResults);
      setIsScanning(false);
      toast({
        title: "Scan Complete",
        description: `Found ${mockResults.length} matches for your criteria.`,
      });
    }, 2000);
  };

  const handlePresetScan = (scanId: string) => {
    setIsScanning(true);
    const scan = presetScans.find(s => s.id === scanId);
    
    setTimeout(() => {
      setScanResults(mockResults);
      setIsScanning(false);
      toast({
        title: "Scan Complete",
        description: `${scan?.name} scan found ${mockResults.length} results.`,
      });
    }, 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-profit";
    if (score >= 6) return "text-warning";
    return "text-loss";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Market Scanner</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {scanResults.length} Results
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="custom">Custom Scan</TabsTrigger>
          <TabsTrigger value="presets">Preset Scans</TabsTrigger>
        </TabsList>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Custom Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Price Range</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      value={customFilters.priceMin}
                      onChange={(e) => setCustomFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                    />
                    <Input
                      placeholder="Max"
                      value={customFilters.priceMax}
                      onChange={(e) => setCustomFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Market Cap</Label>
                  <Select
                    value={customFilters.marketCap}
                    onValueChange={(value) => setCustomFilters(prev => ({ ...prev, marketCap: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="large">Large Cap (&gt;$10B)</SelectItem>
                      <SelectItem value="mid">Mid Cap ($2B-$10B)</SelectItem>
                      <SelectItem value="small">Small Cap (&lt;$2B)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Sector</Label>
                  <Select
                    value={customFilters.sector}
                    onValueChange={(value) => setCustomFilters(prev => ({ ...prev, sector: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Sector</SelectItem>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Min Volume</Label>
                  <Input
                    placeholder="e.g., 1000000"
                    value={customFilters.volumeMin}
                    onChange={(e) => setCustomFilters(prev => ({ ...prev, volumeMin: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>RSI Range</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min RSI"
                      value={customFilters.rsiMin}
                      onChange={(e) => setCustomFilters(prev => ({ ...prev, rsiMin: e.target.value }))}
                    />
                    <Input
                      placeholder="Max RSI"
                      value={customFilters.rsiMax}
                      onChange={(e) => setCustomFilters(prev => ({ ...prev, rsiMax: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Min % Change</Label>
                  <Input
                    placeholder="e.g., 2.5"
                    value={customFilters.changePercent}
                    onChange={(e) => setCustomFilters(prev => ({ ...prev, changePercent: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={handleCustomScan} disabled={isScanning}>
                  <Search className="h-4 w-4 mr-2" />
                  {isScanning ? "Scanning..." : "Run Scan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presetScans.map((scan) => (
              <Card key={scan.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{scan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{scan.description}</p>
                  <Button
                    onClick={() => handlePresetScan(scan.id)}
                    disabled={isScanning}
                    className="w-full"
                  >
                    {isScanning ? "Scanning..." : "Run Scan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Results */}
      {scanResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Scan Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scanResults.map((stock: any) => (
                <div key={stock.symbol} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-semibold">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${stock.price}</div>
                      <div className={`text-sm flex items-center gap-1 ${
                        stock.change >= 0 ? "text-profit" : "text-loss"
                      }`}>
                        {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(stock.changePercent).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      Vol: {stock.volume}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      RSI: {stock.rsi}
                    </div>
                    <div className={`text-sm font-medium ${getScoreColor(stock.score)}`}>
                      Score: {stock.score}
                    </div>
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketScanner;