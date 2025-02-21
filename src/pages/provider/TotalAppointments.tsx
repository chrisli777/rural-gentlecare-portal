
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

const TotalAppointments = () => {
  const upcomingAppointments = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      time: "10:00 AM",
      date: "2024-02-20",
      notes: "Follow-up for respiratory symptoms",
      status: "Scheduled"
    },
    {
      id: 2,
      patientName: "Michael Chen",
      time: "11:30 AM",
      date: "2024-02-20",
      notes: "Initial consultation - chronic back pain",
      status: "Pending Review"
    },
    {
      id: 3,
      patientName: "Emily Brown",
      time: "2:15 PM",
      date: "2024-02-20",
      notes: "Medication review - anxiety management",
      status: "Voice Recording Ready"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Total Appointments</h1>
            <p className="text-xl text-gray-600 mt-2">View and manage all appointments</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                        <p className="text-sm text-gray-600">{appointment.notes}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                      <p className="text-sm text-gray-600">{appointment.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TotalAppointments;
