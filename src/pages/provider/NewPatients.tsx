
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { User, Users } from "lucide-react";
import { useState } from "react";
import { PatientDetailDialog } from "@/components/provider/PatientDetailDialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NewPatients = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const navigate = useNavigate();

  const newPatients = [
    {
      id: 1,
      name: "Emma Wilson",
      dateJoined: "2024-02-19",
      reason: "General consultation",
      age: 28
    },
    {
      id: 2,
      name: "James Thompson",
      dateJoined: "2024-02-18",
      reason: "Back pain evaluation",
      age: 45
    },
    {
      id: 3,
      name: "Sofia Rodriguez",
      dateJoined: "2024-02-18",
      reason: "Annual check-up",
      age: 32
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">New Patients</h1>
              <p className="text-xl text-gray-600 mt-2">Recently registered patients</p>
            </div>
            <Button 
              onClick={() => navigate("/provider/all-patients")}
              className="gap-2 bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white"
            >
              <Users className="h-4 w-4" />
              All Patients
            </Button>
          </div>

          <div className="space-y-4">
            {newPatients.map((patient) => (
              <Card 
                key={patient.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedPatient(patient)}
              >
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">Age: {patient.age}</p>
                      <p className="text-sm text-gray-600">{patient.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Joined {patient.dateJoined}</p>
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

export default NewPatients;
