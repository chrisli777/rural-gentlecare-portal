
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { HandHeart, Mic, Volume2 } from "lucide-react";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const { isListening, startListening, stopListening, translate } = useAccessibility();
  const [isPlaying, setIsPlaying] = useState(false);

  const welcomeText = "Welcome to Adams Rural Care. We're here to help you get the care you need, when you need it. Click below to get started, or use the microphone to navigate by voice.";

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
              We're here to help.<br />
              You deserve care that listens to you.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Take the first step towards personalized care. We'll guide you through everything, one step at a time.
            </p>
          </div>

          {/* Main Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-12">
            <img
              src="/rural-landscape.jpg"
              alt="Peaceful view of Adams County countryside"
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
            <Button
              variant="outline"
              size="lg"
              onClick={isListening ? stopListening : startListening}
              className={`flex items-center gap-2 ${isListening ? 'bg-primary text-white' : ''}`}
            >
              <Mic className="h-5 w-5" />
              {isListening ? 'Listening...' : 'Voice Commands'}
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
              Click above, and we'll guide you through everything step by step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
