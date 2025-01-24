import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, AlertCircle, Pill, Info, AudioWaveform } from "lucide-react";

const PatientProfile = () => {
  const [activeTab, setActiveTab] = useState("basic");

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Header />
      <main className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg" alt="Profile picture" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">John Doe</h1>
              <AudioWaveform
                className="h-5 w-5 cursor-pointer hover:text-primary/80"
                onClick={() => speakText("John Doe's Profile")}
              />
            </div>
            <p className="text-muted-foreground">Patient ID: 123456</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Medical Records
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Health Risks
            </TabsTrigger>
            <TabsTrigger value="medications" className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="other" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Other Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Basic Information</CardTitle>
                  <AudioWaveform
                    className="h-4 w-4 cursor-pointer hover:text-primary/80"
                    onClick={() => speakText("Basic Information")}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-muted-foreground">Full Name</p>
                    <p>John Doe</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Date of Birth</p>
                    <p>January 1, 1960</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Contact Number</p>
                    <p>(555) 123-4567</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Email</p>
                    <p>john.doe@example.com</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Emergency Contact</p>
                    <p>Jane Doe - (555) 987-6543</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Blood Type</p>
                    <p>O+</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Medical Records</CardTitle>
                  <AudioWaveform
                    className="h-4 w-4 cursor-pointer hover:text-primary/80"
                    onClick={() => speakText("Medical Records")}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Recent Visits</h3>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Annual Checkup - December 15, 2023</li>
                      <li>Flu Shot - October 1, 2023</li>
                      <li>Blood Pressure Check - September 15, 2023</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Vaccinations</h3>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>COVID-19 Booster - March 2023</li>
                      <li>Flu Shot - October 2023</li>
                      <li>Pneumonia - January 2022</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Surgeries</h3>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Knee Replacement - 2020</li>
                      <li>Appendectomy - 1985</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Health Risks</CardTitle>
                  <AudioWaveform
                    className="h-4 w-4 cursor-pointer hover:text-primary/80"
                    onClick={() => speakText("Health Risks")}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-destructive/10 rounded-lg">
                    <h3 className="font-semibold text-destructive mb-2">High Priority</h3>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>High Blood Pressure</li>
                      <li>Type 2 Diabetes Risk</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-yellow-100 rounded-lg">
                    <h3 className="font-semibold text-yellow-700 mb-2">Moderate Risk</h3>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Family History of Heart Disease</li>
                      <li>Elevated Cholesterol</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Current Medications</CardTitle>
                  <AudioWaveform
                    className="h-4 w-4 cursor-pointer hover:text-primary/80"
                    onClick={() => speakText("Current Medications")}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Lisinopril</h3>
                      <p className="text-sm text-muted-foreground mb-2">For Blood Pressure</p>
                      <ul className="text-sm space-y-1">
                        <li>Dosage: 10mg</li>
                        <li>Frequency: Once daily</li>
                        <li>Time: Morning</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Metformin</h3>
                      <p className="text-sm text-muted-foreground mb-2">For Blood Sugar</p>
                      <ul className="text-sm space-y-1">
                        <li>Dosage: 500mg</li>
                        <li>Frequency: Twice daily</li>
                        <li>Time: Morning and Evening</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Supplements</h3>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Vitamin D - 1000 IU daily</li>
                      <li>Calcium - 500mg daily</li>
                      <li>Fish Oil - 1000mg daily</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="other">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Additional Information</CardTitle>
                  <AudioWaveform
                    className="h-4 w-4 cursor-pointer hover:text-primary/80"
                    onClick={() => speakText("Additional Information")}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Lifestyle</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-muted-foreground">Exercise Routine</p>
                      <p>30 minutes walking, 3 times per week</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Diet Restrictions</p>
                      <p>Low sodium, No added sugars</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Insurance Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-muted-foreground">Provider</p>
                      <p>HealthCare Plus</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Policy Number</p>
                      <p>HCP123456789</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-muted-foreground">Preferred Contact Method</p>
                      <p>Phone Call</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Language</p>
                      <p>English</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PatientProfile;