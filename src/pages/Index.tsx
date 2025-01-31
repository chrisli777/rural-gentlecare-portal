import { Hero } from "@/components/home/Hero";
import { Background } from "@/components/home/Background";
import { Header } from "@/components/layout/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 via-white to-white">
      <Header />
      <Hero />
      <Background />
    </div>
  );
};

export default Index;