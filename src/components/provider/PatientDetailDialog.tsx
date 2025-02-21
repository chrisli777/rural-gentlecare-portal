
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "lucide-react";

interface PatientDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: {
    id: number;
    name: string;
    dateJoined: string;
    reason: string;
    age: number;
  };
}

export const PatientDetailDialog = ({ open, onOpenChange, patient }: PatientDetailDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            {patient.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-medium">{patient.age} years old</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Joined Date</p>
              <p className="font-medium">{patient.dateJoined}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Reason for Visit</p>
              <p className="font-medium">{patient.reason}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Medical History</p>
              <p className="font-medium">No previous visits</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Allergies</p>
              <p className="font-medium">None reported</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Current Medications</p>
              <p className="font-medium">None reported</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
