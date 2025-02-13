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
import { CaretSortIcon } from "@radix-ui/react-icons";
import { SchoolIcon, Users2Icon } from "lucide-react";
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
            <CaretSortIcon className="ml-2 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Cost of payment levied on</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onItemClicked(true)}>
              <Users2Icon className="mr-2 size-4" />
              <span>Pupil/ student</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onItemClicked(false)}>
              <SchoolIcon className="mr-2 size-4" />

              <span> School</span>
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
