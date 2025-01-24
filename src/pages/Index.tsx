import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 via-white to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">Adams Rural Care</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 flex items-center justify-center min-h-screen px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
              Welcome to Rural Healthcare Portal
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Please select your role to continue
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <h2 className="text-2xl font-semibold mb-4 text-primary">Patient Portal</h2>
                <p className="text-gray-600 mb-6">
                  Access your health records, appointments, and medical resources
                </p>
                <Button 
                  onClick={() => navigate("/patient/login")} 
                  className="w-full text-lg py-6"
                >
                  Enter as Patient
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <h2 className="text-2xl font-semibold mb-4 text-primary">Provider Portal</h2>
                <p className="text-gray-600 mb-6">
                  Access patient records, schedules, and clinical tools
                </p>
                <Button 
                  onClick={() => navigate("/provider/login")} 
                  className="w-full text-lg py-6"
                >
                  Enter as Provider
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;