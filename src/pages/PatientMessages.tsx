import { Header } from "@/components/layout/Header";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Bell, Calendar, Pill, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PatientMessages = () => {
  const { translate } = useAccessibility();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{translate("messages.title")}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Medication Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <Pill className="w-5 h-5 text-primary" />
              <CardTitle>{translate("messages.medicationAlerts")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {translate("messages.noMessages")}
                </p>
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
                <p className="text-sm text-muted-foreground">
                  {translate("messages.noMessages")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Doctor's Messages */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>{translate("messages.doctorsMessages")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {translate("messages.noMessages")}
                </p>
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
                <p className="text-sm text-muted-foreground">
                  {translate("messages.noMessages")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PatientMessages;