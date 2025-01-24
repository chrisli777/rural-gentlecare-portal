import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Activity, ClipboardList } from "lucide-react";

const ProviderDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, Dr. Carter</h1>
            <p className="text-gray-600">Here's your practice overview</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patient Alerts</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: "09:00 AM", patient: "John Doe", type: "Check-up" },
                    { time: "10:30 AM", patient: "Jane Smith", type: "Follow-up" },
                    { time: "02:00 PM", patient: "Robert Johnson", type: "Consultation" },
                  ].map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="font-medium">{appointment.time}</div>
                        <div>{appointment.patient}</div>
                      </div>
                      <div className="text-muted-foreground">{appointment.type}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Patient Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { patient: "Alice Wilson", update: "Blood pressure readings updated" },
                    { patient: "Bob Martin", update: "New test results available" },
                    { patient: "Carol Brown", update: "Medication schedule modified" },
                  ].map((update, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                      <div>{update.patient}</div>
                      <div className="text-muted-foreground">{update.update}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;