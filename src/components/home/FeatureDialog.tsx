
import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { CalendarCheck, Bot, Video, Headphones } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface FeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue?: () => void;
}

export const FeatureDialog = ({ open, onOpenChange, onContinue }: FeatureDialogProps) => {
  const { translate } = useAccessibility();

  const handleContinue = () => {
    onOpenChange(false);
    if (onContinue) {
      onContinue();
    }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={handleContinue}
            className="w-full sm:w-auto bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white"
          >
            {translate('common.continueToDashboard')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
