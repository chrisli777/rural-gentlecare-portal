
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { User, Video, Filter, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { PatientDetailDialog } from "@/components/provider/PatientDetailDialog";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TotalAppointments = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState<{
    id: number;
    name: string;
    dateJoined: string;
    reason: string;
    age: number;
    report?: {
      diagnosis: string;
      prescription: string;
      recommendations: string;
    };
  } | null>(null);
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);

  const upcomingAppointments = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      time: "10:00 AM",
      date: "2024-02-23",
      type: "In-person consultation",
      notes: "Follow-up for respiratory symptoms",
      status: "Scheduled"
    },
    {
      id: 2,
      patientName: "Michael Chen",
      time: "11:30 AM",
      date: "2024-02-24",
      type: "Online consultation",
      notes: "Initial consultation - chronic back pain",
      status: "Pending Review"
    },
    {
      id: 3,
      patientName: "Emily Brown",
      time: "2:15 PM",
      date: "2024-02-25",
      type: "Online consultation",
      notes: "Medication review - anxiety management",
      status: "Voice Recording Ready"
    }
  ];

  const filteredAppointments = upcomingAppointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || 
                       (filterType === "online" && appointment.type === "Online consultation") ||
                       (filterType === "in-person" && appointment.type === "In-person consultation");
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Upcoming Appointments</h1>
            </div>
            <div>
              <Button 
                variant="default"
                onClick={() => navigate("/provider/finished-appointments")}
                className="bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white"
              >
                Finished Appointments
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search patients or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px] bg-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All appointments</SelectItem>
                  <SelectItem value="online">Online only</SelectItem>
                  <SelectItem value="in-person">In-person only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-6 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                      <p className="text-sm text-gray-600">{appointment.notes}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">
                          {appointment.date} at {appointment.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{appointment.type}</p>
                      <p className="text-sm text-gray-600">{appointment.status}</p>
                    </div>
                    {appointment.type === "Online consultation" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 text-[#1E5AAB] hover:text-[#1E5AAB]/90 hover:bg-[#1E5AAB]/10"
                        onClick={() => navigate("/provider/video-call")}
                      >
                        <Video className="h-4 w-4" />
                        Join Meet
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PatientDetailDialog 
        open={isPatientDialogOpen}
        onOpenChange={setIsPatientDialogOpen}
        patient={selectedPatient}
      />
    </div>
  );
};

export default TotalAppointments;
