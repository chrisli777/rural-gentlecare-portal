
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ProviderLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Accept any non-empty input
    if (email.trim() && password.trim()) {
      toast({
        title: "Demo Login Successful",
        description: "Redirecting to provider dashboard...",
        duration: 2000,
      });
      
      // Short delay to show the toast before navigation
      setTimeout(() => {
        navigate("/provider/dashboard");
      }, 500);
    } else {
      toast({
        title: "Please fill in all fields",
        description: "Both email and password are required",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-[#9b87f5]" />
          </div>
          <CardTitle className="text-3xl font-bold">Provider Login</CardTitle>
          <p className="text-gray-600">Sign in to access the provider portal</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@adamsruralcare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#1E5AAB] hover:bg-[#1E5AAB]/90">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderLogin;
