
import { Button } from "@/components/ui/button";
import { Globe, ALargeSmall } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export const AccessibilityControls = () => {
  const { language, setLanguage, fontSize, setFontSize } = useAccessibility();

  const handleLanguageChange = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const handleFontSizeChange = () => {
    setFontSize(fontSize === 'normal' ? 'large' : 'normal');
  };

  return (
    <div className="flex justify-center items-center gap-4">
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
  );
};
