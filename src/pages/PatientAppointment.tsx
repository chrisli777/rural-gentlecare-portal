
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "2:00 PM", "3:00 PM", "4:00 PM"
];

const clinics = [
  { id: 1, name: "Adams Rural Care Main Clinic", address: "123 Main St, Adams County" },
  { id: 2, name: "Adams Rural Care East Branch", address: "456 East Ave, Adams County" },
];

const PatientAppointment = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBookAppointment = async () => {
    if (!date || !selectedTime || !appointmentType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        throw new Error('No authenticated user found');
      }

      // Create the appointment
      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: session.user.id,
          appointment_date: date.toISOString().split('T')[0],
          appointment_time: selectedTime,
          appointment_type: appointmentType,
          clinic_id: selectedClinic ? parseInt(selectedClinic) : null,
          notification_methods: ["app"],
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your appointment has been successfully scheduled",
      });

      // Navigate back to dashboard
      navigate('/patient/dashboard');

    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Label>Appointment Type</Label>
                <Select
                  value={appointmentType}
                  onValueChange={setAppointmentType}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="online">Online Consultation</SelectItem>
                    <SelectItem value="in-person">In-Person Visit</SelectItem>
                    <SelectItem value="call-out">Home Visit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {appointmentType === "in-person" && (
                <div>
                  <Label>Select Clinic</Label>
                  <Select
                    value={selectedClinic}
                    onValueChange={setSelectedClinic}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Choose a clinic" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {clinics.map((clinic) => (
                        <SelectItem key={clinic.id} value={clinic.id.toString()}>
                          {clinic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                />
              </div>

              <div>
                <Label>Select Time</Label>
                <Select
                  value={selectedTime}
                  onValueChange={setSelectedTime}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Choose a time" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full"
                onClick={handleBookAppointment}
              >
                Book Appointment
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Appointment Summary</h2>
            <div className="space-y-4">
              {appointmentType && (
                <p>
                  <span className="font-medium">Type: </span>
                  {appointmentType === "online" ? "Online Consultation" : 
                   appointmentType === "in-person" ? "In-Person Visit" : "Home Visit"}
                </p>
              )}
              {selectedClinic && appointmentType === "in-person" && (
                <p>
                  <span className="font-medium">Clinic: </span>
                  {clinics.find(c => c.id.toString() === selectedClinic)?.name}
                </p>
              )}
              {date && (
                <p>
                  <span className="font-medium">Date: </span>
                  {date.toLocaleDateString()}
                </p>
              )}
              {selectedTime && (
                <p>
                  <span className="font-medium">Time: </span>
                  {selectedTime}
                </p>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PatientAppointment;
