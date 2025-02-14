
import { Bot } from "lucide-react";

export const ChatHeader = () => {
  return (
    <div className="p-4 border-b flex items-center gap-2">
      <Bot className="h-5 w-5 text-primary" />
      <h2 className="text-lg font-semibold">AI Health Assistant</h2>
    </div>
  );
};
