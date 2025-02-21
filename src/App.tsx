
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@/pages/Home";
import ProviderLogin from "@/pages/ProviderLogin";
import ProviderDashboard from "@/pages/ProviderDashboard";
import PatientDashboard from "@/pages/PatientDashboard";
import AIAssistant from "@/pages/AIAssistant";
import BookAppointment from "@/pages/BookAppointment";
import PatientOnboarding from "@/pages/PatientOnboarding";
import { Toaster } from "@/components/ui/toaster";
import NewPatients from "@/pages/provider/NewPatients";
import PendingReviews from "@/pages/provider/PendingReviews";
import TotalAppointments from "@/pages/provider/TotalAppointments";
import FinishedAppointments from "@/pages/provider/FinishedAppointments";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/provider/login",
    element: <ProviderLogin />,
  },
  {
    path: "/provider/dashboard",
    element: <ProviderDashboard />,
  },
  {
    path: "/provider/new-patients",
    element: <NewPatients />,
  },
  {
    path: "/provider/pending-reviews",
    element: <PendingReviews />,
  },
  {
    path: "/provider/total-appointments",
    element: <TotalAppointments />,
  },
  {
    path: "/provider/finished-appointments",
    element: <FinishedAppointments />,
  },
  {
    path: "/patient/dashboard",
    element: <PatientDashboard />,
  },
  {
    path: "/patient/book-appointment",
    element: <BookAppointment />,
  },
  {
    path: "/patient/onboarding",
    element: <PatientOnboarding />,
  },
  {
    path: "/patient/messages",
    element: <AIAssistant />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
