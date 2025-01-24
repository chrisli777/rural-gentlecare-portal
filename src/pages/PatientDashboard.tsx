import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { Background } from "@/components/home/Background";

const PatientDashboard = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Background />
    </div>
  );
};

export default PatientDashboard;