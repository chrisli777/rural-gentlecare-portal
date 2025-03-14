import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { translations } from "@/utils/translations";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: string;
  clinic_id?: number;
  description?: string;
  body_part?: string;
}

const Appointments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const { language } = useAccessibility();
  const t = translations[language];

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (error) {
        toast({
          title: t.appointments.error,
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Appointment[];
    },
  });

  const handleCancelDialog = async () => {
    if (!appointmentToDelete) return;

    try {
      // Optimistically update the UI
      queryClient.setQueryData(['appointments'], (oldData: Appointment[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(appointment => appointment.id !== appointmentToDelete);
      });

      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentToDelete);

      if (error) throw error;

      toast({
        title: t.appointments.success,
        description: t.appointments.successDesc,
        duration: 2000,
      });
    } catch (error: any) {
      // Revert the optimistic update on error
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      
      toast({
        title: t.appointments.error,
        description: t.appointments.errorDesc,
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setAppointmentToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
              {t.common.back}
            </Button>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{t.common.appointments}</h1>
          {appointments && appointments.length > 0 && (
            <Button 
              onClick={() => navigate('/patient/book-appointment')}
              className="bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white"
            >
              {t.appointments.book}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading appointments...</div>
        ) : appointments && appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {format(new Date(appointment.appointment_date), 'PPP')}
                      </span>
                      <span className="text-gray-600">at {appointment.appointment_time}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-600">
                        {t.appointments.details.type}: {appointment.appointment_type}
                      </p>
                      {appointment.body_part && (
                        <p className="text-gray-600">
                          Body Part: {appointment.body_part}
                        </p>
                      )}
                      {appointment.description && (
                        <p className="text-gray-600">
                          {t.appointments.description}: {appointment.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setAppointmentToDelete(appointment.id)}
                      className="h-8 w-8"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">{t.dashboard.noAppointments}</p>
            <Button 
              onClick={() => navigate('/patient/book-appointment')}
              className="bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white"
            >
              {t.appointments.book}
            </Button>
          </div>
        )}

        <AlertDialog open={!!appointmentToDelete} onOpenChange={() => setAppointmentToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.dialog.confirmCancelTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {t.dialog.confirmCancelDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => setAppointmentToDelete(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                {t.dialog.keepAppointment}
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleCancelDialog}
                className="bg-destructive hover:bg-destructive/90 text-white"
              >
                {t.dialog.confirmCancel}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Appointments;
