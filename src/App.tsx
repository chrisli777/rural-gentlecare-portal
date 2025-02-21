
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { ConversationProvider } from "@/contexts/ConversationContext";
import Home from "@/pages/Home";
import PatientDashboard from "@/pages/PatientDashboard";
import AIAssistant from "@/pages/AIAssistant";
import BookAppointment from "@/pages/BookAppointment";
import Appointments from "@/pages/Appointments";
import PatientOnboarding from "@/pages/PatientOnboarding";
import ProviderDashboard from "@/pages/ProviderDashboard";
import ProviderLogin from "@/pages/ProviderLogin";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/patient/onboarding" element={<PatientOnboarding />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/ai-assistant" element={<AIAssistant />} />
          <Route path="/patient/book-appointment" element={<BookAppointment />} />
          <Route path="/patient/appointments" element={<Appointments />} />
          <Route path="/provider/login" element={<ProviderLogin />} />
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <ConversationProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster />
          </BrowserRouter>
        </ConversationProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}

export default App;
