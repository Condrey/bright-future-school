"use client";

import LoadingButton from "@/components/loading-button";
import { Progress } from "@/components/ui/progress";
import { FeesDataSelect, TermWithYearData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getClassTerm } from "../../action";

interface FeesDetailsProps {
  oldTerm: TermWithYearData;
}

export default function FeesDetails({ oldTerm }: FeesDetailsProps) {
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
  const fees: FeesDataSelect[] = term.fees;
  // const feesTotalPayment = fees
  //   .flatMap((f) => f.term.feesAmount)
  //   .reduce((total, amount) => (total || 0) + (amount || 0), 0);

  const feesTotalPayment =
    (term.feesAmount || 0) * (term.classStream?._count.pupils || 0);

  const totalFeesPaid = fees
    .flatMap((f) => f.feesPayments.flatMap((p) => p.amountPaid))
    .reduce((total, amount) => (total || 0) + (amount || 0), 0);

  // const totalFeesBalance = fees
  //   .flatMap((f) => f.balance)
  //   .reduce((total, amount) => (total || 0) + (amount || 0), 0);

  const totalFeesBalance = (feesTotalPayment || 0) - (totalFeesPaid || 0);

  const ratioOfPayment = (totalFeesPaid || 0) / (feesTotalPayment || 0);
const percentage = isNaN(ratioOfPayment)?0:ratioOfPayment*100
  return (
    <div className="flex flex-row justify-evenly gap-3 divide-x-2 rounded-md bg-card p-4 shadow-md md:flex-col md:divide-x-0">
      <div className="w-full max-w-fit space-y-0.5 font-bold">
        <h1 className="text-xl">Fees Details</h1>
        <h1 className="font-mono text-xl tracking-tighter lg:text-2xl">
          {formatCurrency(feesTotalPayment || 0)}
        </h1>
        <span className="text-end text-xs italic">Total Amount</span>
      </div>
      <div className="ps-2 space-y-3">
        {/* progress bar  */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Progress value={percentage} className="h-4"/>
          </div>
          <span>
            {percentage.toFixed(1)}%
          </span>
        </div>

        <div className="flex flex-wrap w-full justify-evenly gap-4 font-bold">
          <div className="w-full max-w-fit space-y-0.5 font-bold">
            <h1 className="font-mono  tracking-tighter lg:text-xl">
              {formatCurrency(totalFeesPaid)}
            </h1>
            <span className="text-end text-xs italic">Collected</span>
          </div>
          <div className="w-full max-w-fit space-y-0.5 font-bold">
            <h1 className="font-mono  tracking-tighter lg:text-xl">
              {formatCurrency(totalFeesBalance)}
            </h1>
            <span className="text-end text-xs italic">Outstanding</span>
          </div>
        </div>
      </div>
    </div>
  );
}
