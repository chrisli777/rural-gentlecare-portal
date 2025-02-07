
import { useState, useEffect } from "react";
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
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please ensure you are logged in before uploading documents.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('medical-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create processed document record
      const { error: dbError } = await supabase
        .from('processed_documents')
        .insert({
          user_id: session.user.id,
          file_path: filePath,
          processed_data: {} // This will be populated by the processing function
        });

      if (dbError) throw dbError;

      // Process the document with AI
      const { data: processedData, error: processError } = await supabase.functions
        .invoke('process-medical-document', {
          body: { filePath }
        });

      if (processError) throw processError;

      if (!processedData?.data) {
        throw new Error('No data extracted from document');
      }

      // Update processed_documents record with extracted data
      const { error: updateError } = await supabase
        .from('processed_documents')
        .update({ processed_data: processedData.data })
        .eq('file_path', filePath);

      if (updateError) throw updateError;

      toast({
        title: "Document processed successfully",
        description: "Your medical information has been extracted.",
      });

      onUploadComplete(processedData.data);
    } catch (error: any) {
      console.error('Error processing document:', error);
      toast({
        title: "Processing failed",
        description: error.message,
        variant: "destructive",
      });
      onSkip(); // Fall back to manual form
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
              {isUploading ? "Processing..." : "Click to upload or drag and drop"}
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
