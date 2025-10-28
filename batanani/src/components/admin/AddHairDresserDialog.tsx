import React from 'react'
import { Gender} from "@prisma/client";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { useCreateHairdressers } from "@/hooks/use-hairdressers"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { formatPhoneNumber } from '../../lib/utils';



interface AddHairDresserDialogProps {
  isOpen: boolean;
  onClose: () => void;
}



 
function AddHairDresserDialog({isOpen,onClose}: AddHairDresserDialogProps) {

    const [newHairDresser , setNewHairDresser] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        speciality: '',
        gender:  "MALE" as Gender,
        isActive: true,

    });

const createHairdressersMutation = useCreateHairdressers()

  const handlePhoneChange = (value: string) => {
    const formattedPhoneNumber= formatPhoneNumber(value);
    setNewHairDresser({ ...newHairDresser, phoneNumber: formattedPhoneNumber });
  };

  const handleSave = () => {
    createHairdressersMutation.mutate(newHairDresser, 
    {...newHairDresser},
    {
      onSuccess: handleClose,
    }
);
};

const handleClose= () => {
onClose();
  setNewHairDresser({
    name: '',
    email: '',
    phoneNumber: '',
    speciality:"",
    gender: "MALE" ,
    isActive: true,
});
};

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
            <DialogTitle>Add new Hairdresser</DialogTitle>
            <DialogDescription>
              Add new hairdressers to the platform .
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4  ">
                <div className="space-y-2">
                    <Label htmlFor="new-name">Name * </Label>
                    <Input
                        id="new-name"
                        value={newHairDresser.name}
                        onChange={(e) => setNewHairDresser
                        ({ ...newHairDresser, name: e.target.value })}
                        placeholder="Benji"
                       
                    />
            </div>
             <div className="space-y-2">
                    <Label htmlFor="new-speciality">Speciality </Label>
                    <Input
                        id="new-speciality"
                        value={newHairDresser.speciality}
                        onChange={(e) => setNewHairDresser
                        ({ ...newHairDresser, speciality: e.target.value })}
                        placeholder="General hair "
                       
                    />
                </div>
          </div>
          
             <div className="space-y-2">
                    <Label htmlFor="new-email">Email </Label>
                    <Input
                        id="new-email"
                        value={newHairDresser.email}
                        onChange={(e) => setNewHairDresser
                        ({ ...newHairDresser, email: e.target.value })}
                        placeholder="hairdresser@example.com"
                       
                    />
          </div>

          
          
           <div className="space-y-2">
                    <Label htmlFor="new-phone">Phone </Label>
                    <Input
                        id="new-phone"
                        value={newHairDresser.phoneNumber}
                        onChange={(e) => handlePhoneChange
                        ( e.target.value )}
                        placeholder="+26775589640"

                    />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-gender">Gender</Label>
              <Select
                value={newHairDresser.gender || ""}
                onValueChange={(value) => setNewHairDresser({ ...newHairDresser, gender: value as Gender })}
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
                <Label htmlFor="new-status">Status</Label>
              <Select
                value={newHairDresser.isActive ? "active" : "inactive"}
                onValueChange={(value) =>
                  setNewHairDresser({ ...newHairDresser, isActive: value === "active" })
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
           <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
            disabled={
              !newHairDresser.name ||
              !newHairDresser.email ||
              !newHairDresser.speciality ||
              createHairdressersMutation.isPending
            }
          >
            {createHairdressersMutation.isPending ? "Adding..." : "Add Haidresser"}
          </Button>
        </DialogFooter>
        


         
     

      </DialogContent>
     </Dialog>   
  
                        );
                    }

export default AddHairDresserDialog;