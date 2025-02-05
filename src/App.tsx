
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls";
import { ElevenLabsProvider } from "@11labs/react";
import Index from "./pages/Index";
import PatientDashboard from "./pages/PatientDashboard";
import PatientLogin from "./pages/PatientLogin";
import PatientSignup from "./pages/PatientSignup";
import PatientProfile from "./pages/PatientProfile";
import PatientMessages from "./pages/PatientMessages";
import PatientAppointment from "./pages/PatientAppointment";
import PatientAIAssistant from "./pages/PatientAIAssistant";
import AboutUs from "./pages/AboutUs";
import ProviderLogin from "./pages/ProviderLogin";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderPatients from "./pages/ProviderPatients";
import ProviderAnalytics from "./pages/ProviderAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <ElevenLabsProvider apiKey={import.meta.env.VITE_ELEVEN_LABS_API_KEY}>
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/patient/login" element={<PatientLogin />} />
              <Route path="/patient/signup" element={<PatientSignup />} />
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/profile" element={<PatientProfile />} />
              <Route path="/patient/messages" element={<PatientMessages />} />
              <Route path="/patient/appointment" element={<PatientAppointment />} />
              <Route path="/patient/ai-assistant" element={<PatientAIAssistant />} />
              <Route path="/about" element={<AboutUs />} />
              {/* Provider Routes */}
              <Route path="/provider/login" element={<ProviderLogin />} />
              <Route path="/provider/dashboard" element={<ProviderDashboard />} />
              <Route path="/provider/patients" element={<ProviderPatients />} />
              <Route path="/provider/patients/:id" element={<PatientProfile />} />
              <Route path="/provider/analytics" element={<ProviderAnalytics />} />
            </Routes>
            <AccessibilityControls />
          </BrowserRouter>
        </TooltipProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  </ElevenLabsProvider>
);

export default App;
