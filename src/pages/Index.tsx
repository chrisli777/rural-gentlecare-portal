import { Hero } from "@/components/home/Hero";
import { Background } from "@/components/home/Background";
import { Header } from "@/components/layout/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Background />
    </div>
  );
};

export default Index;