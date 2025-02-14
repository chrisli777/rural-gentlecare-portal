
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HandHeart, Volume2 } from "lucide-react";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  const welcomeText = "Welcome! Looking for a simpler way to book appointments? Your health matters, and we're here to listen. For further assistance, just click get started below.";

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(welcomeText);
      speech.rate = 0.9;
      speech.pitch = 1;
      speech.volume = 1;
      
      speech.onstart = () => setIsPlaying(true);
      speech.onend = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(speech);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 via-white to-background">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-6 mb-12 animate-fade-in">
            <div className="relative">
              <HandHeart className="w-16 h-16 text-primary mx-auto animate-float hover:scale-110 transition-transform duration-300" />
              <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl -z-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight transition-colors hover:text-primary/90 cursor-default">
              Welcome! Looking for a simpler way to book appointments?
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Your health matters, and we're here to listen.
            </p>
          </div>

          {/* Main Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-12 transform hover:scale-[1.02] transition-all duration-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <img
              src="https://datausa.io/api/profile/geo/adams-county-wa/splash"
              alt="Adams County, Washington landscape"
              className="w-full h-[400px] md:h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Accessibility Controls */}
          <div className="flex justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button
              variant="outline"
              size="lg"
              onClick={handleReadAloud}
              className="flex items-center gap-2 hover:bg-secondary/50 transition-colors duration-300 text-lg"
            >
              <Volume2 className={`h-6 w-6 ${isPlaying ? 'animate-pulse' : ''}`} />
              Read Aloud
            </Button>
          </div>

          {/* Call to Action */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Button
              size="lg"
              className="text-xl px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
                         bg-gradient-to-r from-primary to-primary/90 hover:scale-105
                         border-2 border-white/50"
              onClick={() => navigate("/patient/login")}
            >
              Get Started
            </Button>
            <p className="text-gray-600 text-lg animate-fade-in" style={{ animationDelay: '1s' }}>
              Click above, and we're here to support you every step of the way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
