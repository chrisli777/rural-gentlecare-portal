
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

const bodyParts = [
  "Head", "Neck", "Chest", "Back", "Arms",
  "Hands", "Abdomen", "Legs", "Feet", "Multiple Areas"
];

const appointmentTypes = [
  { value: "online", label: "Online Consultation" },
  { value: "in-person", label: "In-Person Visit" },
  { value: "home", label: "Home Visit" }
];

const PatientAppointment = () => {
  const [currentStep, setCurrentStep] = useState<'type' | 'clinic' | 'bodyPart' | 'date' | 'time' | 'description'>('type');
  const [appointmentType, setAppointmentType] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [description, setDescription] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAppointmentTypeChange = (value: string) => {
    setAppointmentType(value);
    if (value === 'in-person') {
      setCurrentStep('clinic');
    } else {
      setCurrentStep('bodyPart');
    }
  };

  const handleClinicChange = (value: string) => {
    setSelectedClinic(value);
    setCurrentStep('bodyPart');
  };

  const handleBodyPartChange = (value: string) => {
    setBodyPart(value);
    setCurrentStep('date');
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setCurrentStep('time');
    }
  };

  const handleTimeSelect = (value: string) => {
    setSelectedTime(value);
    setCurrentStep('description');
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (isReadyForConfirmation()) {
      setShowConfirmation(true);
    }
  };

  const isReadyForConfirmation = () => {
    if (!appointmentType || !bodyPart || !date || !selectedTime) return false;
    if (appointmentType === 'in-person' && !selectedClinic) return false;
    return true;
  };

  const handleBookAppointment = async () => {
    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          appointment_type: appointmentType,
          appointment_date: date?.toISOString().split('T')[0],
          appointment_time: selectedTime,
          clinic_id: selectedClinic ? parseInt(selectedClinic) : null,
          body_part: bodyPart,
          description: description,
          notification_methods: ["app"],
          status: 'pending'
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
              {currentStep === 'type' && (
                <div>
                  <Label>What type of appointment would you prefer?</Label>
                  <Select
                    value={appointmentType}
                    onValueChange={handleAppointmentTypeChange}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {currentStep === 'clinic' && appointmentType === 'in-person' && (
                <div>
                  <Label>Select Clinic</Label>
                  <Select
                    value={selectedClinic}
                    onValueChange={handleClinicChange}
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

              {currentStep === 'bodyPart' && (
                <div>
                  <Label>Which part of your body is affected?</Label>
                  <Select
                    value={bodyPart}
                    onValueChange={handleBodyPartChange}
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
              )}

              {currentStep === 'date' && (
                <div>
                  <Label>Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                  />
                </div>
              )}

              {currentStep === 'time' && (
                <div>
                  <Label>Select Time</Label>
                  <Select
                    value={selectedTime}
                    onValueChange={handleTimeSelect}
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
              )}

              {currentStep === 'description' && (
                <div>
                  <Label>Additional Description (Optional)</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    placeholder="Please describe your symptoms or reason for visit"
                    className="mt-1"
                  />
                  <Button
                    className="w-full mt-4"
                    onClick={() => setShowConfirmation(true)}
                  >
                    Review Appointment
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Your Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p>
                <span className="font-medium">Type: </span>
                {appointmentTypes.find(t => t.value === appointmentType)?.label}
              </p>
              {selectedClinic && appointmentType === "in-person" && (
                <p>
                  <span className="font-medium">Clinic: </span>
                  {clinics.find(c => c.id.toString() === selectedClinic)?.name}
                </p>
              )}
              <p>
                <span className="font-medium">Body Part: </span>
                {bodyPart}
              </p>
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
              {description && (
                <p>
                  <span className="font-medium">Description: </span>
                  {description}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Change Details
              </Button>
              <Button onClick={handleBookAppointment}>
                Confirm Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default PatientAppointment;
