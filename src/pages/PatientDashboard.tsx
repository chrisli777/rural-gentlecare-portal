import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, Calendar, MessageSquare, FileText, AlertTriangle, Info } from "lucide-react";

const PatientDashboard = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appointments Block */}
          <div className="space-y-3">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
                  <p className="text-muted-foreground">Next: Dr. Smith - March 15, 2024</p>
                </div>
              </div>
            </Card>
            <Alert variant="default" className="bg-secondary/50">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Remember to bring your medication list to your next appointment
              </AlertDescription>
            </Alert>
          </div>

          {/* Messages Block */}
          <div className="space-y-3">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Messages</h3>
                  <p className="text-muted-foreground">2 unread messages</p>
                </div>
              </div>
            </Card>
            <Alert variant="default" className="bg-secondary/50">
              <Info className="h-4 w-4" />
              <AlertDescription>
                New message from Dr. Smith about your recent test results
              </AlertDescription>
            </Alert>
          </div>

          {/* Health Records Block */}
          <div className="space-y-3">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Health Records</h3>
                  <p className="text-muted-foreground">Last updated: 2 days ago</p>
                </div>
              </div>
            </Card>
            <Alert variant="default" className="bg-secondary/50">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription>
                Your blood pressure readings need to be updated
              </AlertDescription>
            </Alert>
          </div>

          {/* Notifications Block */}
          <div className="space-y-3">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Bell className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <p className="text-muted-foreground">3 new notifications</p>
                </div>
              </div>
            </Card>
            <Alert variant="default" className="bg-secondary/50">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Time to schedule your annual wellness check
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;