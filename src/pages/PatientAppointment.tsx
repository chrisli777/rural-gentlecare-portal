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
  "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
];

const clinics = [
  { value: "clinic-a", label: "Clinic A" },
  { value: "clinic-b", label: "Clinic B" },
  { value: "clinic-c", label: "Clinic C" },
];

const PatientAppointment = () => {
  const [selectedType, setSelectedType] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { translate } = useAccessibility();

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  const handleClinicChange = (value: string) => {
    setSelectedClinic(value);
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleSubmit = async () => {
    if (!selectedType || !selectedClinic || !selectedDate || !selectedTime) {
      toast({
        title: translate('appointments.missingInfo'),
        description: translate('appointments.missingInfoDesc'),
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('No authenticated user found');
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            patient_id: session.user.id,
            appointment_type: selectedType,
            clinic: selectedClinic,
            appointment_date: selectedDate.toISOString().split('T')[0],
            appointment_time: selectedTime,
            status: 'scheduled',
          },
        ]);

      if (error) {
        console.error('Error booking appointment:', error);
        throw error;
      }

      setOpen(true);
    } catch (error) {
      toast({
        title: translate('appointments.error'),
        description: translate('appointments.errorDesc'),
        variant: "destructive",
      });
    }
  };

  const handleConfirm = () => {
    setOpen(false);
    navigate('/patient/dashboard');
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
                <Select onValueChange={handleTypeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={translate('appointments.type.select')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">{translate('appointments.type.online')}</SelectItem>
                    <SelectItem value="in-person">{translate('appointments.type.inPerson')}</SelectItem>
                    <SelectItem value="home-visit">{translate('appointments.type.homeVisit')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{translate('appointments.clinic.label')}</Label>
                <Select onValueChange={handleClinicChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={translate('appointments.clinic.select')} />
                  </SelectTrigger>
                  <SelectContent>
                    {clinics.map((clinic) => (
                      <SelectItem key={clinic.value} value={clinic.value}>{clinic.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{translate('appointments.date.label')}</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  className="rounded-md border w-full"
                />
              </div>
              <div>
                <Label>{translate('appointments.time.label')}</Label>
                <Select onValueChange={handleTimeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={translate('appointments.time.select')} />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white" onClick={handleSubmit}>
                {translate('appointments.book')}
              </Button>
            </div>
          </Card>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{translate('appointments.success')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">{translate('appointments.details.type')}</Label>
                <div className="col-span-3 font-medium">{selectedType}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clinic" className="text-right">{translate('appointments.details.clinic')}</Label>
                <div className="col-span-3 font-medium">{selectedClinic}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">{translate('appointments.details.date')}</Label>
                <div className="col-span-3 font-medium">{selectedDate?.toLocaleDateString()}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">{translate('appointments.details.time')}</Label>
                <div className="col-span-3 font-medium">{selectedTime}</div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white" onClick={handleConfirm}>
                {translate('common.continueToDashboard')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default PatientAppointment;
