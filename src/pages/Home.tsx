
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HandHeart, UserCog, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { FeatureDialog } from "@/components/home/FeatureDialog";
import { BackgroundElements } from "@/components/home/BackgroundElements";
import { AccessibilityControls } from "@/components/home/AccessibilityControls";

const Home = () => {
  const navigate = useNavigate();
  const [showFeatures, setShowFeatures] = useState(false);
  const { translate, language } = useAccessibility();

  const handleGetStarted = () => {
    // Instead of navigating directly, show the features dialog
    setShowFeatures(true);
  };

  const handleContinueToDashboard = () => {
    // Navigate to the dashboard after closing the dialog
    navigate("/patient/dashboard");
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("https://datausa.io/api/profile/geo/adams-county-wa/splash")',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Provider Portal Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          onClick={() => navigate("/provider/login")}
          variant="outline"
          className="flex items-center gap-2 bg-white/90 hover:bg-white"
        >
          <UserCog className="h-4 w-4" />
          Provider Portal
        </Button>
      </div>

      <BackgroundElements />

      <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-12 mb-12 animate-fade-in flex flex-col justify-center min-h-[50vh]">
            <div className="relative">
              <HandHeart className="w-16 h-16 text-white mx-auto animate-float hover:scale-110 transition-transform duration-300" />
              <div className="absolute -inset-4 bg-[#1E5AAB]/5 rounded-full blur-xl -z-10" />
            </div>
            <div className="space-y-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                {translate('common.welcome')}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                {translate('common.subtitle')}
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-8">
              <Button
                size="lg"
                className="text-xl px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
                         bg-[#1E5AAB] hover:bg-[#1E5AAB]/90
                         border-2 border-[#1E5AAB]"
                onClick={handleGetStarted}
              >
                {language === 'en' ? 'Get Healthcare Support' : 'Obtener Asistencia Médica'}
              </Button>

              <div className="flex justify-center items-center gap-4">
                <AccessibilityControls />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeatureDialog 
        open={showFeatures} 
        onOpenChange={setShowFeatures} 
        onContinue={handleContinueToDashboard}
      />
    </div>
  );
};

export default Home;
