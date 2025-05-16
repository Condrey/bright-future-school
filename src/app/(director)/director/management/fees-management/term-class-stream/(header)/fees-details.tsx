"use client";

import LoadingButton from "@/components/loading-button";
import { Progress } from "@/components/ui/progress";
import { FeesDataSelect, TermWithYearData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getClassTerm } from "../../../../../../../components/school-fees/action";

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
        <span className="text-muted-foreground max-w-sm">
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

  const feesTotalPayment =
    (term.feesAmount || 0) * (term.classStream?._count.pupils || 0);

  const totalFeesPaid = fees
    .flatMap((f) => f.feesPayments.flatMap((p) => p.amountPaid))
    .reduce((total, amount) => (total || 0) + (amount || 0), 0);

  const schoolFeesAmount = term.feesAmount;
  const classTermId = term.id;

  const extraPayment =
    term.classStream?.pupils
      .map((p) => {
        const totalAmountPaid =
          p.fees
            .flatMap((f) => {
              let _feesPayments = 0;

              if (f.term.id === classTermId) {
                _feesPayments =
                  f.feesPayments.reduce(
                    (total, amount) => (total || 0) + (amount.amountPaid || 0),
                    0,
                  ) || 0;
              }
              return _feesPayments;
            })
            .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;
        if (!schoolFeesAmount) return 0;
        if (schoolFeesAmount === 0) return 0;
        const balance = schoolFeesAmount - totalAmountPaid;
        if (totalAmountPaid <= 0) return 0;
        return balance < 0 ? -balance : 0;
      })
      .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

  const totalFeesBalance = (feesTotalPayment || 0) - (totalFeesPaid || 0);

  const ratioOfPayment =
    ((totalFeesPaid || 0) - extraPayment) / (feesTotalPayment || 0);
  const percentage = isNaN(ratioOfPayment) ? 0 : ratioOfPayment * 100;

  const ratioOfExtraPayment = (extraPayment || 0) / (feesTotalPayment || 0);
  const percentageOfExtraPayment = isNaN(ratioOfExtraPayment)
    ? 0
    : ratioOfExtraPayment * 100;

  return (
    <div className="bg-card flex flex-row justify-evenly gap-3 divide-x-2 rounded-md p-4 shadow-md md:flex-col md:divide-x-0">
      <div className="w-full max-w-fit space-y-4 font-bold md:max-w-none">
        <h1 className="text-xl">Fees Details</h1>
        <div className="flex w-full flex-col justify-between gap-2 md:flex-row">
          <div className="flex flex-col gap-0">
            <h1 className="h-fit font-mono text-xl tracking-tighter lg:text-2xl">
              {formatCurrency(feesTotalPayment || 0)}
            </h1>
            <span className="text-end text-xs italic">
              Total amount expected
            </span>
          </div>
          {extraPayment > 0 && (
            <div className="text-destructive flex flex-col gap-0">
              <h1 className="font-mono text-xl tracking-tighter lg:text-2xl">
                {formatCurrency(extraPayment)}
              </h1>
              <span className="text-end text-xs italic">
                Extra payments received
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-3 ps-2">
        {/* progress bar for payment  */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Progress value={percentage} className="h-4" />
          </div>
          <span>{percentage.toFixed(1)}%</span>
        </div>

        {/* progress bar for extra payment  */}
        {extraPayment > 0 && (
          <div className="flex items-center gap-2">
            <span className='md:after:content-["_payment"]'>Extra</span>

            <div className="flex-1">
              <Progress
                value={percentageOfExtraPayment}
                className="bg-destructive/20 h-4"
                indicatorClassName="bg-destructive  "
              />
            </div>
            <span>{percentageOfExtraPayment.toFixed(1)}%</span>
          </div>
        )}

        <div className="flex w-full flex-wrap justify-evenly gap-4 font-bold">
          <div className="flex w-full max-w-fit flex-col gap-0 space-y-0.5 font-bold">
            <h1 className="font-mono tracking-tighter lg:text-xl">
              {formatCurrency(totalFeesPaid)}
            </h1>
            <span className="text-end text-xs italic">Collected payments</span>
          </div>
          <div className="flex w-full max-w-fit flex-col gap-0 space-y-0.5 font-bold">
            <h1 className="font-mono tracking-tighter lg:text-xl">
              {formatCurrency(totalFeesBalance + extraPayment)}
            </h1>
            <span className="text-end text-xs italic">Outstanding balance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
