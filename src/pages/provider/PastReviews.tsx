
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { User, FileText } from "lucide-react";
import { useState } from "react";
import { ReviewDialog } from "@/components/provider/ReviewDialog";
import { Button } from "@/components/ui/button";

const PastReviews = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const pastReviews = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      time: "10:30 AM",
      date: "2024-02-15",
      notes: "Follow-up consultation - migraine treatment",
      status: "Completed",
      report: {
        diagnosis: "Chronic migraine with aura",
        prescription: "Sumatriptan 50mg",
        recommendations: "Lifestyle changes, stress management"
      }
    },
    {
      id: 2,
      patientName: "Robert Lee",
      time: "2:00 PM",
      date: "2024-02-14",
      notes: "Regular check-up - diabetes management",
      status: "Completed",
      report: {
        diagnosis: "Type 2 Diabetes - well controlled",
        prescription: "Continue current medication",
        recommendations: "Regular exercise, diet monitoring"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Past Reviews</h1>
            <p className="text-xl text-gray-600 mt-2">Previously completed patient reviews</p>
          </div>

          <div className="space-y-4">
            {pastReviews.map((review) => (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.patientName}</h3>
                      <p className="text-sm text-gray-600">{review.notes}</p>
                      <p className="text-sm text-gray-500 mt-1">{review.date} at {review.time}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2"
                    onClick={() => setSelectedAppointment(review)}
                  >
                    <FileText className="h-4 w-4" />
                    View Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {selectedAppointment && (
        <ReviewDialog
          open={!!selectedAppointment}
          onOpenChange={(open) => !open && setSelectedAppointment(null)}
          appointment={selectedAppointment}
        />
      )}
    </div>
  );
};

export default PastReviews;
