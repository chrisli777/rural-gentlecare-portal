
import { ImagePlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { ProfileData } from "@/types/conversation";

interface ProfilePhotoUploadProps {
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
}

export const ProfilePhotoUpload = ({
  profileData,
  setProfileData,
  previewUrl,
  setPreviewUrl,
}: ProfilePhotoUploadProps) => {
  const updateProfile = async (data: ProfileData) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));

    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(`${userId}/${file.name}`, file);

      if (error) throw error;

      const photoUrl = data.path;
      await updateProfile({ ...profileData, profile_photo: photoUrl });

      toast({
        title: "Photo uploaded successfully",
        description: "Your profile photo has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading photo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="profile-photo"
      />
      <label
        htmlFor="profile-photo"
        className="cursor-pointer flex flex-col items-center"
      >
        {previewUrl ? (
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <span className="text-sm text-muted-foreground mt-2">
          Upload Photo
        </span>
      </label>
    </div>
  );
};
