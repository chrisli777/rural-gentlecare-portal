import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserRound, Stethoscope } from "lucide-react";

export const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/50 via-white to-white p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Select Your Role</h1>
          <p className="text-lg text-gray-600">Choose how you would like to access the portal</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Button
            variant="outline"
            className="p-8 h-auto flex flex-col items-center space-y-4 hover:bg-secondary/20 transition-colors"
            onClick={() => navigate("/patient/login")}
          >
            <UserRound className="w-16 h-16 text-primary" />
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold">Patient Portal</h2>
              <p className="text-gray-600">Access your health records, appointments, and care resources</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="p-8 h-auto flex flex-col items-center space-y-4 hover:bg-secondary/20 transition-colors"
            onClick={() => navigate("/provider/login")}
          >
            <Stethoscope className="w-16 h-16 text-primary" />
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold">Provider Portal</h2>
              <p className="text-gray-600">Manage patient care, schedules, and clinical resources</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};