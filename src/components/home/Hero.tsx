import { Button } from "@/components/ui/button";
import { Calendar, Video, BookOpen, MessageSquare, Speaker } from "lucide-react";

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
              <Speaker 
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
            <Speaker 
              className="h-8 w-8 cursor-pointer hover:text-primary/80" 
              onClick={() => speakText("Virtual Rural Healthcare")}
            />
          </h1>
          
          <p 
            className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in flex items-center justify-center gap-2"
            style={{ animationDelay: '0.6s' }}
          >
            Providing comprehensive healthcare services tailored to the unique needs of our elderly community members, right here in Adams County.
            <Speaker 
              className="h-5 w-5 cursor-pointer hover:text-primary/80 flex-shrink-0" 
              onClick={() => speakText("Providing comprehensive healthcare services tailored to the unique needs of our elderly community members, right here in Adams County.")}
            />
          </p>

          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: '0.8s' }}
          >
            <Button size="lg" className="w-full sm:w-auto hover:scale-105 transition-transform">
              Schedule Appointment
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto hover:scale-105 transition-transform">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            <div
              className="p-6 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:border-primary/20 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: '1s' }}
            >
              <MessageSquare className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                AI Chatbot
                <Speaker 
                  className="h-4 w-4 cursor-pointer hover:text-primary/80" 
                  onClick={() => speakText("AI Chatbot")}
                />
              </h3>
              <p className="text-gray-600 flex items-center gap-2">
                Get instant answers to your healthcare questions 24/7
                <Speaker 
                  className="h-4 w-4 cursor-pointer hover:text-primary/80" 
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
                icon: Video,
                title: "Telehealth Services",
                description: "Connect with doctors from the comfort of home",
                delay: "1.4s"
              },
              {
                icon: BookOpen,
                title: "Health Resources",
                description: "Access educational materials about geriatric care",
                delay: "1.6s"
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:border-primary/20 transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: feature.delay }}
              >
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                  {feature.title}
                  <Speaker 
                    className="h-4 w-4 cursor-pointer hover:text-primary/80" 
                    onClick={() => speakText(feature.title)}
                  />
                </h3>
                <p className="text-gray-600 flex items-center gap-2">
                  {feature.description}
                  <Speaker 
                    className="h-4 w-4 cursor-pointer hover:text-primary/80" 
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