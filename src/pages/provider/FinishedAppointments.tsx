
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { User, FileText, Filter, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ReviewDialog } from "@/components/provider/ReviewDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FinishedAppointments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const finishedAppointments = [
    {
      id: 4,
      patientName: "David Wilson",
      time: "9:00 AM",
      date: "2024-02-20",
      type: "In-person consultation",
      notes: "Annual check-up",
      status: "Completed",
      report: {
        diagnosis: "Healthy overall, minor vitamin D deficiency",
        prescription: "Vitamin D supplements",
        recommendations: "Regular exercise, balanced diet"
      }
    },
    {
      id: 5,
      patientName: "Lisa Zhang",
      time: "3:30 PM",
      date: "2024-02-21",
      type: "Online consultation",
      notes: "Follow-up on medication",
      status: "Completed",
      report: {
        diagnosis: "Symptoms improving with current medication",
        prescription: "Continue current medication",
        recommendations: "Monthly follow-up"
      }
    }
  ];

  const handleViewReport = (appointment: any) => {
    setSelectedAppointment({ ...appointment, viewOnly: true });
  };

  const filteredAppointments = finishedAppointments.filter(appointment => {
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
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Finished Appointments</h1>
          </div>

          <div className="space-y-6">
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleViewReport(appointment)}
                    >
                      <FileText className="h-4 w-4" />
                      View Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedAppointment && (
        <ReviewDialog
          open={!!selectedAppointment}
          onOpenChange={(open) => !open && setSelectedAppointment(null)}
          appointment={selectedAppointment}
        />
      )}
    </div>
  );
};

export default FinishedAppointments;
