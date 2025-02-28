
import { Header } from "@/components/layout/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { translations } from "@/utils/translations";
import { User, Phone, Calendar, Home, Heart, AlertCircle, FileText, Activity, Bell } from "lucide-react";

const Profile = () => {
  const { language } = useAccessibility();
  const t = translations[language];

  // Dummy profile data
  const profile = {
    firstName: "Maria",
    lastName: "Garcia",
    dateOfBirth: "1965-09-23",
    address: "267 Pine Road, Adams County, CO 80640",
    phone: "+1 (303) 555-8127",
    email: "maria.garcia@example.com",
    emergency: {
      name: "Robert Garcia",
      relationship: "Son",
      phone: "+1 (303) 555-9284"
    },
    medical: {
      bloodType: "O+",
      allergies: "Penicillin, Peanuts",
      conditions: "Type 2 Diabetes, Hypertension",
      medications: "Metformin 500mg, Lisinopril 10mg, Aspirin 81mg"
    },
    insurance: {
      provider: "Medicare Advantage Plan",
      policyNumber: "MA463891275",
      groupNumber: "MAGRP7524",
      expirationDate: "2023-12-31"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24 border-2 border-white shadow-md">
                  <AvatarImage src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" />
                  <AvatarFallback className="bg-[#1E5AAB] text-white text-xl">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
                  <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(profile.dateOfBirth).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {" "} • {" "}
                    {new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()} years
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-[#1E5AAB]" />
                {language === 'en' ? 'Personal Information' : 'Información Personal'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Phone Number' : 'Número de Teléfono'}
                </h3>
                <p className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {profile.phone}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Email' : 'Correo Electrónico'}
                </h3>
                <p className="mt-1">{profile.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Address' : 'Dirección'}
                </h3>
                <p className="flex items-start gap-2 mt-1">
                  <Home className="h-4 w-4 text-gray-400 mt-1" />
                  {profile.address}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-[#1E5AAB]" />
                {language === 'en' ? 'Emergency Contact' : 'Contacto de Emergencia'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Name' : 'Nombre'}
                </h3>
                <p className="mt-1">{profile.emergency.name} ({profile.emergency.relationship})</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Phone Number' : 'Número de Teléfono'}
                </h3>
                <p className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {profile.emergency.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-[#1E5AAB]" />
                {language === 'en' ? 'Medical Information' : 'Información Médica'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Blood Type' : 'Tipo de Sangre'}
                </h3>
                <p className="mt-1">{profile.medical.bloodType}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Allergies' : 'Alergias'}
                </h3>
                <p className="mt-1">{profile.medical.allergies}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Medical Conditions' : 'Condiciones Médicas'}
                </h3>
                <p className="mt-1">{profile.medical.conditions}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {language === 'en' ? 'Current Medications' : 'Medicamentos Actuales'}
                </h3>
                <p className="mt-1">{profile.medical.medications}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8">
            <Button className="bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white">
              {language === 'en' ? 'Edit Profile' : 'Editar Perfil'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
