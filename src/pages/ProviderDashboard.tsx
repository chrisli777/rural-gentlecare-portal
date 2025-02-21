
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Brain, Sparkles, FileText, Download, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [showReport, setShowReport] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Demo AI suggestions
  const aiSuggestions = [
    "Based on the symptoms described, consider checking for chronic lower back strain",
    "Patient history suggests potential need for physical therapy evaluation",
    "Recommend following up on previous medication effectiveness"
  ];

  const handleAnalyzeSymptoms = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleGenerateReport = () => {
    setShowReport(true);
  };

  const handleDownloadPDF = () => {
    console.log("Downloading PDF...");
  };

  const handleSendToPatient = () => {
    console.log("Sending to patient...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <p className="text-xl text-gray-600">Welcome back, Dr. Adams</p>
            <Button variant="outline" onClick={() => navigate("/")} className="text-gray-600">
              Sign Out
            </Button>
          </div>

          <div className="flex gap-6">
            {/* Left Column - Stats Cards */}
            <div className="w-64 space-y-4">
              <Card 
                className="bg-blue-50 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/provider/total-appointments")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-gray-600">Today</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-green-50 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/provider/pending-reviews")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                  <Clock className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-gray-600">Voice recordings to review</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-purple-50 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/provider/new-patients")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Patients</CardTitle>
                  <User className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-gray-600">This week</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 space-y-6">
              {/* Patient Info Card */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-medium">Sarah Johnson</h3>
                    <div className="text-sm text-gray-500 space-x-4">
                      <span>Age: 45</span>
                      <span>•</span>
                      <span>Gender: Female</span>
                    </div>
                  </div>
                </div>

                {/* AI Analysis Section */}
                <Card className="p-4 bg-blue-50/50 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium">AI Assistant Insights</h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={handleAnalyzeSymptoms}
                      disabled={isAnalyzing}
                    >
                      <Sparkles className="h-4 w-4" />
                      {isAnalyzing ? "Analyzing..." : "Analyze Symptoms"}
                    </Button>
                  </div>
                  <div className="mt-4 space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="min-w-4">•</div>
                        <p>{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Diagnostic Results */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Diagnostic Results</label>
                    <Textarea
                      placeholder="Enter your diagnostic findings here..."
                      value={diagnosticResults}
                      onChange={(e) => setDiagnosticResults(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => {}}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Contact for More Information
                    </Button>
                    <Button
                      variant="default"
                      className="gap-2"
                      onClick={handleGenerateReport}
                    >
                      <FileText className="h-4 w-4" />
                      Generate Report
                    </Button>
                  </div>
                  
                  {showReport && (
                    <div className="space-y-4 animate-fade-in">
                      <Textarea
                        className="min-h-[200px]"
                        value={`Patient: Sarah Johnson
Date: 2024-02-20
Time: 11:30 AM

Chief Complaint:
Online consultation

Diagnostic Results:
${diagnosticResults}

AI-Assisted Analysis:
- Potential chronic lower back strain indicated
- Consider physical therapy evaluation
- Monitor medication effectiveness

Assessment:
Patient presents with stable condition, monitoring recommended.

Plan:
1. Continue current medication regimen
2. Schedule follow-up appointment in 2 weeks
3. Monitor symptoms and document any changes`}
                        readOnly
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" className="gap-2" onClick={handleDownloadPDF}>
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                        <Button className="gap-2" onClick={handleSendToPatient}>
                          <Send className="h-4 w-4" />
                          Send to Patient
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
