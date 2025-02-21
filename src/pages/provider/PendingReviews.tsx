
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { User, Bell, FileText } from "lucide-react";
import { useState } from "react";
import { ReviewDialog } from "@/components/provider/ReviewDialog";
import { Button } from "@/components/ui/button";

const PendingReviews = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);

  const pendingReviews = [
    {
      id: 1,
      patientName: "Michael Chen",
      time: "11:30 AM",
      date: "2024-02-20",
      notes: "Initial consultation - chronic back pain",
      status: "Pending Review",
      hasReport: true
    },
    {
      id: 2,
      patientName: "Emily Brown",
      time: "2:15 PM",
      date: "2024-02-20",
      notes: "Medication review - anxiety management",
      status: "Voice Recording Ready",
      hasReport: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Pending Reviews</h1>
              <p className="text-xl text-gray-600 mt-2">Review patient recordings and generate reports</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowReport(true)}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Past Reviews
            </Button>
          </div>

          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <Card key={review.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.patientName}</h3>
                      <p className="text-sm text-gray-600">{review.notes}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{review.time}</p>
                      <p className="text-sm text-gray-600">{review.status}</p>
                    </div>
                    <div className="flex gap-2">
                      {review.hasReport && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment({ ...review, viewOnly: true });
                          }}
                        >
                          <FileText className="h-4 w-4" />
                          View Report
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setSelectedAppointment(review)}
                      >
                        <Bell className="h-4 w-4 text-blue-600" />
                      </Button>
                    </div>
                  </div>
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

export default PendingReviews;
