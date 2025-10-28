
import { useGetHairdressers } from "@/hooks/use-hairdressers";
import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "../ui/card";
import { EditIcon,PlusIcon, ScissorsLineDashed, MailIcon, PhoneIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Badge } from "../ui/badge";
import AddHairDresserDialog from "./AddHairDresserDialog";
import EditHairDresserDialog from "./EditHairDresserDialog";

function HairdressersManagement() {
  const { data: hairdressers = [] } = useGetHairdressers();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedHairdresser, setSelectedHairdresser] = useState<Hairdresser | null>(null);

  const handleEditHairDresser = (hairdresser: Hairdresser) => {
    setSelectedHairdresser(hairdresser);
    setIsEditDialogOpen(true);
  };
  const handleClosedEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedHairdresser(null);
  };

  return (
    <>
      <Card className="mb-12">
        <CardHeader className="flex items-center justify-between ">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ScissorsLineDashed className="size-6 text-primary" />
              Hairdressers Management
            </CardTitle>
            <CardDescription>Manage and oversee all hairdressers</CardDescription>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90
                    hover:to-primary/100 text-white"
          >
            <PlusIcon className="mr-2 size-4"></PlusIcon>
            Add hairdresser
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {hairdressers.map((hairdresser) => (
              <div
                key={hairdresser.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={hairdresser.imageUrl}
                    alt={hairdresser.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover ring-background"
                  />
                  <div>
                    <div className="font-semibold">{hairdresser.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {hairdresser.specialty}
                    </div>

                    <span className="ml-2 px-2 py-0.5 bg-muted rounded text-xs">
                      {hairdresser.gender === "MALE" ? "Male" : "Female"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MailIcon className="h-3 w-3" />
                      {hairdresser.email}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <PhoneIcon className="h-3 w-3" />
                      {hairdresser.phone}
                    </div>
                  </div>
                </div>

               
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="font-semibold text-primary">
                      {hairdresser.appointmentCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Appointments</div>
                  </div>
                   
                   
                  {hairdresser.isActive ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3"
                    onClick={() => handleEditHairDresser(hairdresser)}
                  >
                    <EditIcon className="size-4 mr-1" />
                    Edit
                  </Button>
                  
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddHairDresserDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}/>
      {/* Edit Hairdresser Dialog - to be implemented */}
      <EditHairDresserDialog
        isOpen={isEditDialogOpen}
        onClose={handleClosedEditDialog}
        hairDresser={selectedHairdresser}
        key={selectedHairdresser ?.id }
      
      
      />

        
    </>
  );
}

export default HairdressersManagement;
