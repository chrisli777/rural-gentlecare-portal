
import React from 'react';
import { cn } from "@/lib/utils";

interface SoundBarProps {
  isPlaying: boolean;
  className?: string;
}

export const SoundBar = ({ isPlaying, className }: SoundBarProps) => {
  return (
    <div className={cn("flex items-center gap-0.5 h-4", className)}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 bg-primary rounded-full transition-all duration-300",
            isPlaying ? "animate-[soundbar_1s_ease-in-out_infinite]" : "h-2",
            {
              'animation-delay-200': i === 1,
              'animation-delay-300': i === 2,
              'animation-delay-400': i === 3
            }
          )}
        />
      ))}
    </div>
  );
};
