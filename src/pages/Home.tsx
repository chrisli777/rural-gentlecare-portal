
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HandHeart, Volume2, Stethoscope, Leaf } from "lucide-react";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  const welcomeText = "Welcome to the Virtual Clinic of Adams County, Washington. We're here to help you book doctor appointments and fill out forms—easily and stress-free. Take your time, and let us guide you through every step. Whenever you're ready, we're here for you.";

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(welcomeText);
      speech.rate = 0.85; // Even slower rate for better comprehension
      speech.pitch = 1.1; // Slightly higher pitch for a feminine voice
      speech.volume = 1;
      
      // Try to select a female voice if available
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('female') || voice.name.includes('woman')
      );
      if (femaleVoice) speech.voice = femaleVoice;
      
      speech.onstart = () => setIsPlaying(true);
      speech.onend = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(speech);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 via-white to-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating Clouds */}
        <div className="absolute top-20 left-10 w-24 h-12 bg-white/40 rounded-full blur-xl animate-float-slow" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-32 h-16 bg-white/30 rounded-full blur-xl animate-float-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/4 w-28 h-14 bg-white/20 rounded-full blur-xl animate-float-slow" style={{ animationDelay: '1s' }} />
        
        {/* Floating Leaves */}
        <div className="absolute top-1/4 right-8 animate-float-leaf">
          <Leaf className="w-6 h-6 text-accent/40" />
        </div>
        <div className="absolute bottom-1/4 left-12 animate-float-leaf" style={{ animationDelay: '2s' }}>
          <Leaf className="w-5 h-5 text-accent/30" />
        </div>
        
        {/* Healthcare Icons */}
        <div className="absolute top-32 left-6 animate-float">
          <Stethoscope className="w-8 h-8 text-primary/30" />
        </div>
        <div className="absolute bottom-24 right-8 animate-float" style={{ animationDelay: '1.5s' }}>
          <HandHeart className="w-8 h-8 text-primary/30" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-6 mb-12 animate-fade-in">
            <div className="relative">
              <HandHeart className="w-16 h-16 text-primary mx-auto animate-float hover:scale-110 transition-transform duration-300" />
              <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl -z-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Welcome to the Virtual Clinic of Adams County
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We're here to help you book appointments and fill out forms—easily and stress-free.
            </p>
          </div>

          {/* Main Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-12">
            <img
              src="https://datausa.io/api/profile/geo/adams-county-wa/splash"
              alt="Adams County, Washington landscape"
              className="w-full h-[400px] md:h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Accessibility Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="outline"
              size="lg"
              onClick={handleReadAloud}
              className="flex items-center gap-2 hover:bg-secondary/50 transition-colors duration-300 text-lg px-6 py-3"
            >
              <Volume2 className={`h-6 w-6 ${isPlaying ? 'animate-pulse' : ''}`} />
              Read Aloud
            </Button>
          </div>

          {/* Call to Action */}
          <div className="space-y-6">
            <Button
              size="lg"
              className="text-xl px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
                         bg-gradient-to-r from-primary to-primary/90 hover:scale-105
                         border-2 border-white/50"
              onClick={() => navigate("/patient/login")}
            >
              Get Started
            </Button>
            <p className="text-gray-600 text-lg">
              Take your time, we're here to guide you through every step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
