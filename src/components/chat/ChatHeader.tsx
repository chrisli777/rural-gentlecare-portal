
import { Bot } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface ChatHeaderProps {
  isRealtimeMode: boolean;
  onModeChange: (enabled: boolean) => void;
}

export const ChatHeader = ({ isRealtimeMode, onModeChange }: ChatHeaderProps) => {
  return (
    <motion.div 
      className="p-4 border-b flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5" style={{ color: "#1E5AAB" }} />
        <h2 className="text-lg font-semibold">AI Health Assistant</h2>
      </div>
      
      <div className="flex items-center gap-2">
        <Label htmlFor="mode-toggle" className="text-sm">
          {isRealtimeMode ? "Real-time Voice" : "Text Chat"}
        </Label>
        <Switch
          id="mode-toggle"
          checked={isRealtimeMode}
          onCheckedChange={onModeChange}
        />
      </div>
    </motion.div>
  );
};
