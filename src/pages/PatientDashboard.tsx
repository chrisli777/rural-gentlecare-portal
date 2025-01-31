import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, MessageSquare, User, Bot, Bell, ShieldAlert, Info, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const PatientDashboard = () => {
  const { translate } = useAccessibility();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 pt-20">
        {/* Quick Actions Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{translate("dashboard.quickActions")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Appointment Booking */}
            <Link to="/patient/appointment" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Calendar className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{translate("dashboard.appointmentBooking")}</h3>
                  <p className="text-gray-600">{translate("dashboard.scheduleVisit")}</p>
                </CardContent>
              </Card>
            </Link>

            {/* Messages & Notifications */}
            <Link to="/patient/messages" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <MessageSquare className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{translate("dashboard.messages")}</h3>
                  <p className="text-gray-600">{translate("dashboard.viewMessages")}</p>
                </CardContent>
              </Card>
            </Link>

            {/* My Profile */}
            <Link to="/patient/profile" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <User className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{translate("dashboard.profile")}</h3>
                  <p className="text-gray-600">{translate("dashboard.manageProfile")}</p>
                </CardContent>
              </Card>
            </Link>

            {/* AI Health Assistant */}
            <Link to="/patient/ai-assistant" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Bot className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{translate("dashboard.aiAssistant")}</h3>
                  <p className="text-gray-600">{translate("dashboard.aiGuidance")}</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Medical Suggestions Section */}
        <section className="mb-8">
          <Card className="shadow-md bg-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-accent" />
                {translate("dashboard.medicalSuggestions")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Activity className="h-4 w-4" />
                <AlertTitle>{translate("dashboard.exerciseTitle")}</AlertTitle>
                <AlertDescription>
                  {translate("dashboard.exerciseDesc")}
                </AlertDescription>
              </Alert>
              <Alert>
                <Activity className="h-4 w-4" />
                <AlertTitle>{translate("dashboard.dietTitle")}</AlertTitle>
                <AlertDescription>
                  {translate("dashboard.dietDesc")}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>

        {/* Health Alerts Section */}
        <section>
          <Card className="shadow-md bg-muted/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-destructive" />
                {translate("dashboard.healthAlerts")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTitle>{translate("dashboard.medicationReminder")}</AlertTitle>
                <AlertDescription>
                  {translate("dashboard.medicationDesc")}
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertTitle>{translate("dashboard.labWork")}</AlertTitle>
                <AlertDescription>
                  {translate("dashboard.labWorkDesc")}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;