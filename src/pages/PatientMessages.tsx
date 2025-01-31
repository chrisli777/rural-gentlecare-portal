import { Header } from "@/components/layout/Header";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Bell, Calendar, Pill } from "lucide-react";

const PatientMessages = () => {
  const { translate } = useAccessibility();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <h1 className="text-3xl font-bold mb-6">{translate("messages.title")}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Medication Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <Pill className="w-5 h-5 text-primary" />
              <CardTitle>{translate("messages.medicationAlerts")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-medium">Time to take Blood Pressure medication</p>
                  <p className="text-xs text-muted-foreground">Today, 2:00 PM</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-medium">Refill reminder: Diabetes medication</p>
                  <p className="text-xs text-muted-foreground">Tomorrow</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <CardTitle>{translate("messages.appointmentAlerts")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-medium">Upcoming: Dr. Smith - Regular Checkup</p>
                  <p className="text-xs text-muted-foreground">March 15, 10:00 AM</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-medium">Telehealth appointment confirmation needed</p>
                  <p className="text-xs text-muted-foreground">March 20, 2:30 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Doctor's Messages */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <CardTitle>{translate("messages.doctorsMessages")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-medium">Lab results review</p>
                  <p className="text-xs text-muted-foreground">From: Dr. Smith - 2 hours ago</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-medium">Treatment plan update</p>
                  <p className="text-xs text-muted-foreground">From: Dr. Johnson - Yesterday</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* General Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>{translate("messages.generalNotifications")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-medium">Insurance coverage update</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-medium">New health resources available</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PatientMessages;