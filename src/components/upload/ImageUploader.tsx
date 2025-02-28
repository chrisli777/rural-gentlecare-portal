
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Upload, ImagePlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  onSuccess: (url: string) => void;
  imageNumber: number;
  label?: string;
}

export const ImageUploader = ({ onSuccess, imageNumber, label = "Upload Image" }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('imageNumber', imageNumber.toString());
      
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/upload-image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${supabase.supabaseKey}`
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload image');
      }
      
      // Call the onSuccess callback with the public URL
      onSuccess(result.publicUrl);
      
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded successfully.",
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-2">
      <label htmlFor={`file-upload-${imageNumber}`} className="cursor-pointer">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-gray-100 p-4 rounded-full">
            <ImagePlus className="h-6 w-6 text-gray-500" />
          </div>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <input
          id={`file-upload-${imageNumber}`}
          type="file"
          className="sr-only"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
      {isUploading && (
        <div className="w-full mt-2">
          <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
            <div className="h-full bg-blue-500 animate-pulse" style={{ width: '100%' }}></div>
          </div>
          <p className="text-xs text-center mt-1 text-gray-500">Uploading...</p>
        </div>
      )}
    </div>
  );
};
