import { Background } from "@/components/home/Background";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Background />
      <div className="container mx-auto px-4 pt-20">
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