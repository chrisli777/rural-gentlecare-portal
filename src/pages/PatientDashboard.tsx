import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, Bot, Send, Loader2, Mic, MicOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const PatientDashboard = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content: "Hello! I'm your healthcare assistant. How can I help you today? You can type or click the microphone button to speak.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const { toast } = useToast();

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data: appointments, error } = await supabase
          .from('appointments')
          .select('*')
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true });

        if (error) {
          console.error('Error details:', error);
          throw error;
        }

        if (appointments) {
          console.log('Fetched appointments:', appointments);
          // Sort appointments by date and time
          const sortedAppointments = appointments.sort((a, b) => {
            const dateTimeA = new Date(`${a.appointment_date} ${a.appointment_time}`);
            const dateTimeB = new Date(`${b.appointment_date} ${b.appointment_time}`);
            return dateTimeA.getTime() - dateTimeB.getTime();
          });
          
          setRecentAppointments(sortedAppointments);
          
          // Add appointment notifications to conversation without replacing existing messages
          const appointmentMessages = sortedAppointments
            .filter(apt => apt.status !== 'cancelled')
            .map(apt => ({
              role: "assistant",
              content: `You have an appointment scheduled for ${format(new Date(apt.appointment_date), 'PPP')} at ${apt.appointment_time}. Type: ${apt.appointment_type}`
            }));
          
          setConversation(prev => {
            const initialGreeting = prev.find(msg => msg.role === "assistant" && msg.content.includes("Hello! I'm your healthcare assistant"));
            const nonAppointmentMessages = prev.filter(msg => 
              msg.role !== "assistant" || 
              (!msg.content.includes("You have an appointment scheduled"))
            );
            return [
              initialGreeting || prev[0],
              ...appointmentMessages,
              ...nonAppointmentMessages.slice(1)
            ];
          });
        }
      } catch (error: any) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error",
          description: "Failed to fetch appointments",
          variant: "destructive",
        });
      }
    };

    fetchAppointments();

    // Set up real-time subscription for appointments
    const appointmentsSubscription = supabase
      .channel('appointments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Appointment change detected:', payload);
          fetchAppointments();
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      appointmentsSubscription.unsubscribe();
    };
  }, [toast]);

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
      });

    } catch (error: any) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();

        reader.onload = async () => {
          if (reader.result && typeof reader.result === 'string') {
            const base64Audio = reader.result.split(',')[1];
            
            try {
              setIsLoading(true);
              const { data, error } = await supabase.functions.invoke('voice-to-text', {
                body: { audio: base64Audio }
              });

              if (error) throw error;

              if (data.text) {
                setMessage(data.text);
                await handleSendMessage(data.text);
              }
            } catch (error: any) {
              console.error('Voice to text error:', error);
              toast({
                title: "Error",
                description: "Failed to convert voice to text. Please try again.",
                variant: "destructive",
              });
            } finally {
              setIsLoading(false);
            }
          }
        };

        reader.readAsDataURL(audioBlob);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);

      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone.",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      toast({
        title: "Recording Stopped",
        description: "Processing your message...",
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Get the current user's ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        console.log('Current user ID:', session.user.id);
      }
    };
    getCurrentUser();
  }, []);

  const handleSendMessage = async (textMessage?: string) => {
    const messageToSend = textMessage || message;
    if (!messageToSend.trim()) return;

    setIsLoading(true);
    const userMessage = { role: "user", content: messageToSend };
    setConversation(prev => [...prev, userMessage]);
    setMessage("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('No authenticated user found');
      }

      const { data, error } = await supabase.functions.invoke('healthcare-chat', {
        body: { 
          message: messageToSend,
          userId: session.user.id
        }
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
        {/* Appointments and Booking Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Appointments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Appointment Booking */}
            <Link to="/patient/appointment" className="group">
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6">
                  <Calendar className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Book an Appointment</h3>
                  <p className="text-gray-600">Schedule your next visit with our healthcare providers.</p>
                </CardContent>
              </Card>
            </Link>

            {/* All Appointments */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {recentAppointments.length > 0 ? (
                    recentAppointments.map((appointment) => (
                      <div 
                        key={appointment.id}
                        className="flex flex-col p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{appointment.appointment_type}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(appointment.appointment_date), 'PPP')} at {appointment.appointment_time}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            appointment.status === 'cancelled' 
                              ? 'bg-destructive/10 text-destructive' 
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        {appointment.status !== 'cancelled' && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="self-end"
                          >
                            Cancel Appointment
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No appointments found</p>
                  )}
                </div>
              </CardContent>
            </Card>
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
              <div className="h-[400px] overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  onClick={toggleRecording}
                  disabled={isLoading}
                  className={isRecording ? 'animate-pulse' : ''}
                >
                  {isRecording ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isRecording ? "Recording..." : "Type your message..."}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading || isRecording}
                />
                <Button onClick={() => handleSendMessage()} disabled={isLoading || isRecording}>
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
