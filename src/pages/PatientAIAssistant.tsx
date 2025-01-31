import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Bot, LineChart, FileText, Send, Loader2 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

const mockHealthData = [
  { date: "Jan", bloodPressure: 120, bloodSugar: 100, weight: 70 },
  { date: "Feb", bloodPressure: 118, bloodSugar: 98, weight: 69 },
  { date: "Mar", bloodPressure: 122, bloodSugar: 102, weight: 69.5 },
  { date: "Apr", bloodPressure: 119, bloodSugar: 99, weight: 68.5 },
  { date: "May", bloodPressure: 121, bloodSugar: 101, weight: 68 },
];

const PatientAIAssistant = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { translate } = useAccessibility();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    const newMessage = { role: "user", content: message };
    setConversation([...conversation, newMessage]);

    // Simulate AI response - In a real implementation, this would call your AI service
    setTimeout(() => {
      const aiResponse = {
        role: "assistant",
        content: "I understand your concern. Based on your health data, I recommend maintaining your current medication schedule and continuing with regular exercise. Would you like me to analyze your recent health metrics in detail?",
      };
      setConversation([...conversation, newMessage, aiResponse]);
      setIsLoading(false);
      setMessage("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20">
        <h1 className="text-3xl font-bold mb-6">{translate("aiAssistant.title")}</h1>

        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="h-[400px] overflow-y-auto space-y-4 mb-4">
                  {conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your health-related question..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>Health Metrics Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ChartContainer
                    className="h-full"
                    config={{
                      bloodPressure: {
                        label: "Blood Pressure",
                        theme: {
                          light: "#2563eb",
                          dark: "#3b82f6",
                        },
                      },
                      bloodSugar: {
                        label: "Blood Sugar",
                        theme: {
                          light: "#16a34a",
                          dark: "#22c55e",
                        },
                      },
                      weight: {
                        label: "Weight",
                        theme: {
                          light: "#dc2626",
                          dark: "#ef4444",
                        },
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockHealthData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="bloodPressure"
                          stroke="var(--color-bloodPressure)"
                          fill="var(--color-bloodPressure)"
                          fillOpacity={0.2}
                        />
                        <Area
                          type="monotone"
                          dataKey="bloodSugar"
                          stroke="var(--color-bloodSugar)"
                          fill="var(--color-bloodSugar)"
                          fillOpacity={0.2}
                        />
                        <Area
                          type="monotone"
                          dataKey="weight"
                          stroke="var(--color-weight)"
                          fill="var(--color-weight)"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Health Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Monthly Health Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Based on your recent health data:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li>Blood pressure has remained stable within normal range</li>
                      <li>Blood sugar levels show slight improvement</li>
                      <li>Weight has decreased by 2kg, meeting your health goals</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Continue with current medication schedule</li>
                      <li>Maintain regular exercise routine</li>
                      <li>Consider increasing water intake</li>
                      <li>Schedule next check-up within 30 days</li>
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PatientAIAssistant;