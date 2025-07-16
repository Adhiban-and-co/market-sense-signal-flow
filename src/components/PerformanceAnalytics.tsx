import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Calendar, Download, BarChart3 } from "lucide-react";

const PerformanceAnalytics = () => {
  const [timeframe, setTimeframe] = useState("1M");
  const [activeTab, setActiveTab] = useState("overview");

  const performanceData = [
    { date: "Jan", portfolio: 2.1, benchmark: 1.8, signals: 15 },
    { date: "Feb", portfolio: 1.5, benchmark: 2.2, signals: 18 },
    { date: "Mar", portfolio: 3.2, benchmark: 1.9, signals: 22 },
    { date: "Apr", portfolio: 2.8, benchmark: 2.1, signals: 19 },
    { date: "May", portfolio: 4.1, benchmark: 2.5, signals: 25 },
    { date: "Jun", portfolio: 3.5, benchmark: 2.3, signals: 21 }
  ];

  const allocationData = [
    { name: "Technology", value: 35, color: "#8884d8" },
    { name: "Healthcare", value: 20, color: "#82ca9d" },
    { name: "Financial", value: 15, color: "#ffc658" },
    { name: "Energy", value: 12, color: "#ff7c7c" },
    { name: "Consumer", value: 10, color: "#8dd1e1" },
    { name: "Other", value: 8, color: "#d084d0" }
  ];

  const signalAccuracy = [
    { type: "BUY", total: 45, successful: 38, accuracy: 84.4 },
    { type: "SELL", total: 32, successful: 25, accuracy: 78.1 },
    { type: "HOLD", total: 28, successful: 22, accuracy: 78.6 }
  ];

  const riskMetrics = {
    sharpeRatio: 1.85,
    maxDrawdown: 8.2,
    var95: 12.5,
    beta: 0.92,
    volatility: 16.8,
    calmarRatio: 1.45
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Analytics</h2>
        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1W">1 Week</SelectItem>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="signals">Signal Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Return</p>
                    <p className="text-2xl font-bold text-profit">+12.4%</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-profit" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                    <p className="text-2xl font-bold">{riskMetrics.sharpeRatio}</p>
                  </div>
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Max Drawdown</p>
                    <p className="text-2xl font-bold text-loss">-{riskMetrics.maxDrawdown}%</p>
                  </div>
                  <TrendingDown className="h-6 w-6 text-loss" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-2xl font-bold text-profit">76.8%</p>
                  </div>
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio vs Benchmark Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="portfolio" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Portfolio"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="benchmark" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="S&P 500"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Current Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="portfolio" fill="hsl(var(--primary))" name="Portfolio Returns %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(riskMetrics).map(([key, value]) => (
              <Card key={key}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-2xl font-bold">{value}{key.includes('Ratio') ? '' : '%'}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Signal Accuracy by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {signalAccuracy.map((signal) => (
                  <div key={signal.type} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant={signal.type === "BUY" ? "default" : signal.type === "SELL" ? "destructive" : "secondary"}>
                        {signal.type}
                      </Badge>
                      <div>
                        <div className="font-semibold">{signal.accuracy}% Accuracy</div>
                        <div className="text-sm text-muted-foreground">
                          {signal.successful}/{signal.total} successful signals
                        </div>
                      </div>
                    </div>
                    <div className="w-32">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${signal.accuracy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Signal Generation Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="signals" fill="hsl(var(--primary))" name="Signals Generated" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalytics;