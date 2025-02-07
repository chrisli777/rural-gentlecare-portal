
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface FileUploadStepProps {
  onUploadComplete: (data: any) => void;
  onSkip: () => void;
}

export const FileUploadStep = ({ onUploadComplete, onSkip }: FileUploadStepProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.data.user.id}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('medical-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create processed document record
      const { error: dbError } = await supabase
        .from('processed_documents')
        .insert({
          user_id: user.data.user.id,
          file_path: filePath,
          processed_data: {} // This would be populated by a backend process
        });

      if (dbError) throw dbError;

      toast({
        title: "File uploaded successfully",
        description: "Your medical document has been uploaded and is being processed.",
      });

      // For now, we'll just move to the next step
      // In a real implementation, we'd wait for the document to be processed
      onUploadComplete({});
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Upload Medical Documents</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your existing medical records to automatically fill out your profile
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium">
              {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
            </span>
            <span className="text-xs text-muted-foreground">
              PDF, DOC, DOCX, JPG, JPEG, PNG (max. 10MB)
            </span>
          </label>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={onSkip}
            disabled={isUploading}
          >
            Skip
          </Button>
        </div>
      </div>
    </Card>
  );
};
