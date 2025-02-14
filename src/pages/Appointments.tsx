
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: string;
  clinic_id?: number;
  description?: string;
}

const Appointments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (error) {
        toast({
          title: "Error loading appointments",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Appointment[];
    },
  });

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
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Appointments</h1>
          <Button 
            onClick={() => navigate('/patient/book-appointment')}
            className="bg-primary hover:bg-primary/90"
          >
            Book Appointment
          </Button>
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
                        Type: {appointment.appointment_type}
                      </p>
                      {appointment.description && (
                        <p className="text-gray-600">
                          Description: {appointment.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You don't have any appointments yet</p>
            <Button 
              onClick={() => navigate('/patient/book-appointment')}
              variant="outline"
            >
              Book Your First Appointment
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Appointments;
