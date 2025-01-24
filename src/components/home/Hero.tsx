import { Button } from "@/components/ui/button";
import { Calendar, Video, BookOpen } from "lucide-react";

export const Hero = () => {
  return (
    <section className="pt-24 pb-16 px-4 min-h-screen flex items-center bg-gradient-to-b from-secondary/50 to-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
            <span className="text-sm font-medium">Serving Adams County Since 1985</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Specialized Geriatric Care for Our Rural Community
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Providing comprehensive healthcare services tailored to the unique needs of our elderly community members, right here in Adams County.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto">
              Schedule Appointment
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              {
                icon: Calendar,
                title: "Easy Scheduling",
                description: "Book appointments online with our caring providers",
              },
              {
                icon: Video,
                title: "Telehealth Services",
                description: "Connect with doctors from the comfort of home",
              },
              {
                icon: BookOpen,
                title: "Health Resources",
                description: "Access educational materials about geriatric care",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:border-primary/20 transition-all duration-300"
              >
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};