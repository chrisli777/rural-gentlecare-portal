
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Send } from "lucide-react";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
}

export const ReportDialog = ({ open, onOpenChange, patientName }: ReportDialogProps) => {
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [recommendations, setRecommendations] = useState("");

  const handleSubmit = () => {
    // Here you would typically save the report
    console.log("Saving report:", { diagnosis, prescription, recommendations });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Medical Report - {patientName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Diagnosis</label>
            <Textarea
              placeholder="Enter diagnosis..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Prescription</label>
            <Textarea
              placeholder="Enter prescription details..."
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Recommendations</label>
            <Textarea
              placeholder="Enter recommendations..."
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="h-4 w-4" />
              Submit Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
