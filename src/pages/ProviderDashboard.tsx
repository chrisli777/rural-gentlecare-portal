
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Bell } from "lucide-react";

const ProviderDashboard = () => {
  const navigate = useNavigate();

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
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">Provider Dashboard</h1>
              <p className="text-xl text-gray-600">Welcome back, Dr. Adams</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")} className="text-gray-600">
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-blue-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-gray-600">Today</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <Clock className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-gray-600">Voice recordings to review</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Patients</CardTitle>
                <User className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-gray-600">This week</p>
              </CardContent>
            </Card>
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
                    onClick={() => navigate(`/provider/patient/${appointment.id}`)}
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
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                        <p className="text-sm text-gray-600">{appointment.status}</p>
                      </div>
                      {appointment.status === "Voice Recording Ready" && (
                        <Bell className="h-5 w-5 text-blue-600" />
                      )}
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

export default ProviderDashboard;
