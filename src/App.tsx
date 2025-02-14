
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useRoutes } from "react-router-dom";
import PatientDashboard from "@/pages/PatientDashboard";
import PatientAppointment from "@/pages/PatientAppointment";
import PatientMessages from "@/pages/PatientMessages";
import PatientProfile from "@/pages/PatientProfile";
import PatientOnboarding from "@/pages/PatientOnboarding";

function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <PatientOnboarding />,
    },
    {
      path: "/patient/dashboard",
      element: <PatientDashboard />,
    },
    {
      path: "/patient/appointment",
      element: <PatientAppointment />,
    },
    {
      path: "/patient/messages",
      element: <PatientMessages />,
    },
    {
      path: "/patient/profile",
      element: <PatientProfile />,
    },
  ]);

  return (
    <BrowserRouter>
      {routes}
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
