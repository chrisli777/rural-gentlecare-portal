
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConsentGiven: () => void;
  patientId: string;
}

const ConsentDialog = ({ open, onOpenChange, onConsentGiven, patientId }: ConsentDialogProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleConsent = async () => {
    if (!isChecked) {
      toast({
        title: "Consent Required",
        description: "Please check the box to provide your consent before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Record the consent in Supabase
      const { error } = await supabase
        .from('patient_consents')
        .insert([
          { 
            patient_id: patientId, 
            consent_given: true,
            consent_date: new Date().toISOString(),
            consent_type: 'treatment_and_data',
            ip_address: '127.0.0.1', // In a real app, you'd capture the actual IP
            consent_version: '1.0'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Consent Recorded",
        description: "Thank you for providing your consent. You can now proceed to your dashboard.",
      });
      
      onConsentGiven();
    } catch (error) {
      console.error("Error recording consent:", error);
      toast({
        title: "Error Recording Consent",
        description: "There was an error recording your consent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1E5AAB]">Informed Consent for Medical Treatment</DialogTitle>
          <DialogDescription>
            Please read carefully and provide your consent before proceeding.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm space-y-2">
            <h3 className="font-semibold">1. Consent for Treatment</h3>
            <p>
              I voluntarily consent to receive medical and health care services provided by healthcare professionals. 
              I understand that these services may include diagnostic procedures, examinations, and treatments.
            </p>
            
            <h3 className="font-semibold mt-3">2. Telehealth Services</h3>
            <p>
              I understand that some services may be provided via telehealth technologies. I consent to the use of 
              these technologies for my healthcare delivery and understand their benefits, risks, and alternatives.
            </p>
            
            <h3 className="font-semibold mt-3">3. Privacy Practices</h3>
            <p>
              I acknowledge that I have been informed about how my health information may be used and disclosed. 
              I understand that my health information is protected under privacy laws and regulations.
            </p>
            
            <h3 className="font-semibold mt-3">4. Financial Responsibility</h3>
            <p>
              I understand that I am financially responsible for any charges not covered by my insurance and 
              for services provided that are determined to be not medically necessary.
            </p>
            
            <h3 className="font-semibold mt-3">5. Communication</h3>
            <p>
              I consent to receive communications via email, text, or phone related to my healthcare, 
              appointment reminders, and other healthcare-related notifications.
            </p>
            
            <h3 className="font-semibold mt-3">6. Right to Withdraw Consent</h3>
            <p>
              I understand that I have the right to withdraw this consent at any time by providing written notice, 
              though this will not affect actions already taken based on this consent.
            </p>
            
            <h3 className="font-semibold mt-3">7. Data Collection and Use</h3>
            <p>
              I understand that my health data may be collected and used for treatment purposes, quality improvement, 
              and as otherwise permitted or required by law. My data will be stored securely and protected according to 
              applicable privacy laws.
            </p>
            
            <div className="mt-6 pt-4 border-t">
              <p className="font-medium">
                By checking the box below, I confirm that I have read, understood, and agree to the terms outlined 
                in this consent form. I acknowledge that my consent is legally binding and equivalent to a physical signature.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox 
              id="consent" 
              checked={isChecked} 
              onCheckedChange={(checked) => setIsChecked(checked === true)}
              className="data-[state=checked]:bg-[#1E5AAB]"
            />
            <Label htmlFor="consent" className="font-medium">
              I have read and agree to the terms of the informed consent
            </Label>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Decline
          </Button>
          <Button 
            onClick={handleConsent} 
            className="bg-[#1E5AAB] hover:bg-[#1E5AAB]/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "I Consent"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentDialog;
