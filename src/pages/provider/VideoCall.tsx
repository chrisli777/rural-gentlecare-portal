
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Phone, FileText } from "lucide-react";
import { useState } from "react";
import { ReportDialog } from "@/components/provider/ReportDialog";

const VideoCall = () => {
  const navigate = useNavigate();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  
  const handleEndCall = () => {
    navigate("/provider/total-appointments");
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12 relative h-screen">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Main video feed */}
          <div className="w-full max-w-4xl aspect-video bg-gray-800 rounded-lg relative">
            {/* Patient video placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400 text-lg">Patient Video Feed</p>
            </div>
            
            {/* Doctor video placeholder (small overlay) */}
            <div className="absolute bottom-4 right-4 w-48 aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-sm">Your Video</p>
            </div>

            {/* Controls overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              <Button 
                variant="destructive"
                size="lg"
                className="rounded-full w-12 h-12 p-0"
                onClick={handleEndCall}
              >
                <Phone className="h-6 w-6 rotate-225" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full w-12 h-12 p-0"
                onClick={() => setIsReportDialogOpen(true)}
              >
                <FileText className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        patientName="Sarah Johnson"
      />
    </div>
  );
};

export default VideoCall;
