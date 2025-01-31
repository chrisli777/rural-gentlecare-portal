import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export const Hero = () => {
  const { translate } = useAccessibility();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-gray-50 pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {translate("common.welcome")}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {translate("common.providingCare")}
          </p>
          <div className="space-x-4">
            <Button variant="default" size="lg">
              {translate("common.learnMore")}
            </Button>
            <Button variant="outline" size="lg">
              {translate("common.contactUs")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};