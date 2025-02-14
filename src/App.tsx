
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import PatientDashboard from "@/pages/PatientDashboard";
import PatientAppointment from "@/pages/PatientAppointment";
import PatientMessages from "@/pages/PatientMessages";
import PatientProfile from "@/pages/PatientProfile";
import PatientOnboarding from "@/pages/PatientOnboarding";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient/onboarding" element={<PatientOnboarding />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/appointment" element={<PatientAppointment />} />
        <Route path="/patient/messages" element={<PatientMessages />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
