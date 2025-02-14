
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import Home from "@/pages/Home";
import PatientDashboard from "@/pages/PatientDashboard";
import PatientAppointment from "@/pages/PatientAppointment";
import PatientOnboarding from "@/pages/PatientOnboarding";

function App() {
  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patient/onboarding" element={<PatientOnboarding />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/appointment" element={<PatientAppointment />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AccessibilityProvider>
  );
}

export default App;
