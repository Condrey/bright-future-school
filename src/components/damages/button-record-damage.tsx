import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AssetCategory } from "@prisma/client";
import { useState } from "react";
import FormAddEditDamage from "./form-add-edit-damage";

interface ButtonRecordDamageProps {
  assetCategory: AssetCategory;
  label?: string;
  className?: string;
  parentId: string;
}

export default function ButtonRecordDamage({
  label,
  className,
  parentId,
  assetCategory,
}: ButtonRecordDamageProps) {
  const [open, setOpen] = useState(false);
  const [damagedByStudent, setDamagedByStudent] = useState(true);

  function onItemClicked(isStudentCost: boolean) {
    setDamagedByStudent(isStudentCost);
    setOpen(true);
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={!label ? "default" : "secondary"}
            className={cn("w-fit", className)}
          >
            {label || "Register a damage"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Cost of payment levied on</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onItemClicked(true)}>
              Pupil/ student
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onItemClicked(false)}>
              School
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <FormAddEditDamage
        damagedByStudent={damagedByStudent}
        assetCategory={assetCategory}
        open={open}
        setOpen={setOpen}
        parentId={parentId}
      />
    </>
  );
}
