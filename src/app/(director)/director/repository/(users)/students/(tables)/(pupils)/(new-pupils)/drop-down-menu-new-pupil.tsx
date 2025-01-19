import LoadingButton from "@/components/loading-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CalendarIcon, FileUserIcon, SchoolIcon, UserX } from "lucide-react";
import { useState } from "react";
import {
  useAddPupilsFromPreviousYearSameStream,
  useAddPupilsFromSameClassSameStream,
} from "../mutation";
import FormAddUnregisteredPupil from "./(un-registered-pupil)/form-add-unregistered-pupil";

interface DropDownMenuNewPupilProps {
  classStreamId: string;
}
//a4ad0704-49e9-4858-b2af-4d5bb0a659a5
export default function DropDownMenuNewPupil({
  classStreamId,
}: DropDownMenuNewPupilProps) {
  const previousYearSameStreamMutation =
    useAddPupilsFromPreviousYearSameStream();
  const sameClassSameStreamMutation = useAddPupilsFromSameClassSameStream();
  const [showAddUnregisteredPupilDialog, setShowAddUnregisteredPupilDialog] =
    useState(false);
  const [showAddNewComerPupilDialog, setShowAddNewComerPupilDialog] =
    useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <LoadingButton
            loading={false}
            title="Add a new pupil from options"
            variant="outline"
            className="flex w-full max-w-fit items-center justify-between"
          >
            <span>+ New Pupil/ student</span>
            <CaretSortIcon />
          </LoadingButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Choose an option</DropdownMenuLabel>
          <DropdownMenuItem>
            <CalendarIcon className="mr-2 size-4" />
            <span>From another year</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileUserIcon className="mr-2 size-4" />
            <span>From another stream</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowAddNewComerPupilDialog(true)}>
            <SchoolIcon className="mr-2 size-4" />
            <span>From another school</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowAddUnregisteredPupilDialog(true)}
          >
            <UserX className="mr-2 size-4" />
            <span>Unregistered pupil</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <FormAddUnregisteredPupil
        classStreamId={classStreamId}
        open={showAddUnregisteredPupilDialog}
        setOpen={setShowAddUnregisteredPupilDialog}
        title="Add an unregistered pupil/ student"
        description="This could be the first time you are setting up the database. Probably you have not added this pupil/ student yet."
      />
      <FormAddUnregisteredPupil
        classStreamId={classStreamId}
        open={showAddNewComerPupilDialog}
        setOpen={setShowAddNewComerPupilDialog}
        title="Add pupil/ student from another school"
        description="This is probably a new comer, and is not registered in your database.
You want to enlist him or her to this stream."
      />
    </>
  );
}
