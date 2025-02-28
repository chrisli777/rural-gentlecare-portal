
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileImage, FilePlus, Calendar, Activity } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { translations } from "@/utils/translations";

const MedicalRecords = () => {
  const { language } = useAccessibility();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState("reports");

  // Dummy data for demonstration
  const medicalReports = [
    { id: 1, title: "Annual Physical Examination", date: "2023-04-15", doctor: "Dr. Sarah Johnson" },
    { id: 2, title: "Blood Work Results", date: "2023-02-28", doctor: "Dr. Michael Chen" },
    { id: 3, title: "Cardiology Consultation", date: "2022-11-10", doctor: "Dr. Robert Williams" },
  ];

  const imagingResults = [
    { id: 1, title: "Chest X-Ray", date: "2023-03-20", type: "X-Ray" },
    { id: 2, title: "MRI - Right Knee", date: "2022-12-05", type: "MRI" },
  ];

  const prescriptions = [
    { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", prescribed: "2023-04-15", refills: 3 },
    { id: 2, name: "Metformin", dosage: "500mg", frequency: "Twice daily", prescribed: "2023-04-15", refills: 5 },
    { id: 3, name: "Atorvastatin", dosage: "20mg", frequency: "Once daily at bedtime", prescribed: "2023-02-28", refills: 2 },
  ];

  const immunizations = [
    { id: 1, name: "Influenza Vaccine", date: "2022-10-15", provider: "Adams Rural Clinic" },
    { id: 2, name: "COVID-19 Booster", date: "2022-09-03", provider: "Adams Rural Clinic" },
    { id: 3, name: "Tetanus/Diphtheria (Td)", date: "2020-05-22", provider: "County Health Department" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <h1 className="text-2xl font-bold mb-6">Medical Records</h1>
        
        <Tabs defaultValue="reports" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="imaging" className="flex items-center gap-2">
              <FileImage className="h-4 w-4" />
              <span className="hidden sm:inline">Imaging</span>
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              <span className="hidden sm:inline">Prescriptions</span>
            </TabsTrigger>
            <TabsTrigger value="immunizations" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Immunizations</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports" className="space-y-4">
            {medicalReports.map(report => (
              <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{report.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(report.date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{report.doctor}</p>
                    </div>
                    <FileText className="h-6 w-6 text-[#1E5AAB]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="imaging" className="space-y-4">
            {imagingResults.map(image => (
              <Card key={image.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{image.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(image.date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Type: {image.type}</p>
                    </div>
                    <FileImage className="h-6 w-6 text-[#1E5AAB]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="prescriptions" className="space-y-4">
            {prescriptions.map(prescription => (
              <Card key={prescription.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{prescription.name}</h3>
                      <p className="text-sm text-gray-600">{prescription.dosage} - {prescription.frequency}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Prescribed: {new Date(prescription.prescribed).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}
                      </p>
                      <p className="text-sm text-gray-600">Refills remaining: {prescription.refills}</p>
                    </div>
                    <FilePlus className="h-6 w-6 text-[#1E5AAB]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="immunizations" className="space-y-4">
            {immunizations.map(immunization => (
              <Card key={immunization.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{immunization.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(immunization.date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{immunization.provider}</p>
                    </div>
                    <Calendar className="h-6 w-6 text-[#1E5AAB]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MedicalRecords;
