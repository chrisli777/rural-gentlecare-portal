import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, AudioWaveform } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientProfile = () => {
  const navigate = useNavigate();
  
  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with proper spacing from header */}
      <div className="container mx-auto px-4 pt-24">
        <div className="flex items-center gap-2 mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <AudioWaveform
            className="h-6 w-6 cursor-pointer hover:text-primary/80"
            onClick={() => speakText("My Profile")}
          />
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="medical">Medical Records</TabsTrigger>
            <TabsTrigger value="risks">Health Risks</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="additional">Additional Info</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Personal Information</h3>
                      <p>Name: John Doe</p>
                      <p>Age: 72</p>
                      <p>Date of Birth: 01/15/1952</p>
                      <p>Gender: Male</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Contact Information</h3>
                      <p>Phone: (509) 555-0123</p>
                      <p>Email: john.doe@example.com</p>
                      <p>Address: 123 Farm Road, Ritzville, WA 99169</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Current Conditions</h3>
                    <ul className="list-disc pl-5">
                      <li>Type 2 Diabetes</li>
                      <li>Hypertension</li>
                      <li>Osteoarthritis</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Past Surgeries</h3>
                    <ul className="list-disc pl-5">
                      <li>Knee Replacement (2019)</li>
                      <li>Appendectomy (1985)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Allergies</h3>
                    <ul className="list-disc pl-5">
                      <li>Penicillin</li>
                      <li>Shellfish</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Current Health Risks</h3>
                    <ul className="list-disc pl-5">
                      <li>High risk of falls due to mobility issues</li>
                      <li>Cardiovascular complications due to hypertension</li>
                      <li>Diabetic complications</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Preventive Measures</h3>
                    <ul className="list-disc pl-5">
                      <li>Regular blood pressure monitoring</li>
                      <li>Daily blood sugar checks</li>
                      <li>Physical therapy exercises</li>
                      <li>Regular eye examinations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Current Medications</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Morning</h4>
                        <ul className="list-disc pl-5">
                          <li>Metformin 500mg</li>
                          <li>Lisinopril 10mg</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Evening</h4>
                        <ul className="list-disc pl-5">
                          <li>Metformin 500mg</li>
                          <li>Aspirin 81mg</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Supplements</h3>
                    <ul className="list-disc pl-5">
                      <li>Vitamin D3</li>
                      <li>Calcium</li>
                      <li>B12</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Insurance Information</h3>
                    <p>Provider: Medicare</p>
                    <p>Policy Number: XXX-XX-1234</p>
                    <p>Group Number: 987654</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Emergency Contacts</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium">Primary Contact</p>
                        <p>Mary Doe (Daughter)</p>
                        <p>(509) 555-4567</p>
                      </div>
                      <div>
                        <p className="font-medium">Secondary Contact</p>
                        <p>James Doe (Son)</p>
                        <p>(509) 555-7890</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Lifestyle Information</h3>
                    <ul className="list-disc pl-5">
                      <li>Diet: Low sodium, diabetic</li>
                      <li>Exercise: Daily 30-minute walks</li>
                      <li>Occupation: Retired farmer</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientProfile;