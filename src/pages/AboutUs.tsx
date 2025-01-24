import { Background } from "@/components/home/Background";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Background />
      {/* Top-left back button */}
      <div className="fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default AboutUs;