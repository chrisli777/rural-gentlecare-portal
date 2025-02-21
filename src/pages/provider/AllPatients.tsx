
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PatientDetailDialog } from "@/components/provider/PatientDetailDialog";
import { useNavigate } from "react-router-dom";

const AllPatients = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const navigate = useNavigate();

  const allPatients = [
    {
      id: 1,
      name: "Emma Wilson",
      age: 28,
      condition: "General wellness",
      lastVisit: "2024-02-19",
      status: "Active"
    },
    {
      id: 2,
      name: "James Thompson",
      age: 45,
      condition: "Chronic back pain",
      lastVisit: "2024-02-18",
      status: "Active"
    },
    {
      id: 3,
      name: "Sofia Rodriguez",
      age: 32,
      condition: "Regular check-up",
      lastVisit: "2024-02-18",
      status: "Active"
    },
    {
      id: 4,
      name: "Michael Chen",
      age: 52,
      condition: "Hypertension management",
      lastVisit: "2024-02-15",
      status: "Active"
    },
    {
      id: 5,
      name: "Sarah Johnson",
      age: 35,
      condition: "Migraine treatment",
      lastVisit: "2024-02-14",
      status: "Active"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">All Patients</h1>
            <p className="text-xl text-gray-600 mt-2">Complete list of registered patients</p>
          </div>

          <div className="space-y-4">
            {allPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">Age: {patient.age}</p>
                      <p className="text-sm text-gray-600">{patient.condition}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-sm text-gray-600">Last Visit</p>
                      <p className="text-sm font-medium text-gray-900">{patient.lastVisit}</p>
                      <p className="text-sm text-green-600">{patient.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-[#1E5AAB] hover:text-[#1E5AAB]/90 hover:bg-[#1E5AAB]/10"
                        onClick={() => navigate("/provider/past-reviews")}
                      >
                        <FileText className="h-4 w-4" />
                        Report History
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {selectedPatient && (
        <PatientDetailDialog
          open={!!selectedPatient}
          onOpenChange={(open) => !open && setSelectedPatient(null)}
          patient={selectedPatient}
        />
      )}
    </div>
  );
};

export default AllPatients;
