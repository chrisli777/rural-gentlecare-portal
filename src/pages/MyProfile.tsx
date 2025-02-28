
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { User, Phone, Mail, Home, Shield, Bell, Settings, Edit, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const MyProfile = () => {
  const { language } = useAccessibility();
  const [editMode, setEditMode] = useState(false);
  
  // Sample user data
  const [userData, setUserData] = useState({
    firstName: "Maria",
    lastName: "Johnson",
    email: "maria.johnson@example.com",
    phone: "555-123-4567",
    dob: "1985-04-12",
    address: "123 Main St, Anytown, USA",
    emergencyContact: "John Johnson (Husband)",
    emergencyPhone: "555-987-6543",
  });

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    // In a real app, we would save the data to the database here
    setEditMode(false);
    // Show success message (not implemented in this example)
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData({
      ...userData,
      [field]: value
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              {language === 'en' ? 'My Profile' : 'Mi Perfil'}
            </h1>
            <Button 
              onClick={editMode ? handleSave : handleEditToggle}
              className="flex items-center gap-2 bg-[#1E5AAB] hover:bg-[#1E5AAB]/90"
            >
              {editMode ? (
                <>
                  <Save className="h-4 w-4" />
                  {language === 'en' ? 'Save Changes' : 'Guardar Cambios'}
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  {language === 'en' ? 'Edit Profile' : 'Editar Perfil'}
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Profile Summary Card */}
            <Card className="lg:col-span-1">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
                  <AvatarImage src="https://i.pravatar.cc/150?img=36" alt="Maria Johnson" />
                  <AvatarFallback className="bg-[#1E5AAB] text-white text-xl">
                    MJ
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mt-4">{userData.firstName} {userData.lastName}</h2>
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Patient ID: ' : 'ID de Paciente: '}P-78901234
                </p>
                <div className="w-full mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{userData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Home className="h-4 w-4 text-gray-500" />
                    <span>{userData.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="personal" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {language === 'en' ? 'Personal Info' : 'Información Personal'}
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {language === 'en' ? 'Security' : 'Seguridad'}
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {language === 'en' ? 'Preferences' : 'Preferencias'}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6 pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {language === 'en' ? 'Personal Information' : 'Información Personal'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">{language === 'en' ? 'First Name' : 'Nombre'}</Label>
                          <Input 
                            id="firstName" 
                            value={userData.firstName} 
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            disabled={!editMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">{language === 'en' ? 'Last Name' : 'Apellido'}</Label>
                          <Input 
                            id="lastName" 
                            value={userData.lastName} 
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            disabled={!editMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{language === 'en' ? 'Email' : 'Correo Electrónico'}</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={userData.email} 
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={!editMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">{language === 'en' ? 'Phone' : 'Teléfono'}</Label>
                          <Input 
                            id="phone" 
                            value={userData.phone} 
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={!editMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob">{language === 'en' ? 'Date of Birth' : 'Fecha de Nacimiento'}</Label>
                          <Input 
                            id="dob" 
                            type="date" 
                            value={userData.dob} 
                            onChange={(e) => handleInputChange('dob', e.target.value)}
                            disabled={!editMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">{language === 'en' ? 'Address' : 'Dirección'}</Label>
                          <Input 
                            id="address" 
                            value={userData.address} 
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            disabled={!editMode}
                          />
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <h3 className="text-lg font-medium mb-4">
                        {language === 'en' ? 'Emergency Contact' : 'Contacto de Emergencia'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContact">
                            {language === 'en' ? 'Contact Name & Relation' : 'Nombre y Relación del Contacto'}
                          </Label>
                          <Input 
                            id="emergencyContact" 
                            value={userData.emergencyContact} 
                            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                            disabled={!editMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyPhone">
                            {language === 'en' ? 'Contact Phone' : 'Teléfono del Contacto'}
                          </Label>
                          <Input 
                            id="emergencyPhone" 
                            value={userData.emergencyPhone} 
                            onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                            disabled={!editMode}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6 pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {language === 'en' ? 'Security Settings' : 'Configuración de Seguridad'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          {language === 'en' ? 'Login Security' : 'Seguridad de Inicio de Sesión'}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {language === 'en' ? 'Change Password' : 'Cambiar Contraseña'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {language === 'en' ? 'Last changed 3 months ago' : 'Último cambio hace 3 meses'}
                            </p>
                          </div>
                          <Button variant="outline">
                            {language === 'en' ? 'Update' : 'Actualizar'}
                          </Button>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {language === 'en' ? 'Two-Factor Authentication' : 'Autenticación de Dos Factores'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {language === 'en' ? 'Add an extra layer of security' : 'Añade una capa extra de seguridad'}
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6 pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {language === 'en' ? 'Notification Preferences' : 'Preferencias de Notificaciones'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {language === 'en' ? 'Appointment Reminders' : 'Recordatorios de Citas'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {language === 'en' ? 'Get notified about upcoming appointments' : 'Recibe notificaciones sobre próximas citas'}
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {language === 'en' ? 'Medication Reminders' : 'Recordatorios de Medicación'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {language === 'en' ? 'Get reminders for your medications' : 'Recibe recordatorios para tus medicamentos'}
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {language === 'en' ? 'Health Tips & Updates' : 'Consejos de Salud y Actualizaciones'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {language === 'en' ? 'Receive occasional health tips and news' : 'Recibe consejos de salud y noticias ocasionales'}
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyProfile;
