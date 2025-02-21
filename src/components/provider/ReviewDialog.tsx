
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Play, FileText, Download, Send, MessageSquare } from "lucide-react";

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
  };
}

export const ReviewDialog = ({ open, onOpenChange, appointment }: ReviewDialogProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState("");

  const handlePlayRecording = () => {
    setIsPlaying(!isPlaying);
  };

  const handleGenerateReport = () => {
    setShowReport(true);
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading PDF...");
  };

  const handleSendToPatient = () => {
    // In a real app, this would send the report to the patient
    console.log("Sending to patient...");
  };

  const handleContactPatient = () => {
    // In a real app, this would open a communication channel
    console.log("Contacting patient...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Review Recording - {appointment.patientName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
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
                onClick={handleContactPatient}
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
              <div className="space-y-4">
                <Textarea
                  className="min-h-[200px]"
                  value={`Patient: ${appointment.patientName}
Date: ${appointment.date}
Time: ${appointment.time}

Chief Complaint:
${appointment.notes}

Diagnostic Results:
${diagnosticResults}

Assessment:
Patient presents with stable condition, monitoring recommended.

Plan:
1. Continue current medication regimen
2. Schedule follow-up appointment
3. Monitor symptoms`}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
