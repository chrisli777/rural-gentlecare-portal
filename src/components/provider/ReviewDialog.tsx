
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Play, FileText } from "lucide-react";

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

  const handlePlayRecording = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would play the actual recording
  };

  const handleGenerateReport = () => {
    setShowReport(true);
    // In a real app, this would call an AI service
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Generated Report</h3>
              <Button
                variant="outline"
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
                  placeholder="Report will be generated here..."
                  value={`Patient: ${appointment.patientName}
Date: ${appointment.date}
Time: ${appointment.time}

Chief Complaint:
${appointment.notes}

Key Findings:
- Patient reports chronic symptoms
- Recommends follow-up in 2 weeks
- No immediate concerns identified

Assessment:
Patient presents with stable condition, monitoring recommended.

Plan:
1. Continue current medication regimen
2. Schedule follow-up appointment
3. Monitor symptoms`}
                  readOnly
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
