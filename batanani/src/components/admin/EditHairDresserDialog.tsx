import React from 'react'
import { Hairdresser, Gender } from '@prisma/client';
import { useState } from "react";
import { useUpdateHairdressers } from '../../hooks/use-hairdressers';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';


interface EditHairDresserDialogProps { 
    isOpen: boolean;
    onClose: () => void;
    hairDresser: HairDresser | null;
}
function EditHairDresserDialog({hairDresser,isOpen, onClose}: EditHairDresserDialogProps) {
    const [editingHairDresser, setEditingHairDresser] = useState<Hairdresser | null>(hairDresser);
    
    const updateHairDresserMutation = useUpdateHairdressers();

    const handlePhoneChange = (value: string) => {
        const formattedPhoneNumber = formatPhoneNumber(value);
        if (editingHairDresser) {
            setEditingHairDresser({ ...editingHairDresser, phoneNumber: formattedPhoneNumber });
        }
  };

    const handleSave = () => {
        if (editingHairDresser) {
            updateHairDresserMutation.mutate({ ...editingHairDresser },
                { onSuccess: handleClose });
        }
    };
      const handleClose = () => {
            onClose();
            setEditingHairDresser(null);
        };
 

    return (

              <Dialog open={isOpen} onOpenChange={handleClose}>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                          <DialogTitle>Edit Hairdresser</DialogTitle>
                          <DialogDescription>
                            Update Hairdressers information and status .
                          </DialogDescription>
                </DialogHeader>

                {editingHairDresser && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingHairDresser.name}
                  onChange={(e) => setEditingHairDresser({ ...editingHairDresser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="speciality">Speciality</Label>
                <Input
                  id="speciality"
                  value={editingHairDresser.speciality}
                  onChange={(e) =>
                    setEditingHairDresser({ ...editingHairDresser, speciality: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editingHairDresser.email}
                onChange={(e) => setEditingHairDresser({ ...editingHairDresser, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editingHairDresser.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={editingHairDresser.gender || ""}
                  onValueChange={(value) =>
                    setEditingHairDresser({ ...editingHairDresser, gender: value as Gender })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingHairDresser.isActive ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setEditingHairDresser({ ...editingHairDresser, isActive: value === "active" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
           disabled={updateHairDresserMutation.isPending}
          >
            {updateHairDresserMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditHairDresserDialog;