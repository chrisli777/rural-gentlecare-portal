
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
      speech.rate = 0.9; // Slightly slower rate for better comprehension
      speech.pitch = 1;
      speech.volume = 1;
      
      speech.onstart = () => setIsPlaying(true);
      speech.onend = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(speech);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-6 mb-12">
            <HandHeart className="w-16 h-16 text-primary mx-auto animate-float" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Welcome! Looking for a simpler way to book appointments?
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your health matters, and we're here to listen.
            </p>
          </div>

          {/* Main Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-12">
            <img
              src="https://datausa.io/api/profile/geo/adams-county-wa/splash"
              alt="Adams County, Washington landscape"
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Accessibility Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="outline"
              size="lg"
              onClick={handleReadAloud}
              className="flex items-center gap-2"
            >
              <Volume2 className={`h-5 w-5 ${isPlaying ? 'animate-pulse' : ''}`} />
              Read Aloud
            </Button>
          </div>

          {/* Call to Action */}
          <div className="space-y-6">
            <Button
              size="lg"
              className="text-xl px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate("/patient/login")}
            >
              Get Started
            </Button>
            <p className="text-gray-600 text-lg">
              Click above, and we're here to support you every step of the way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
