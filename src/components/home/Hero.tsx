
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-gray-50 pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to Adams Rural Care
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Providing quality healthcare services to our rural community
          </p>
          <div className="space-x-4">
            <Button variant="default" size="lg">
              Learn More
            </Button>
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
