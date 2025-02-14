
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

export const ChatHeader = () => {
  return (
    <div className="p-4 border-b">
      <Button 
        variant="ghost" 
        className="bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white flex items-center gap-2"
      >
        <Bot className="h-4 w-4" />
        AI Health Assistant
      </Button>
    </div>
  );
};
