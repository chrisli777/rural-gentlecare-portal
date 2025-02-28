
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import PatientDashboard from "@/pages/PatientDashboard";
import Appointments from "@/pages/Appointments";
import AIAssistant from "@/pages/AIAssistant";
import BookAppointment from "@/pages/BookAppointment";
import PatientOnboarding from "@/pages/PatientOnboarding";
import ProviderDashboard from "@/pages/ProviderDashboard";
import ProviderLogin from "@/pages/ProviderLogin";
import PendingReviews from "@/pages/provider/PendingReviews";
import PastReviews from "@/pages/provider/PastReviews";
import TotalAppointments from "@/pages/provider/TotalAppointments";
import NewPatients from "@/pages/provider/NewPatients";
import AllPatients from "@/pages/provider/AllPatients";
import FinishedAppointments from "@/pages/provider/FinishedAppointments";
import VideoCall from "@/pages/provider/VideoCall";
import { useEffect } from "react";
import { ConversationProvider } from "./contexts/ConversationContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import MedicalRecords from "@/pages/MedicalRecords";
import MyProfile from "@/pages/MyProfile";

function App() {
  useEffect(() => {
    document.body.classList.add("bg-background");
    return () => document.body.classList.remove("bg-background");
  }, []);

  return (
    <AccessibilityProvider>
      <ConversationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/appointments" element={<Appointments />} />
            <Route path="/patient/ai-assistant" element={<AIAssistant />} />
            <Route path="/patient/book-appointment" element={<BookAppointment />} />
            <Route path="/patient/onboarding" element={<PatientOnboarding />} />
            <Route path="/patient/records" element={<MedicalRecords />} />
            <Route path="/patient/profile" element={<MyProfile />} />
            <Route path="/provider/login" element={<ProviderLogin />} />
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/provider/pending-reviews" element={<PendingReviews />} />
            <Route path="/provider/past-reviews" element={<PastReviews />} />
            <Route path="/provider/total-appointments" element={<TotalAppointments />} />
            <Route path="/provider/new-patients" element={<NewPatients />} />
            <Route path="/provider/all-patients" element={<AllPatients />} />
            <Route path="/provider/finished-appointments" element={<FinishedAppointments />} />
            <Route path="/provider/video-call" element={<VideoCall />} />
          </Routes>
        </Router>
      </ConversationProvider>
    </AccessibilityProvider>
  );
}

export default App;
