import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Users, Brain, Shield } from "lucide-react";

export const Background = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Thesis and Hypothesis */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-600">
              "Integrating artificial intelligence into rural healthcare systems in Adams County, Washington, can significantly improve service efficiency and patient outcomes by streamlining administrative processes and addressing the specific needs of geriatric care."
            </p>
            <p className="text-primary font-medium">
              We aim to reduce administrative workload by 30% and increase patient satisfaction scores by 20% over six months through AI-driven healthcare solutions.
            </p>
          </div>

          {/* Healthcare Access Context */}
          <Card className="bg-secondary/20">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-semibold mb-4">Rural Healthcare in Adams County</h3>
              <p className="text-gray-600 leading-relaxed">
                Access to healthcare in rural areas of Washington State, particularly in Adams County, faces unique challenges including accessibility, affordability, and workforce shortages. East Adams Rural Healthcare in Ritzville serves as the primary healthcare provider, supporting agricultural workers and an growing elderly population with increasing healthcare demands.
              </p>
            </CardContent>
          </Card>

          {/* User Personas */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="text-primary h-6 w-6" />
                  <h4 className="text-xl font-semibold">Healthcare Provider</h4>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Dr. Emily Carter</p>
                  <p className="text-gray-600">
                    A 45-year-old Geriatric Specialist at East Adams Rural Healthcare with 15 years of experience in rural healthcare. Passionate about improving patient outcomes through technology.
                  </p>
                  <p className="text-primary/80 italic">
                    "I want to spend less time on paperwork so I can focus more on providing quality healthcare to Adams County's aging population."
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="text-primary h-6 w-6" />
                  <h4 className="text-xl font-semibold">Patient</h4>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Victor, 72</p>
                  <p className="text-gray-600">
                    A retired farmworker in Adams County with limited mobility, requiring regular management of chronic conditions including diabetes and hypertension.
                  </p>
                  <p className="text-primary/80 italic">
                    "I want to have my medical forms pre-filled and simplified so that I can understand my healthcare information better."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Integration */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Brain className="text-primary h-6 w-6" />
                  <h4 className="text-xl font-semibold">AI in Healthcare</h4>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Automated medical form completion</li>
                  <li>• Smart appointment scheduling</li>
                  <li>• Health risk assessment</li>
                  <li>• Patient record management</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="text-primary h-6 w-6" />
                  <h4 className="text-xl font-semibold">Our Commitments</h4>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Ethical AI implementation</li>
                  <li>• Strong privacy protection</li>
                  <li>• Comprehensive staff training</li>
                  <li>• Community-focused solutions</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};