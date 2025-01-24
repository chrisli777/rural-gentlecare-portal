import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, MessageSquare, AudioWaveform, PhoneCall } from "lucide-react";

export const Hero = () => {
  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="pt-24 pb-16 px-4 min-h-screen flex items-center bg-gradient-to-b from-secondary/50 via-white to-white overflow-hidden">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div 
            className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="text-sm font-medium flex items-center gap-2">
              Serving Adams County Since 1985
              <AudioWaveform 
                className="h-4 w-4 cursor-pointer hover:text-primary/80" 
                onClick={() => speakText("Serving Adams County Since 1985")}
              />
            </span>
          </div>
          
          <h1 
            className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight animate-fade-in flex items-center justify-center gap-3"
            style={{ animationDelay: '0.4s' }}
          >
            Virtual Rural Healthcare
            <AudioWaveform 
              className="h-8 w-8 cursor-pointer hover:text-primary/80" 
              onClick={() => speakText("Virtual Rural Healthcare")}
            />
          </h1>
          
          <p 
            className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in flex items-center justify-center gap-2"
            style={{ animationDelay: '0.6s' }}
          >
            Providing comprehensive healthcare services tailored to the unique needs of our elderly community members, right here in Adams County.
            <AudioWaveform 
              className="h-5 w-5 cursor-pointer hover:text-primary/80 flex-shrink-0" 
              onClick={() => speakText("Providing comprehensive healthcare services tailored to the unique needs of our elderly community members, right here in Adams County.")}
            />
          </p>

          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: '0.8s' }}
          >
            <Button 
              size="lg" 
              variant="destructive"
              className="w-full sm:w-auto hover:scale-105 transition-transform text-xl py-6 px-8 flex items-center gap-2"
            >
              <PhoneCall className="w-6 h-6" />
              Emergency Call
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto hover:scale-105 transition-transform">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-16">
            <div
              className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:border-primary/20 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: '1s' }}
            >
              <MessageSquare className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Chatbot</h3>
              <p className="text-gray-600">
                Get instant answers to your healthcare questions 24/7
                <AudioWaveform 
                  className="inline-block ml-2 h-6 w-6 cursor-pointer hover:text-primary/80" 
                  onClick={() => speakText("Get instant answers to your healthcare questions 24/7")}
                />
              </p>
            </div>
            {[
              {
                icon: Calendar,
                title: "Easy Scheduling",
                description: "Book appointments online with our caring providers",
                delay: "1.2s"
              },
              {
                icon: BookOpen,
                title: "Health Resources",
                description: "Access educational materials about geriatric care",
                delay: "1.4s"
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:border-primary/20 transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: feature.delay }}
              >
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                  <AudioWaveform 
                    className="inline-block ml-2 h-6 w-6 cursor-pointer hover:text-primary/80" 
                    onClick={() => speakText(feature.description)}
                  />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};