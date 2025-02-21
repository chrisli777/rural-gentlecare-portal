import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HandHeart, Stethoscope, Leaf, CalendarCheck, Bot, Video, Headphones, HelpCircle, Globe, ALargeSmall, UserCog } from "lucide-react";
import { useState } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const Home = () => {
  const navigate = useNavigate();
  const [showFeatures, setShowFeatures] = useState(false);
  const { language, setLanguage, translate, fontSize, setFontSize } = useAccessibility();

  const handleGetStarted = () => {
    navigate("/patient/dashboard");
  };

  const handleLanguageChange = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const handleFontSizeChange = () => {
    setFontSize(fontSize === 'normal' ? 'large' : 'normal');
  };

  const features = [
    {
      icon: <CalendarCheck className="w-6 h-6 text-[#1E5AAB]" />,
      title: translate('common.features.appointments.title'),
      description: translate('common.features.appointments.description')
    },
    {
      icon: <Bot className="w-6 h-6 text-[#1E5AAB]" />,
      title: translate('common.features.aiAssistant.title'),
      description: translate('common.features.aiAssistant.description')
    },
    {
      icon: <Video className="w-6 h-6 text-[#1E5AAB]" />,
      title: translate('common.features.virtualConsultations.title'),
      description: translate('common.features.virtualConsultations.description')
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#1E5AAB]" />,
      title: translate('common.features.voiceAssistant.title'),
      description: translate('common.features.voiceAssistant.description')
    }
  ];

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

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating Clouds */}
        <div className="absolute top-20 left-10 w-24 h-12 bg-white/40 rounded-full blur-xl animate-float-slow" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-32 h-16 bg-white/30 rounded-full blur-xl animate-float-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/4 w-28 h-14 bg-white/20 rounded-full blur-xl animate-float-slow" style={{ animationDelay: '1s' }} />
        
        {/* Floating Leaves */}
        <div className="absolute top-1/4 right-8 animate-float-leaf">
          <Leaf className="w-6 h-6 text-accent/40" />
        </div>
        <div className="absolute bottom-1/4 left-12 animate-float-leaf" style={{ animationDelay: '2s' }}>
          <Leaf className="w-5 h-5 text-accent/30" />
        </div>
        
        {/* Healthcare Icons */}
        <div className="absolute top-32 left-6 animate-float">
          <Stethoscope className="w-8 h-8 text-primary/30" />
        </div>
        <div className="absolute bottom-24 right-8 animate-float" style={{ animationDelay: '1.5s' }}>
          <HandHeart className="w-8 h-8 text-primary/30" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
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
            
            {/* Action Buttons */}
            <div className="flex flex-col items-center gap-8">
              <Button
                size="lg"
                className="text-xl px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
                           bg-[#1E5AAB] hover:bg-[#1E5AAB]/90
                           border-2 border-[#1E5AAB]"
                onClick={handleGetStarted}
              >
                {translate('common.getStarted')}
              </Button>

              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowFeatures(true)}
                  className="flex items-center gap-2 bg-[#1E5AAB]/20 hover:bg-[#1E5AAB]/30 transition-colors duration-300 
                            text-lg px-6 py-3 text-white border-[#1E5AAB]/50"
                >
                  <HelpCircle className="h-6 w-6" />
                  {translate('common.learnMore')}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLanguageChange}
                  className="flex items-center gap-2 bg-[#1E5AAB]/20 hover:bg-[#1E5AAB]/30 transition-colors duration-300 
                            text-lg px-6 py-3 text-white border-[#1E5AAB]/50"
                >
                  <Globe className="h-6 w-6" />
                  {language === 'en' ? 'Español' : 'English'}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleFontSizeChange}
                  className="flex items-center gap-2 bg-[#1E5AAB]/20 hover:bg-[#1E5AAB]/30 transition-colors duration-300 
                            text-lg px-6 py-3 text-white border-[#1E5AAB]/50"
                >
                  <ALargeSmall className="h-6 w-6" />
                  {fontSize === 'normal' ? 'Larger Text' : 'Normal Text'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Dialog */}
      <Dialog open={showFeatures} onOpenChange={setShowFeatures}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-2 text-[#1E5AAB]">
              {translate('common.welcomeDialog')}
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              {translate('common.dialogDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-4 space-y-3 rounded-lg border bg-card hover:bg-[#1E5AAB]/5 transition-colors duration-300"
              >
                <div className="p-3 rounded-full bg-[#1E5AAB]/10">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg text-[#1E5AAB]">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={() => {
                setShowFeatures(false);
                navigate("/patient/dashboard");
              }}
              className="w-full sm:w-auto bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white"
            >
              {translate('common.continueToDashboard')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
