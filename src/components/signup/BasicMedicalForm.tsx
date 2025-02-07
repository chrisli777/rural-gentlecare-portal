
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ProfileData } from "@/types/conversation";

interface BasicMedicalFormProps {
  initialData?: Partial<ProfileData>;
  onComplete: () => void;
}

export const BasicMedicalForm = ({ initialData = {}, onComplete }: BasicMedicalFormProps) => {
  const [formData, setFormData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    emergency_contact: '',
    emergency_phone: '',
    allergies: '',
    current_medications: '',
    chronic_conditions: '',
  });

  useEffect(() => {
    // Update form data when initialData changes
    if (Object.keys(initialData).length > 0) {
      console.log("Received initial data:", initialData);
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // Ensure the date is in the correct format for the input
        date_of_birth: initialData.date_of_birth ? new Date(initialData.date_of_birth).toISOString().split('T')[0] : '',
      }));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.data.user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your medical information has been saved successfully.",
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency_contact">Emergency Contact Name</Label>
            <Input
              id="emergency_contact"
              name="emergency_contact"
              value={formData.emergency_contact || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
            <Input
              id="emergency_phone"
              name="emergency_phone"
              type="tel"
              value={formData.emergency_phone || ''}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              name="allergies"
              value={formData.allergies || ''}
              onChange={handleChange}
              placeholder="List any allergies..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_medications">Current Medications</Label>
            <Textarea
              id="current_medications"
              name="current_medications"
              value={formData.current_medications || ''}
              onChange={handleChange}
              placeholder="List any current medications..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chronic_conditions">Chronic Conditions</Label>
            <Textarea
              id="chronic_conditions"
              name="chronic_conditions"
              value={formData.chronic_conditions || ''}
              onChange={handleChange}
              placeholder="List any chronic conditions..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            Complete Profile
          </Button>
        </div>
      </form>
    </Card>
  );
};
