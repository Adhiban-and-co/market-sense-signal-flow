import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Zap, Brain, TrendingUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignalGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [manualSignal, setManualSignal] = useState({
    symbol: "",
    signal: "",
    confidence: "",
    risk: "",
    reasoning: "",
    targetPrice: "",
    stopLoss: ""
  });
  const { toast } = useToast();

  const generateAISignal = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI signal generation
      const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META"];
      const signals = ["BUY", "SELL", "HOLD"];
      const risks = ["LOW", "MEDIUM", "HIGH"];
      
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const randomSignal = signals[Math.floor(Math.random() * signals.length)];
      const randomRisk = risks[Math.floor(Math.random() * risks.length)];
      const confidence = Math.floor(Math.random() * 40) + 60; // 60-100%
      
      const reasoningTemplates = {
        BUY: [
          "Strong technical indicators with bullish momentum",
          "Earnings beat expectations with positive guidance",
          "Breaking above key resistance levels",
          "High institutional buying volume detected"
        ],
        SELL: [
          "Bearish divergence in technical indicators",
          "Overvalued based on fundamental analysis",
          "Breaking below critical support levels",
          "High insider selling activity"
        ],
        HOLD: [
          "Mixed signals in current market conditions",
          "Awaiting earnings report for direction",
          "Consolidating within trading range",
          "Neutral technical and fundamental outlook"
        ]
      };
      
      const reasoning = reasoningTemplates[randomSignal as keyof typeof reasoningTemplates][
        Math.floor(Math.random() * reasoningTemplates[randomSignal as keyof typeof reasoningTemplates].length)
      ];

      const newSignal = {
        symbol: randomSymbol,
        signal: randomSignal,
        confidence,
        risk: randomRisk,
        reasoning,
        timestamp: new Date().toISOString(),
        target_price: randomSignal === "BUY" ? Math.random() * 50 + 150 : null,
        stop_loss: randomSignal === "BUY" ? Math.random() * 20 + 130 : null
      };

      const { data, error } = await supabase
        .from("ai_signals")
        .insert([newSignal])
        .select();

      if (error) throw error;

      toast({
        title: "AI Signal Generated",
        description: `New ${randomSignal} signal created for ${randomSymbol}`,
      });
    } catch (error) {
      console.error("Error generating signal:", error);
      toast({
        title: "Error",
        description: "Failed to generate AI signal",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addManualSignal = async () => {
    if (!manualSignal.symbol || !manualSignal.signal || !manualSignal.confidence || !manualSignal.risk) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const newSignal = {
        symbol: manualSignal.symbol.toUpperCase(),
        signal: manualSignal.signal,
        confidence: parseInt(manualSignal.confidence),
        risk: manualSignal.risk,
        reasoning: manualSignal.reasoning || "Manual signal entry",
        timestamp: new Date().toISOString(),
        target_price: manualSignal.targetPrice ? parseFloat(manualSignal.targetPrice) : null,
        stop_loss: manualSignal.stopLoss ? parseFloat(manualSignal.stopLoss) : null
      };

      const { data, error } = await supabase
        .from("ai_signals")
        .insert([newSignal])
        .select();

      if (error) throw error;

      setManualSignal({
        symbol: "",
        signal: "",
        confidence: "",
        risk: "",
        reasoning: "",
        targetPrice: "",
        stopLoss: ""
      });

      toast({
        title: "Manual Signal Added",
        description: `${manualSignal.signal} signal created for ${manualSignal.symbol}`,
      });
    } catch (error) {
      console.error("Error adding manual signal:", error);
      toast({
        title: "Error",
        description: "Failed to add manual signal",
        variant: "destructive",
      });
    }
  };

  const triggerWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          action: "generate_signal",
          timestamp: new Date().toISOString(),
          source: "trading_dashboard"
        }),
      });

      toast({
        title: "Webhook Triggered",
        description: "External signal generation webhook has been called",
      });
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast({
        title: "Error",
        description: "Failed to trigger webhook",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Signal Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Signal Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={generateAISignal} 
              disabled={isGenerating}
              className="flex-1"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate AI Signal"}
            </Button>
            <Badge variant="secondary">Mock AI</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Generates realistic trading signals using mock AI analysis. In production, connect your ML models here.
          </p>
        </CardContent>
      </Card>

      {/* Webhook Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            External Signal Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="webhook">Zapier/Python Script Webhook URL</Label>
            <Input
              id="webhook"
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
          </div>
          <Button onClick={triggerWebhook} variant="outline" className="w-full">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Trigger External Signal Generation
          </Button>
          <p className="text-sm text-muted-foreground">
            Connect your Python scripts, Zapier workflows, or other external systems to automatically generate signals.
          </p>
        </CardContent>
      </Card>

      {/* Manual Signal Entry */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Signal Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="symbol">Symbol *</Label>
              <Input
                id="symbol"
                placeholder="AAPL"
                value={manualSignal.symbol}
                onChange={(e) => setManualSignal({...manualSignal, symbol: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="signal">Signal *</Label>
              <Select value={manualSignal.signal} onValueChange={(value) => setManualSignal({...manualSignal, signal: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select signal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">BUY</SelectItem>
                  <SelectItem value="SELL">SELL</SelectItem>
                  <SelectItem value="HOLD">HOLD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="confidence">Confidence (%) *</Label>
              <Input
                id="confidence"
                type="number"
                min="0"
                max="100"
                placeholder="85"
                value={manualSignal.confidence}
                onChange={(e) => setManualSignal({...manualSignal, confidence: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="risk">Risk Level *</Label>
              <Select value={manualSignal.risk} onValueChange={(value) => setManualSignal({...manualSignal, risk: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">LOW</SelectItem>
                  <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                  <SelectItem value="HIGH">HIGH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetPrice">Target Price</Label>
              <Input
                id="targetPrice"
                type="number"
                placeholder="175.50"
                value={manualSignal.targetPrice}
                onChange={(e) => setManualSignal({...manualSignal, targetPrice: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="stopLoss">Stop Loss</Label>
              <Input
                id="stopLoss"
                type="number"
                placeholder="145.00"
                value={manualSignal.stopLoss}
                onChange={(e) => setManualSignal({...manualSignal, stopLoss: e.target.value})}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="reasoning">Reasoning</Label>
            <Textarea
              id="reasoning"
              placeholder="Describe the reasoning behind this signal..."
              value={manualSignal.reasoning}
              onChange={(e) => setManualSignal({...manualSignal, reasoning: e.target.value})}
            />
          </div>
          <Button onClick={addManualSignal} className="w-full">
            Add Manual Signal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignalGenerator;