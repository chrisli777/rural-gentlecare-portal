import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Play, FileText, Download, Send, MessageSquare, User, ChevronRight, Brain, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: {
    id: number;
    patientName: string;
    time: string;
    date: string;
    notes: string;
    status: string;
    viewOnly?: boolean;
    report?: {
      diagnosis: string;
      prescription: string;
      recommendations: string;
    };
  };
  hidePlayRecording?: boolean;
  hideContactInfo?: boolean;
  onSendToPatient?: () => void;
}

export const ReviewDialog = ({ 
  open, 
  onOpenChange, 
  appointment,
  hidePlayRecording = false,
  hideContactInfo = false,
  onSendToPatient
}: ReviewDialogProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReport, setShowReport] = useState(appointment.viewOnly);
  const [diagnosticResults, setDiagnosticResults] = useState(
    appointment.report?.diagnosis || ""
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Demo patient data
  const patientInfo = {
    age: 45,
    gender: "Male",
    contactNumber: "+1 (555) 123-4567",
    lastVisit: "2024-01-15"
  };

  // Demo AI suggestions
  const aiSuggestions = [
    "Based on the symptoms described, consider checking for chronic lower back strain",
    "Patient history suggests potential need for physical therapy evaluation",
    "Recommend following up on previous medication effectiveness"
  ];

  const handlePlayRecording = () => {
    setIsPlaying(!isPlaying);
  };

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
    if (onSendToPatient) {
      onSendToPatient();
    }
  };

  const handleViewDetails = () => {
    console.log("View patient details");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {appointment.viewOnly ? "View Report" : "Review Recording"} - {appointment.patientName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6 pr-4">
          {/* Patient Basic Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">{appointment.patientName}</h3>
                  <div className="text-sm text-gray-500 space-x-4">
                    <span>Age: {patientInfo.age}</span>
                    <span>•</span>
                    <span>Gender: {patientInfo.gender}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                className="gap-2"
                onClick={handleViewDetails}
              >
                View Details
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Recording Player - Only show if not viewOnly */}
          {!hidePlayRecording && !appointment.viewOnly && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Recorded on {appointment.date} at {appointment.time}
                </p>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handlePlayRecording}
                >
                  <Play className="h-4 w-4" />
                  {isPlaying ? "Pause Recording" : "Play Recording"}
                </Button>
              </div>
              {isPlaying && (
                <div className="bg-secondary/20 p-4 rounded-md">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-primary rounded-full animate-[soundbar_1s_ease-in-out_infinite]`}
                        style={{
                          height: Math.random() * 24 + 8,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Analysis Section - Only show if not viewOnly */}
          {!appointment.viewOnly && (
            <Card className="p-4 bg-blue-50/50">
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
          )}

          {/* Report Section */}
          <div className="space-y-4">
            {!appointment.viewOnly && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Diagnostic Results</label>
                <Textarea
                  placeholder="Enter your diagnostic findings here..."
                  value={diagnosticResults}
                  onChange={(e) => setDiagnosticResults(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            )}

            {!appointment.viewOnly && (
              <div className="flex justify-between items-center">
                {!hideContactInfo && (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => onOpenChange(false)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Contact for More Information
                  </Button>
                )}
                <Button
                  variant="default"
                  className="gap-2"
                  onClick={handleGenerateReport}
                >
                  <FileText className="h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            )}
            
            {(showReport || appointment.viewOnly) && (
              <div className="space-y-4 animate-fade-in">
                <Textarea
                  className="min-h-[200px]"
                  value={appointment.viewOnly ? 
`Patient: ${appointment.patientName}
Date: ${appointment.date}
Time: ${appointment.time}

Chief Complaint:
${appointment.notes}

Diagnostic Results:
${appointment.report?.diagnosis || ''}

Prescription:
${appointment.report?.prescription || ''}

Recommendations:
${appointment.report?.recommendations || ''}

Status: ${appointment.status}`
                    :
`Patient: ${appointment.patientName}
Date: ${appointment.date}
Time: ${appointment.time}

Chief Complaint:
${appointment.notes}

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
                  {!appointment.viewOnly && (
                    <Button className="gap-2" onClick={handleSendToPatient}>
                      <Send className="h-4 w-4" />
                      Send to Patient
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
