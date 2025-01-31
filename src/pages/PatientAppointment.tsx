import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const doctors = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Geriatric Medicine" },
  { id: 2, name: "Dr. Michael Chen", specialty: "Internal Medicine" },
  { id: 3, name: "Dr. Emily Brown", specialty: "Family Medicine" },
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "02:00 PM", "03:00 PM", "04:00 PM"
];

const PatientAppointment = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const { toast } = useToast();
  const { translate } = useAccessibility();

  const handleBookAppointment = () => {
    if (!date || !selectedDoctor || !selectedTime) {
      toast({
        title: translate("appointment.error"),
        description: translate("appointment.selectAll"),
        variant: "destructive",
        className: "left-0 right-auto",
      });
      return;
    }

    toast({
      title: translate("appointment.success"),
      description: translate("appointment.booked"),
      className: "left-0 right-auto",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">{translate("appointment.title")}</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Label>{translate("appointment.selectDoctor")}</Label>
                <Select
                  value={selectedDoctor}
                  onValueChange={setSelectedDoctor}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={translate("appointment.chooseDoctorPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{translate("appointment.selectDate")}</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                />
              </div>

              <div>
                <Label>{translate("appointment.selectTime")}</Label>
                <Select
                  value={selectedTime}
                  onValueChange={setSelectedTime}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={translate("appointment.chooseTimePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
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
                {translate("appointment.bookButton")}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{translate("appointment.summary")}</h2>
            <div className="space-y-4">
              {selectedDoctor && (
                <p>
                  <span className="font-medium">{translate("appointment.doctor")}: </span>
                  {doctors.find(d => d.id.toString() === selectedDoctor)?.name}
                </p>
              )}
              {date && (
                <p>
                  <span className="font-medium">{translate("appointment.date")}: </span>
                  {date.toLocaleDateString()}
                </p>
              )}
              {selectedTime && (
                <p>
                  <span className="font-medium">{translate("appointment.time")}: </span>
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