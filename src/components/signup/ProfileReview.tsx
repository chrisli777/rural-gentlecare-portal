
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ProfileData } from "@/types/conversation";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileReviewProps {
  initialData: ProfileData;
  userId: string;
  onComplete: () => void;
}

export const ProfileReview = ({ initialData, userId, onComplete }: ProfileReviewProps) => {
  const [profileData, setProfileData] = useState<ProfileData>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });
      
      onComplete();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Review Your Information</h2>
        <p className="text-muted-foreground">Please review and edit your information if needed</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              value={profileData.first_name || ''}
              onChange={(e) => handleChange('first_name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              value={profileData.last_name || ''}
              onChange={(e) => handleChange('last_name', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            value={profileData.date_of_birth || ''}
            onChange={(e) => handleChange('date_of_birth', e.target.value)}
            placeholder="YYYY-MM-DD"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergency_contact">Emergency Contact</Label>
            <Input
              id="emergency_contact"
              value={profileData.emergency_contact || ''}
              onChange={(e) => handleChange('emergency_contact', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency_phone">Emergency Phone</Label>
            <Input
              id="emergency_phone"
              value={profileData.emergency_phone || ''}
              onChange={(e) => handleChange('emergency_phone', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea
            id="allergies"
            value={profileData.allergies || ''}
            onChange={(e) => handleChange('allergies', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current_medications">Current Medications</Label>
          <Textarea
            id="current_medications"
            value={profileData.current_medications || ''}
            onChange={(e) => handleChange('current_medications', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chronic_conditions">Chronic Conditions</Label>
          <Textarea
            id="chronic_conditions"
            value={profileData.chronic_conditions || ''}
            onChange={(e) => handleChange('chronic_conditions', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Confirm & Continue"}
        </Button>
      </div>
    </Card>
  );
};
