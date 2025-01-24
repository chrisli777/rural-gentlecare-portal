import { Background } from "@/components/home/Background";
import { Button } from "@/components/ui/button";
import { Home, AudioWaveform } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Background />
      {/* Top-left back button */}
      <div className="fixed top-4 left-4 z-50">
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 pt-20">
        {/* Healthcare Section */}
        <section className="mb-12 text-left">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-primary">Our Healthcare Services</h2>
            <AudioWaveform className="w-5 h-5 text-primary cursor-pointer" />
          </div>
          <div className="flex items-start gap-2">
            <p className="text-gray-700 leading-relaxed">
              Adams Rural Care specializes in providing comprehensive healthcare services 
              tailored to our rural community's needs. With a focus on geriatric care, 
              we offer personalized medical attention, preventive care, and chronic disease 
              management to ensure the well-being of our elderly population.
            </p>
            <AudioWaveform className="w-5 h-5 text-primary cursor-pointer mt-1 flex-shrink-0" />
          </div>
        </section>

        {/* Commitments Section */}
        <section className="mb-12 text-left">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-primary">Our Commitments</h2>
            <AudioWaveform className="w-5 h-5 text-primary cursor-pointer" />
          </div>
          <div className="space-y-4">
            {[
              "Providing accessible healthcare to all residents of Adams County",
              "Maintaining the highest standards of medical care and patient safety",
              "Supporting our elderly community with specialized geriatric services",
              "Fostering a compassionate and welcoming environment",
              "Continuous improvement of our healthcare services"
            ].map((commitment, index) => (
              <div key={index} className="flex items-start gap-2">
                <p className="text-gray-700">{commitment}</p>
                <AudioWaveform className="w-5 h-5 text-primary cursor-pointer mt-1 flex-shrink-0" />
              </div>
            ))}
          </div>
        </section>

        {/* Original back button position */}
        <Link to="/">
          <Button variant="outline" className="mb-6 flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AboutUs;