
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAccessibility } from "@/contexts/AccessibilityContext";
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

const PatientAppointment = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { translate } = useAccessibility();

  const handleShowConfirmation = () => {
    if (!date || !selectedTime || !appointmentType) {
      toast({
        title: translate('appointments.missingInfo'),
        description: translate('appointments.missingInfoDesc'),
        variant: "destructive",
      });
      return;
    }
    setShowConfirmation(true);
  };

  const handleBookAppointment = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        throw new Error('No authenticated user found');
      }

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
        title: translate('appointments.success'),
        description: translate('appointments.successDesc'),
      });

      navigate('/patient/dashboard');

    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast({
        title: translate('appointments.error'),
        description: translate('appointments.errorDesc'),
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
                <Label>{translate('appointments.type.label')}</Label>
                <Select
                  value={appointmentType}
                  onValueChange={setAppointmentType}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder={translate('appointments.type.select')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="online">{translate('appointments.type.online')}</SelectItem>
                    <SelectItem value="in-person">{translate('appointments.type.inPerson')}</SelectItem>
                    <SelectItem value="call-out">{translate('appointments.type.homeVisit')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {appointmentType === "in-person" && (
                <div>
                  <Label>{translate('appointments.clinic.label')}</Label>
                  <Select
                    value={selectedClinic}
                    onValueChange={setSelectedClinic}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder={translate('appointments.clinic.select')} />
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
                <Label>{translate('appointments.date.label')}</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                />
              </div>

              <div>
                <Label>{translate('appointments.time.label')}</Label>
                <Select
                  value={selectedTime}
                  onValueChange={setSelectedTime}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder={translate('appointments.time.select')} />
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
                {translate('appointments.book')}
              </Button>
            </div>
          </Card>
        </div>

        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{translate('appointments.summary')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {appointmentType && (
                <p>
                  <span className="font-medium">{translate('appointments.details.type')}: </span>
                  {appointmentType === "online" ? translate('appointments.type.online') : 
                   appointmentType === "in-person" ? translate('appointments.type.inPerson') : 
                   translate('appointments.type.homeVisit')}
                </p>
              )}
              {selectedClinic && appointmentType === "in-person" && (
                <p>
                  <span className="font-medium">{translate('appointments.details.clinic')}: </span>
                  {clinics.find(c => c.id.toString() === selectedClinic)?.name}
                </p>
              )}
              {date && (
                <p>
                  <span className="font-medium">{translate('appointments.details.date')}: </span>
                  {date.toLocaleDateString()}
                </p>
              )}
              {selectedTime && (
                <p>
                  <span className="font-medium">{translate('appointments.details.time')}: </span>
                  {selectedTime}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                {translate('common.cancel')}
              </Button>
              <Button onClick={handleBookAppointment}>
                {translate('appointments.book')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default PatientAppointment;
