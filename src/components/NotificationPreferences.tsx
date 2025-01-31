import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

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
    <div className="space-y-4">
      <Label className="text-base">Receive notifications via:</Label>
      <div className="grid grid-cols-2 gap-4">
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
  );
};