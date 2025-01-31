import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings2 } from "lucide-react"

const notificationMethods = [
  { id: "app", label: "App Notifications" },
  { id: "sms", label: "SMS" },
  { id: "call", label: "Phone Call" },
  { id: "email", label: "Email" },
]

interface NotificationPreferencesProps {
  selectedMethods: string[];
  onMethodsChange: (methods: string[]) => void;
}

export const NotificationPreferences = ({
  selectedMethods,
  onMethodsChange,
}: NotificationPreferencesProps) => {
  const toggleMethod = (method: string) => {
    if (selectedMethods.includes(method)) {
      onMethodsChange(selectedMethods.filter(m => m !== method));
    } else {
      onMethodsChange([...selectedMethods, method]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          Preferences
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-4">
        <div className="space-y-4">
          <Label className="text-base">Receive notifications via:</Label>
          <div className="space-y-2">
            {notificationMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-2">
                <Checkbox
                  id={method.id}
                  checked={selectedMethods.includes(method.id)}
                  onCheckedChange={() => toggleMethod(method.id)}
                />
                <Label htmlFor={method.id} className="text-sm font-normal">
                  {method.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};