
import { Leaf, Stethoscope, HandHeart } from "lucide-react";

export const BackgroundElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Floating Clouds */}
      <div className="absolute top-20 left-10 w-24 h-12 bg-white/40 rounded-full blur-xl animate-float-slow" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-32 h-16 bg-white/30 rounded-full blur-xl animate-float-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-32 left-1/4 w-28 h-14 bg-white/20 rounded-full blur-xl animate-float-slow" style={{ animationDelay: '1s' }} />
      
      {/* Floating Leaves */}
      <div className="absolute top-1/4 right-8 animate-float-leaf">
        <Leaf className="w-6 h-6 text-accent/40" />
      </div>
      <div className="absolute bottom-1/4 left-12 animate-float-leaf" style={{ animationDelay: '2s' }}>
        <Leaf className="w-5 h-5 text-accent/30" />
      </div>
      
      {/* Healthcare Icons */}
      <div className="absolute top-32 left-6 animate-float">
        <Stethoscope className="w-8 h-8 text-primary/30" />
      </div>
      <div className="absolute bottom-24 right-8 animate-float" style={{ animationDelay: '1.5s' }}>
        <HandHeart className="w-8 h-8 text-primary/30" />
      </div>
    </div>
  );
};
