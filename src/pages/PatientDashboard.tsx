
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, MessageSquare, User, Bot, Send, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const PatientDashboard = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content: "Hello! I'm your healthcare assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    const userMessage = { role: "user", content: message };
    setConversation(prev => [...prev, userMessage]);
    setMessage("");

    try {
      const { data, error } = await supabase.functions.invoke('healthcare-chat', {
        body: { message: message }
      });

      if (error) throw error;

      const aiMessage = {
        role: "assistant",
        content: data.response
      };

      setConversation(prev => [...prev, aiMessage]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant. Please try again.",
        variant: "destructive",
      });
      console.error("AI Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20">
        {/* Quick Actions Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Appointment Booking */}
            <Link to="/patient/appointment" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Calendar className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Appointment Booking</h3>
                  <p className="text-gray-600">Schedule your next visit with our healthcare providers.</p>
                </CardContent>
              </Card>
            </Link>

            {/* Messages & Notifications */}
            <Link to="/patient/messages" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <MessageSquare className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Messages</h3>
                  <p className="text-gray-600">View your messages and important notifications.</p>
                </CardContent>
              </Card>
            </Link>

            {/* My Profile */}
            <Link to="/patient/profile" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <User className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">My Profile</h3>
                  <p className="text-gray-600">Manage your personal information and preferences.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Chatbot Section */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Healthcare Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                  placeholder="Type your message..."
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
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;
