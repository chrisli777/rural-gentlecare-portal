import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, MessageSquare, User, Bot, Bell, ShieldAlert, Info, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 pt-20">
        {/* Quick Actions Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Appointment Booking */}
            <Link to="/patient/appointment" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Calendar className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Appointment Booking</h3>
                  <p className="text-gray-600">Schedule your next visit with our healthcare providers.</p>
                </CardContent>
              </Card>
            </Link>

            {/* Messages & Notifications */}
            <Link to="/patient/messages" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <MessageSquare className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Messages & Notifications</h3>
                  <p className="text-gray-600">View your messages and important notifications.</p>
                </CardContent>
              </Card>
            </Link>

            {/* My Profile */}
            <Link to="/patient/profile" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <User className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">My Profile</h3>
                  <p className="text-gray-600">Manage your personal information and preferences.</p>
                </CardContent>
              </Card>
            </Link>

            {/* AI Health Assistant */}
            <Link to="/patient/ai-assistant" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Bot className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">AI Health Assistant</h3>
                  <p className="text-gray-600">Get personalized health guidance and support.</p>
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
                Medical Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Activity className="h-4 w-4" />
                <AlertTitle>Exercise Recommendation</AlertTitle>
                <AlertDescription>
                  Consider a 30-minute daily walk to improve cardiovascular health.
                </AlertDescription>
              </Alert>
              <Alert>
                <Activity className="h-4 w-4" />
                <AlertTitle>Diet Suggestion</AlertTitle>
                <AlertDescription>
                  Increase your daily water intake to 8 glasses for better hydration.
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
                Important Health Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTitle>Medication Reminder</AlertTitle>
                <AlertDescription>
                  Don't forget to take your evening medication at 8:00 PM
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertTitle>Upcoming Lab Work</AlertTitle>
                <AlertDescription>
                  Schedule your quarterly blood work before March 30, 2024
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