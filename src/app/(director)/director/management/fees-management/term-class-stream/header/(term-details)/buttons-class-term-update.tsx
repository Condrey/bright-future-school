import { UseFormReturn } from "react-hook-form";

import LoadingButton from "@/components/loading-button";
import TooltipContainer from "@/components/tooltip-container";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ClassTermSchema } from "@/lib/validation";
import { ChevronDown } from "lucide-react";
import {
  useUpdateAnnualClassTerms,
  useUpdateMultipleClassTerms,
  useUpdateSingleTermMutation,
} from "./mutation";

interface ButtonsClassTermUpdateProps {
  form: UseFormReturn<ClassTermSchema>;
  academicYearClassId: string;
  academicYear: string;
  levelId: string;
  termId: string;
  setOpen: (open: boolean) => void;
}

export default function ButtonsClassTermUpdate({
  form,
  academicYearClassId,
  academicYear,
  levelId,
  termId,
  setOpen,
}: ButtonsClassTermUpdateProps) {
  const { id, endAt, feesAmount, startAt } = form.watch();
  const input = { id, endAt, feesAmount, startAt };

  const singleTermMutation = useUpdateSingleTermMutation();
  const multipleTermMutation = useUpdateMultipleClassTerms();
  const annualTermMutation = useUpdateAnnualClassTerms();

  function onSuccess() {
    setOpen(false);
  }
  function handleSingleTermUpdate() {
    singleTermMutation.mutate(input, { onSuccess });
  }
  function handleMultipleTermUpdate() {
    multipleTermMutation.mutate({ input, academicYearClassId }, { onSuccess });
  }
  function handleAnnualTermUpdate() {
    annualTermMutation.mutate(
      { input, academicYear, levelId, termId },
      { onSuccess },
    );
  }

  return (
    <>
      <LoadingButton
        type="button"
        loading={
          singleTermMutation.isPending ||
          multipleTermMutation.isPending ||
          annualTermMutation.isPending
        }
        onClick={handleSingleTermUpdate}
        className="rounded-e-none"
      >
        Submit
      </LoadingButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"icon"}
            type="button"
            disabled={
              singleTermMutation.isPending ||
              multipleTermMutation.isPending ||
              annualTermMutation.isPending
            }
            className="rounded-s-none"
          >
            <ChevronDown className={cn("size-4")} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Make term's update for</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSingleTermUpdate}>
            <TooltipContainer label="Only this stream">
              <p>
                Assuming that this stream is{" "}
                <cite>2015 Baby class Horizon stream</cite>, this term update
                will not apply to other streams like <cite>Yellow</cite>,{" "}
                <cite>Pink</cite>,...
              </p>
            </TooltipContainer>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleMultipleTermUpdate}>
            <TooltipContainer label="For all steams">
              <p>
                This will have effect on{" "}
                <strong className="font-bold">terms of all streams</strong> in
                the same year. For example;{" "}
                <strong className="font-bold">
                  Term one 2015 Baby class Horizon stream
                </strong>
                ,{" "}
                <strong className="font-bold">
                  Term one 2015 Baby class Yellow stream
                </strong>
                ,{" "}
                <strong className="font-bold">
                  Term one 2015 Baby class Pink stream
                </strong>
                ,...e.t.c., with same term name.
              </p>
            </TooltipContainer>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAnnualTermUpdate}>
            <TooltipContainer label="For entire academic year">
              <p>
                This will update all classes in the entire academic level having
                the same term. For example, if this is term one in Primary
                level, it will update all term ones from the first class to the
                last class in primary level
              </p>
            </TooltipContainer>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
