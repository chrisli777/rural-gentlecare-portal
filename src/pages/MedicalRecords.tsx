
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileDown, CalendarDays, Pill, Activity, LineChart } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Button } from "@/components/ui/button";

const MedicalRecords = () => {
  const { language } = useAccessibility();
  const [activeTab, setActiveTab] = useState("reports");

  // Sample medical records data
  const reports = [
    {
      id: 1,
      title: language === 'en' ? 'Annual Physical Examination' : 'Examen Físico Anual',
      date: '2023-12-15',
      doctor: 'Dr. Sarah Johnson',
      type: language === 'en' ? 'Examination' : 'Examen',
      status: language === 'en' ? 'Completed' : 'Completado'
    },
    {
      id: 2,
      title: language === 'en' ? 'Blood Test Results' : 'Resultados de Análisis de Sangre',
      date: '2023-11-02',
      doctor: 'Dr. Michael Chen',
      type: language === 'en' ? 'Laboratory' : 'Laboratorio',
      status: language === 'en' ? 'Completed' : 'Completado'
    },
    {
      id: 3,
      title: language === 'en' ? 'X-Ray Report' : 'Informe de Rayos X',
      date: '2023-09-18',
      doctor: 'Dr. Emily Rodriguez',
      type: language === 'en' ? 'Radiology' : 'Radiología',
      status: language === 'en' ? 'Completed' : 'Completado'
    }
  ];

  const medications = [
    {
      id: 1,
      name: language === 'en' ? 'Amoxicillin' : 'Amoxicilina',
      dosage: '500mg',
      frequency: language === 'en' ? 'Twice daily' : 'Dos veces al día',
      startDate: '2023-12-01',
      endDate: '2023-12-10',
      prescribedBy: 'Dr. Sarah Johnson'
    },
    {
      id: 2,
      name: language === 'en' ? 'Ibuprofen' : 'Ibuprofeno',
      dosage: '200mg',
      frequency: language === 'en' ? 'As needed for pain' : 'Según sea necesario para el dolor',
      startDate: '2023-11-15',
      endDate: 'Ongoing',
      prescribedBy: 'Dr. Michael Chen'
    }
  ];

  const allergies = [
    { id: 1, name: language === 'en' ? 'Penicillin' : 'Penicilina', severity: language === 'en' ? 'High' : 'Alta', notes: language === 'en' ? 'Causes rash and difficulty breathing' : 'Causa sarpullido y dificultad para respirar' },
    { id: 2, name: language === 'en' ? 'Peanuts' : 'Cacahuetes', severity: language === 'en' ? 'Moderate' : 'Moderada', notes: language === 'en' ? 'Causes hives' : 'Causa urticaria' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            {language === 'en' ? 'Medical Records' : 'Registros Médicos'}
          </h1>

          <Tabs defaultValue="reports" className="space-y-6" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="reports" className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                {language === 'en' ? 'Reports' : 'Informes'}
              </TabsTrigger>
              <TabsTrigger value="medications" className="flex items-center gap-2 text-sm">
                <Pill className="h-4 w-4" />
                {language === 'en' ? 'Medications' : 'Medicamentos'}
              </TabsTrigger>
              <TabsTrigger value="allergies" className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4" />
                {language === 'en' ? 'Allergies' : 'Alergias'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(report.date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{report.doctor}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            report.status === 'Completed' || report.status === 'Completado' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full md:w-auto flex items-center gap-2">
                          <FileDown className="h-4 w-4" />
                          {language === 'en' ? 'Download' : 'Descargar'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="medications" className="space-y-4">
              {medications.map((medication) => (
                <Card key={medication.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{medication.name}</h3>
                        <p className="text-sm text-gray-600">{medication.dosage} - {medication.frequency}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          {language === 'en' ? 'Prescribed by' : 'Recetado por'}: {medication.prescribedBy}
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-500" />
                          <span>
                            {new Date(medication.startDate).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })} - {
                              medication.endDate === 'Ongoing' 
                                ? (language === 'en' ? 'Ongoing' : 'En curso')
                                : new Date(medication.endDate).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="allergies" className="space-y-4">
              {allergies.map((allergy) => (
                <Card key={allergy.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{allergy.name}</h3>
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            allergy.severity === 'High' || allergy.severity === 'Alta'
                              ? 'bg-red-100 text-red-800' 
                              : allergy.severity === 'Moderate' || allergy.severity === 'Moderada'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}>
                            {language === 'en' ? 'Severity' : 'Gravedad'}: {allergy.severity}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{allergy.notes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MedicalRecords;
