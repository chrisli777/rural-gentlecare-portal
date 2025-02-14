
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "2:00 PM", "3:00 PM", "4:00 PM"
];

const clinics = [
  { id: 1, name: "Adams Rural Care Main Clinic", address: "123 Main St, Adams County" },
  { id: 2, name: "Adams Rural Care East Branch", address: "456 East Ave, Adams County" },
];

const bodyParts = [
  "Head", "Neck", "Chest", "Back", "Arms",
  "Hands", "Abdomen", "Legs", "Feet", "Multiple Areas"
];

const PatientAppointment = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [description, setDescription] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleShowConfirmation = () => {
    if (!date || !selectedTime || !appointmentType || !bodyPart) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmation(true);
  };

  const handleBookAppointment = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to book an appointment",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('appointments')
        .insert({
          appointment_date: date.toISOString().split('T')[0],
          appointment_time: selectedTime,
          appointment_type: appointmentType,
          clinic_id: selectedClinic ? parseInt(selectedClinic) : null,
          body_part: bodyPart,
          description: description,
          notification_methods: ["app"],
          status: 'pending',
          patient_id: user.id // Add the patient_id from the authenticated user
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your appointment has been successfully scheduled",
      });

      navigate('/patient/dashboard');

    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    }
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-md mx-auto">
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
                <Label>Affected Body Part</Label>
                <Select
                  value={bodyPart}
                  onValueChange={setBodyPart}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select body part" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {bodyParts.map((part) => (
                      <SelectItem key={part} value={part}>
                        {part}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe your symptoms or reason for visit"
                  className="mt-1"
                />
              </div>

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
                onClick={handleShowConfirmation}
              >
                Book Appointment
              </Button>
            </div>
          </Card>
        </div>

        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Appointment Summary</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {appointmentType && (
                <p>
                  <span className="font-medium">Type: </span>
                  {appointmentType === "online" ? "Online Consultation" : 
                   appointmentType === "in-person" ? "In-Person Visit" : 
                   "Home Visit"}
                </p>
              )}
              {selectedClinic && appointmentType === "in-person" && (
                <p>
                  <span className="font-medium">Clinic: </span>
                  {clinics.find(c => c.id.toString() === selectedClinic)?.name}
                </p>
              )}
              {bodyPart && (
                <p>
                  <span className="font-medium">Body Part: </span>
                  {bodyPart}
                </p>
              )}
              {description && (
                <p>
                  <span className="font-medium">Description: </span>
                  {description}
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
              <Button onClick={handleBookAppointment}>
                Book Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default PatientAppointment;
