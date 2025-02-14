
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
import { translations } from "@/utils/translations";
import { useAccessibility } from "@/contexts/AccessibilityContext";
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

const bodyPartKeys = [
  "head", "neck", "chest", "back", "arms",
  "hands", "abdomen", "legs", "feet", "multipleAreas"
] as const;

const PatientAppointment = () => {
  const [currentStep, setCurrentStep] = useState<'details' | 'schedule'>('details');
  const [appointmentType, setAppointmentType] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [description, setDescription] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language } = useAccessibility();
  const t = translations[language];

  const isDetailsComplete = () => {
    if (!appointmentType || !bodyPart) return false;
    if (appointmentType === 'in-person' && !selectedClinic) return false;
    return true;
  };

  const isScheduleComplete = () => {
    return date && selectedTime;
  };

  const handleDetailsNext = () => {
    if (isDetailsComplete()) {
      setCurrentStep('schedule');
    } else {
      toast({
        title: t.appointments.missingInfo,
        description: t.appointments.missingInfoDesc,
        variant: "destructive",
      });
    }
  };

  const handleScheduleNext = () => {
    if (isScheduleComplete()) {
      setShowConfirmation(true);
    } else {
      toast({
        title: t.appointments.missingInfo,
        description: t.appointments.missingInfoDesc,
        variant: "destructive",
      });
    }
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
        title: t.appointments.success,
        description: t.appointments.successDesc,
      });

      navigate('/patient/dashboard');

    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast({
        title: t.appointments.error,
        description: t.appointments.errorDesc,
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
              {currentStep === 'details' && (
                <div className="space-y-6">
                  <div>
                    <Label>{t.appointments.type.label}</Label>
                    <Select
                      value={appointmentType}
                      onValueChange={setAppointmentType}
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder={t.appointments.type.select} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="online">{t.appointments.type.online}</SelectItem>
                        <SelectItem value="in-person">{t.appointments.type.inPerson}</SelectItem>
                        <SelectItem value="home">{t.appointments.type.homeVisit}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {appointmentType === 'in-person' && (
                    <div>
                      <Label>{t.appointments.clinic.label}</Label>
                      <Select
                        value={selectedClinic}
                        onValueChange={setSelectedClinic}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder={t.appointments.clinic.select} />
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
                    <Label>{t.appointments.bodyPart.label}</Label>
                    <Select
                      value={bodyPart}
                      onValueChange={setBodyPart}
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder={t.appointments.bodyPart.select} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {bodyPartKeys.map((part) => (
                          <SelectItem key={part} value={part}>
                            {t.appointments.bodyParts[part]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{t.appointments.additionalDescription.label}</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t.appointments.additionalDescription.placeholder}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={handleDetailsNext}
                  >
                    {t.appointments.continueToSchedule}
                  </Button>
                </div>
              )}

              {currentStep === 'schedule' && (
                <div className="space-y-6">
                  <div>
                    <Label>{t.appointments.date.label}</Label>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    />
                  </div>

                  <div>
                    <Label>{t.appointments.time.label}</Label>
                    <Select
                      value={selectedTime}
                      onValueChange={setSelectedTime}
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder={t.appointments.time.select} />
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

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setCurrentStep('details')}
                    >
                      {t.common.back}
                    </Button>
                    <Button
                      className="w-full"
                      onClick={handleScheduleNext}
                    >
                      {t.appointments.summary}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.appointments.summary}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p>
                <span className="font-medium">{t.appointments.details.type}: </span>
                {appointmentType}
              </p>
              {selectedClinic && appointmentType === "in-person" && (
                <p>
                  <span className="font-medium">{t.appointments.details.clinic}: </span>
                  {clinics.find(c => c.id.toString() === selectedClinic)?.name}
                </p>
              )}
              <p>
                <span className="font-medium">Body Part: </span>
                {bodyPart}
              </p>
              {date && (
                <p>
                  <span className="font-medium">{t.appointments.details.date}: </span>
                  {date.toLocaleDateString()}
                </p>
              )}
              {selectedTime && (
                <p>
                  <span className="font-medium">{t.appointments.details.time}: </span>
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
                {t.common.back}
              </Button>
              <Button onClick={handleBookAppointment}>
                {t.appointments.book}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default PatientAppointment;
