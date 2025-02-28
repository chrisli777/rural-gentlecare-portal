
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/upload/ImageUploader";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const ImageManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imageUrls, setImageUrls] = useState<string[]>(['', '', '']);
  
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Load the images from storage
        for (let i = 1; i <= 3; i++) {
          const { data } = supabase.storage
            .from('profile-images')
            .getPublicUrl(`image${i}.jpeg`);
          
          if (data?.publicUrl) {
            setImageUrls(prev => {
              const updated = [...prev];
              updated[i-1] = data.publicUrl;
              return updated;
            });
          }
        }
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };
    
    loadImages();
  }, []);
  
  const handleImageUploaded = (index: number, url: string) => {
    setImageUrls(prev => {
      const updated = [...prev];
      updated[index] = url;
      return updated;
    });
  };
  
  const handleSave = () => {
    // Save the URLs to local storage for easy access
    localStorage.setItem('navigationCardImages', JSON.stringify(imageUrls));
    
    toast({
      title: "Images saved",
      description: "Your navigation images have been updated successfully.",
    });
    
    // Navigate back to dashboard
    navigate('/patient/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-10">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Manage Navigation Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-500">
              Upload images for your navigation cards. Each image will be used for a specific section.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Appointments Image</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  {imageUrls[0] ? (
                    <div className="aspect-video w-full overflow-hidden rounded border">
                      <img 
                        src={imageUrls[0]} 
                        alt="Appointments Card" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-gray-400 text-sm">No image selected</p>
                    </div>
                  )}
                  <ImageUploader 
                    imageNumber={1} 
                    onSuccess={(url) => handleImageUploaded(0, url)}
                    label="Upload Appointments Image"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Medical Records Image</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  {imageUrls[1] ? (
                    <div className="aspect-video w-full overflow-hidden rounded border">
                      <img 
                        src={imageUrls[1]} 
                        alt="Medical Records Card" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-gray-400 text-sm">No image selected</p>
                    </div>
                  )}
                  <ImageUploader 
                    imageNumber={2} 
                    onSuccess={(url) => handleImageUploaded(1, url)}
                    label="Upload Medical Records Image"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Profile Image</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  {imageUrls[2] ? (
                    <div className="aspect-video w-full overflow-hidden rounded border">
                      <img 
                        src={imageUrls[2]} 
                        alt="Profile Card" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-gray-400 text-sm">No image selected</p>
                    </div>
                  )}
                  <ImageUploader 
                    imageNumber={3} 
                    onSuccess={(url) => handleImageUploaded(2, url)}
                    label="Upload Profile Image"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={() => navigate('/patient/dashboard')}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Images
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ImageManager;
