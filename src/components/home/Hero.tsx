import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, AudioWaveform, Bell, Heart, Activity, Pill, User } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export const Hero = () => {
  const { speak } = useAccessibility();

  return (
    <section className="pt-24 pb-24 px-4 min-h-screen flex items-center bg-gradient-to-b from-secondary/50 via-white to-white overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-primary/10"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-32 top-1/2 w-80 h-80 rounded-full bg-accent/20"
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight animate-fade-in relative pr-8"
          >
            Virtual Rural Healthcare
            <AudioWaveform 
              className="absolute -right-2 top-1/2 -translate-y-1/2 h-6 w-6 cursor-pointer hover:text-primary/80" 
              onClick={() => speak("Virtual Rural Healthcare")}
            />
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in relative pr-8"
          >
            Providing comprehensive healthcare services tailored to the unique needs of our elderly community members, right here in Adams County.
            <AudioWaveform 
              className="absolute -right-2 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer hover:text-primary/80" 
              onClick={() => speak("Providing comprehensive healthcare services tailored to the unique needs of our elderly community members, right here in Adams County.")}
            />
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <Link to="/patient/profile">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto text-xl py-6 px-8 flex items-center gap-2"
                >
                  <User className="w-6 h-6" />
                  My Profile
                </Button>
              </Link>
              <AudioWaveform 
                className="h-5 w-5 cursor-pointer hover:text-primary/80" 
                onClick={() => speak("My Profile")}
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mt-24">
            {[
              {
                icon: MessageSquare,
                title: "AI Chatbot",
                description: "Get instant answers to your healthcare questions 24/7",
                color: "bg-blue-50",
                iconColor: "text-blue-500"
              },
              {
                icon: Bell,
                title: "Medication Alerts",
                description: "Never miss your medication with timely reminders",
                color: "bg-purple-50",
                iconColor: "text-purple-500"
              },
              {
                icon: BookOpen,
                title: "Health Resources",
                description: "Access educational materials about geriatric care",
                color: "bg-green-50",
                iconColor: "text-green-500"
              },
              {
                icon: Activity,
                title: "Health Monitoring",
                description: "Track your vital signs and health progress",
                color: "bg-orange-50",
                iconColor: "text-orange-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className={`relative p-6 ${feature.color} backdrop-blur-sm rounded-lg border border-gray-200 hover:border-primary/20 transition-all duration-200 group`}
              >
                <feature.icon className={`w-12 h-12 ${feature.iconColor} mb-4`} />
                <AudioWaveform 
                  className="absolute top-4 right-4 h-5 w-5 cursor-pointer hover:text-primary/80" 
                  onClick={() => speak(`${feature.title}. ${feature.description}`)}
                />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex justify-center items-center">
        <motion.div 
          className="relative w-full max-w-2xl h-16 opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,32 Q80,64 160,32 T320,32 T480,32 T640,32' stroke='%234A90E2' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat-x',
            }}
          >
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 flex items-center gap-8"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Heart className="w-6 h-6 text-red-400" />
              <Activity className="w-6 h-6 text-primary" />
              <Pill className="w-6 h-6 text-accent" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};