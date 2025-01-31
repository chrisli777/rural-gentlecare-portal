import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell, Heart, Pill, Calendar, ShieldAlert, Info, Activity } from "lucide-react";

const PatientDashboard = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      
      {/* Main Dashboard Blocks */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Next appointment: Dr. Smith on March 15, 2024</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>3 medications due today</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Health Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Blood pressure: 120/80</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>2 new messages from your healthcare team</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information Blocks */}
        <div className="space-y-6">
          {/* Medical Suggestions */}
          <Card className="shadow-md bg-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-accent" />
                Medical Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <ShieldAlert className="h-4 w-4" />
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

          {/* Health Alerts */}
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
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;