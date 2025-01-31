import { Header } from "@/components/layout/Header";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const PatientMessages = () => {
  const { translate } = useAccessibility();
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{translate("messages.title")}</h1>
        <div className="space-y-4">
          {/* Placeholder for messages - will be implemented with actual data later */}
          <p className="text-gray-600">{translate("messages.noMessages")}</p>
        </div>
      </main>
    </div>
  );
};

export default PatientMessages;