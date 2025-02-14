
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Bot, Send, Loader2, Mic, MicOff, Headphones, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const { translate } = useAccessibility();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log('Fetching appointments');
        const { data: appointments, error } = await supabase
          .from('appointments')
          .select('*')
          .neq('status', 'cancelled')
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true });

        if (error) {
          console.error('Error details:', error);
          throw error;
        }

        if (appointments) {
          console.log('Fetched appointments:', appointments);
          const sortedAppointments = appointments.sort((a, b) => {
            const dateTimeA = new Date(`${a.appointment_date} ${a.appointment_time}`);
            const dateTimeB = new Date(`${b.appointment_date} ${b.appointment_time}`);
            return dateTimeA.getTime() - dateTimeB.getTime();
          });
          
          setRecentAppointments(sortedAppointments);
          
          const appointmentMessages = sortedAppointments
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

      setRecentAppointments(prevAppointments => {
        const cancelledAppointment = prevAppointments.find(apt => apt.id === appointmentId);
        const updatedAppointments = prevAppointments.filter(apt => apt.id !== appointmentId);
        
        if (cancelledAppointment) {
          const cancellationMessage = {
            role: "assistant",
            content: `I've noted that you've cancelled your appointment scheduled for ${format(new Date(cancelledAppointment.appointment_date), 'PPP')} at ${cancelledAppointment.appointment_time}. Is there anything else you need help with?`
          };
          setConversation(prev => [...prev, cancellationMessage]);
        }
        
        return updatedAppointments;
      });

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

  const handleSendMessage = async (textMessage?: string) => {
    const messageToSend = textMessage || message;
    if (!messageToSend.trim()) return;

    setIsLoading(true);
    const userMessage = { role: "user", content: messageToSend };
    setConversation(prev => [...prev, userMessage]);
    setMessage("");

    try {
      const { data, error } = await supabase.functions.invoke('healthcare-chat', {
        body: { message: messageToSend }
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
      <main className="container mx-auto px-4 pt-20 pb-6 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          <div className="md:col-span-1 space-y-6 overflow-y-auto">
            <Link to="/patient/onboarding" className="block group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Headphones className="w-12 h-12 text-[#1E5AAB] flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-[#1E5AAB]">
                        {translate('accessibility.voiceAssistant')}
                      </h3>
                      <p className="text-gray-600 hidden sm:block">
                        {translate('common.features.voiceAssistant.description')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/patient/appointment" className="block group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-12 h-12 text-[#1E5AAB] flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-[#1E5AAB]">
                        {translate('appointments.title')}
                      </h3>
                      <p className="text-gray-600 hidden sm:block">
                        {translate('common.features.appointments.description')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <ClipboardList className="w-12 h-12 text-[#1E5AAB] flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1E5AAB]">{translate('dashboard.upcomingAppointments')}</h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {recentAppointments.length > 0 ? (
                        recentAppointments.map((appointment) => (
                          <div 
                            key={appointment.id}
                            className="flex flex-col p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium text-[#1E5AAB]">{appointment.appointment_type}</p>
                                <p className="text-sm text-muted-foreground hidden sm:block">
                                  {format(new Date(appointment.appointment_date), 'PPP')} at {appointment.appointment_time}
                                </p>
                                <p className="text-sm text-muted-foreground sm:hidden">
                                  {format(new Date(appointment.appointment_date), 'PP')}
                                </p>
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                  >
                                    {translate('common.cancel')}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-[#1E5AAB]">
                                      {translate('dialog.confirmCancelTitle')}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {translate('dialog.confirmCancelDescription')}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{translate('dialog.keepAppointment')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleCancelAppointment(appointment.id)}>
                                      {translate('dialog.confirmCancel')}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-4">{translate('dashboard.noAppointments')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 flex flex-col h-full">
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1E5AAB]">
                  <Bot className="h-5 w-5" />
                  {translate('aiAssistant.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <AnimatePresence>
                    {conversation.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.5,
                          delay: msg.role === 'assistant' ? (index === 0 ? 0.2 : 0.5) : 0 
                        }}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <motion.div
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.role === "user"
                              ? "bg-[#1E5AAB] text-white"
                              : "bg-muted"
                          }`}
                        >
                          {msg.content}
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="icon"
                    onClick={toggleRecording}
                    disabled={isLoading}
                    className={`${isRecording ? 'animate-pulse' : ''} text-[#1E5AAB]`}
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
                    placeholder={isRecording ? translate('accessibility.listening') : translate('aiAssistant.inputPlaceholder')}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isLoading || isRecording}
                  />
                  <Button 
                    onClick={() => handleSendMessage()} 
                    disabled={isLoading || isRecording}
                    className="bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
