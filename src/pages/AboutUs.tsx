import { Background } from "@/components/home/Background";
import { Button } from "@/components/ui/button";
import { AudioWaveform, Home } from "lucide-react";
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
        {/* AI Healthcare Section */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-primary">AI Healthcare Solutions</h2>
            <AudioWaveform className="w-5 h-5 text-primary cursor-pointer" />
          </div>
          <p className="text-gray-700 mb-4">
            Our clinic leverages cutting-edge AI technology to enhance patient care and support our healthcare providers. From intelligent diagnostics to personalized treatment recommendations, we're bringing the future of healthcare to Adams County.
          </p>
        </div>

        {/* Our Commitments Section */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-primary">Our Commitments</h2>
            <AudioWaveform className="w-5 h-5 text-primary cursor-pointer" />
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Providing accessible healthcare to all residents of Adams County</li>
            <li>Maintaining the highest standards of patient care and safety</li>
            <li>Continuous improvement of our services through technology adoption</li>
            <li>Supporting our rural community's unique healthcare needs</li>
            <li>Ensuring affordable and transparent healthcare services</li>
          </ul>
        </div>

        {/* Healthcare Providers Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-semibold">For Healthcare Providers</h3>
              <AudioWaveform className="w-5 h-5 text-primary cursor-pointer" />
            </div>
            <p className="text-gray-700">
              Access our comprehensive suite of tools designed to streamline your practice. From patient management to AI-assisted diagnostics, we provide everything you need to deliver exceptional care.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-semibold">For Patients</h3>
              <AudioWaveform className="w-5 h-5 text-primary cursor-pointer" />
            </div>
            <p className="text-gray-700">
              Experience healthcare that puts you first. Our patient portal gives you easy access to your health records, appointment scheduling, and educational resources tailored to your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;