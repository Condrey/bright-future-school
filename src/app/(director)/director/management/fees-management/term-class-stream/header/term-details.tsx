"use client";

import LoadingButton from "@/components/loading-button";
import { TermWithYearData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertTriangle, CalendarIcon } from "lucide-react";
import { getClassTerm } from "../../action";
import EditTermForm from "./edit-term-form";

interface TermDetailsProps {
  oldTerm: TermWithYearData;
}

export default function TermDetails({ oldTerm }: TermDetailsProps) {
  const {
    data: term,
    status,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["class-term", oldTerm.id],
    queryFn: async () => getClassTerm({ classTermId: oldTerm.id }),
    initialData: oldTerm,
    staleTime: Infinity,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <span className="max-w-sm text-muted-foreground">
          Error occurred while fetching term details
        </span>
        <LoadingButton
          loading={isFetching}
          variant={"destructive"}
          onClick={() => refetch()}
          className="w-fit"
        >
          Refresh
        </LoadingButton>
      </div>
    );
  }
  return (
    <div className="hidden flex-row justify-evenly gap-3 divide-x-2 rounded-md bg-card p-4 shadow-md sm:flex md:flex-col md:divide-x-0">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Term Details</h1>
        <EditTermForm termToEdit={term} />
      </div>
      <div className="flex flex-col gap-1 ps-2">
        <span>{term.term?.term}</span>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="size-4" />
          <span>Starting Date:</span>
          <span className="text-foreground">{format(term.startAt, "PPP")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="size-4" />
          <span>Ending Date:</span>
          <span className="text-foreground">{format(term.endAt, "PPP")}</span>
        </div>
        {term.endAt.toString() === term.startAt.toString() && (
          <div className="flex max-w-sm items-center gap-1 text-destructive">
            <AlertTriangle className="size-4 flex-none" />
            <span className="text-xs italic">
              Your term duration might be incorrect, edit this term
            </span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <h4 className="font-bold">Fees Amount:</h4>
          <span className="font-mono">
            {formatCurrency(term.feesAmount || 0)}
          </span>
        </div>
        {(!term.feesAmount || term.feesAmount < 1) && (
          <div className="flex max-w-sm items-center gap-1 text-destructive">
            <AlertTriangle className="size-4 flex-none" />
            <span className="text-xs italic">
              Please set the right fees amount. Edit the term.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
