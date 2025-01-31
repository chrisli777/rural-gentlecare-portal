import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Bell, Calendar, Pill } from "lucide-react";

const PatientDashboard = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appointments Block */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>You have 2 upcoming appointments.</p>
              </CardContent>
            </Card>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Your next check-up is due in 2 weeks. Consider scheduling it now to ensure your preferred time slot.
              </AlertDescription>
            </Alert>
          </div>

          {/* Medications Block */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>You have 3 medications to take today.</p>
              </CardContent>
            </Card>
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                Remember to refill your blood pressure medication. Only 5 days of supply remaining.
              </AlertDescription>
            </Alert>
          </div>

          {/* Health Records Block */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Health Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Your last visit was on March 15, 2023.</p>
              </CardContent>
            </Card>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Your latest lab results are now available. Review them to track your progress.
              </AlertDescription>
            </Alert>
          </div>

          {/* Educational Resources Block */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Educational Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Check out the latest articles on health and wellness.</p>
              </CardContent>
            </Card>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                New article available: "Managing Chronic Conditions in Rural Areas - Tips and Strategies"
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;