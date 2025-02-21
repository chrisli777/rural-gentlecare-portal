
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { User, Video, Calendar as CalendarIcon, Filter, Search, FileText } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PatientDetailDialog } from "@/components/provider/PatientDetailDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TotalAppointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
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
    setSelectedPatient({
      id: appointment.id,
      name: appointment.patientName,
      dateJoined: "2024-01-01", // Demo data
      reason: appointment.notes,
      age: 35, // Demo data
      report: appointment.report
    });
    setIsPatientDialogOpen(true);
  };

  const filteredUpcomingAppointments = upcomingAppointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || 
                       (filterType === "online" && appointment.type === "Online consultation") ||
                       (filterType === "in-person" && appointment.type === "In-person consultation");
    return matchesSearch && matchesType;
  });

  const filteredFinishedAppointments = finishedAppointments.filter(appointment => {
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
              <h1 className="text-4xl font-bold text-gray-900">Total Appointments</h1>
              <p className="text-xl text-gray-600 mt-2">View and manage all appointments</p>
            </div>
            <Button onClick={() => console.log("Add new appointment")} className="self-start">
              Add Appointment
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            <Card className="p-4 h-fit">
              <h3 className="font-semibold mb-4">Calendar</h3>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border w-full"
              />
            </Card>

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
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All appointments</SelectItem>
                    <SelectItem value="online">Online only</SelectItem>
                    <SelectItem value="in-person">In-person only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Upcoming Appointments */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
                <div className="space-y-4">
                  {filteredUpcomingAppointments.map((appointment) => (
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
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
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
                          <Button variant="outline" size="sm" className="gap-2">
                            <Video className="h-4 w-4" />
                            Join Meet
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finished Appointments */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Finished Appointments</h2>
                <div className="space-y-4">
                  {filteredFinishedAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                          <p className="text-sm text-gray-600">{appointment.notes}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
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
