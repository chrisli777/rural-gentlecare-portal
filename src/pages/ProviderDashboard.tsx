import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, AlertTriangle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mockAppointments = [
  { patientName: "John Doe", time: "09:00 AM", type: "Follow-up" },
  { patientName: "Jane Smith", time: "10:30 AM", type: "Check-up" },
];

const mockRiskAlerts = [
  { patient: "Alice Johnson", risk: "Missed last 2 appointments" },
  { patient: "Bob Wilson", risk: "Blood pressure trending high" },
];

const mockMessages = [
  { from: "Mary Brown", preview: "Thank you for the follow-up..." },
  { from: "James Davis", preview: "Questions about medication..." },
];

const ProviderDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8">Provider Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    </div>
                    <p className="text-sm font-medium">{appointment.time}</p>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/provider/appointments")}
                >
                  View All Appointments
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patient Risk Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRiskAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div>
                      <p className="font-medium">{alert.patient}</p>
                      <p className="text-sm text-destructive">{alert.risk}</p>
                    </div>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/provider/patients")}
                >
                  View All Patients
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMessages.map((message, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div>
                      <p className="font-medium">{message.from}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                        {message.preview}
                      </p>
                    </div>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/provider/messages")}
                >
                  View All Messages
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => navigate("/provider/patients")}
              >
                <Users className="h-6 w-6" />
                <span>View Patients</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => navigate("/provider/analytics")}
              >
                <Calendar className="h-6 w-6" />
                <span>Analytics</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;