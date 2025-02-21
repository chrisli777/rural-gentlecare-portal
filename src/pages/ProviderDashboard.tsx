
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Bell, MessageSquare, Calendar as CalendarIcon } from "lucide-react";

const ProviderDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-[#1A1F2C]">Welcome back, Dr. Adams</h1>
              <p className="text-xl text-gray-600">Today's Overview</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")} className="text-gray-600">
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              className="bg-blue-50 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate("/provider/total-appointments")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-gray-600">Today</p>
              </CardContent>
            </Card>
            <Card 
              className="bg-green-50 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate("/provider/pending-reviews")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <Clock className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-gray-600">Voice recordings to review</p>
              </CardContent>
            </Card>
            <Card 
              className="bg-purple-50 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate("/provider/new-patients")}
            >
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

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Notifications & Tasks</h2>
            
            {/* New Patient Records Notification */}
            <Card className="bg-[#F2FCE2] border-none">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">New Patient Records Available</h3>
                  <p className="text-sm text-gray-600">3 new patient records need your review</p>
                </div>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-50"
                  onClick={() => navigate("/provider/new-patients")}
                >
                  Review Now
                </Button>
              </CardContent>
            </Card>

            {/* Patient Messages Notification */}
            <Card className="bg-blue-50/50 border-none">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Unread Patient Messages</h3>
                  <p className="text-sm text-gray-600">5 messages require your attention</p>
                </div>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-50"
                >
                  View Messages
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Appointments Notification */}
            <Card className="bg-purple-50/50 border-none">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Upcoming Appointments</h3>
                  <p className="text-sm text-gray-600">2 appointments scheduled for tomorrow</p>
                </div>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-50"
                  onClick={() => navigate("/provider/total-appointments")}
                >
                  View Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
