import { Button } from "@/components/ui/button";
import { IndividualLibraryBookData } from "@/lib/types";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import FormUpdateIndividualItem from "./form-update-individual-item";

interface ButtonEditIndividualItemProps {
  individualItemToEdit: IndividualLibraryBookData;
}

export default function ButtonEditIndividualItem({
  individualItemToEdit,
}: ButtonEditIndividualItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant={"secondary"}
        onClick={() => setOpen(true)}
        className="w-fit"
      >
        <PencilIcon className="size-4" />
        <span>Update</span>
      </Button>
      <FormUpdateIndividualItem
        open={open}
        setOpen={setOpen}
        individualItemToEdit={individualItemToEdit}
      />
    </>
  );
}
