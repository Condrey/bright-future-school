"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PARAM_NAME_ACADEMIC_YEAR } from "@/lib/constants";
import { TermWithYearData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface TableHeaderSectionProps {
  terms: TermWithYearData[];
  termName: string;
}
export function TableHeaderSection({
  terms,
  termName,
}: TableHeaderSectionProps) {
  const searchParam = useSearchParams();
  const academicYear = searchParam.get(PARAM_NAME_ACADEMIC_YEAR) ?? undefined;
  // const academicTerm = searchParam.get(PARAM_NAME_TERM);

  const feesTotalPayment = terms
    .map((term) => {
      const _feesAmount = term.feesAmount || 0;
      const _numberOfPupils = term.classStream?._count.pupils || 0;
      return _feesAmount * _numberOfPupils;
    })
    .reduce((total, amount) => (total || 0) + (amount || 0), 0);

  const totalFeesPaid = terms
    .map((term) => {
      const _feesPayment = term.fees
        .flatMap((f) => f.feesPayments.flatMap((p) => p.amountPaid))
        .reduce((total, amount) => (total || 0) + (amount || 0), 0);
      return _feesPayment;
    })
    .reduce((total, amount) => (total || 0) + (amount || 0), 0);

  const extraPayments = terms.map((term) => {
    const _feesAmount = term.feesAmount;
    const _classTermId = term.id;

    const _extraPay =
      term.classStream?.pupils
        .map((p) => {
          const _totalAmountPaid =
            p.fees
              .flatMap((f) => {
                let _feesPayments = 0;
                if (f.term.id === _classTermId) {
                  _feesPayments =
                    f.feesPayments.reduce(
                      (total, amount) =>
                        (total || 0) + (amount.amountPaid || 0),
                      0,
                    ) || 0;
                }

                return _feesPayments;
              })
              .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;
          if (!_feesAmount) return 0;
          if (_feesAmount === 0) return 0;
          const _balance = _feesAmount - _totalAmountPaid;
          if (_totalAmountPaid <= 0) return 0;

          return _balance < 0 ? -_balance : 0;
        })
        .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

    return _extraPay;
  });

  const extraPayment =
    extraPayments.reduce((total, amount) => (total || 0) + (amount || 0), 0) ||
    0;

  const totalFessBalance = (feesTotalPayment || 0) - (totalFeesPaid || 0);

  return (
    <>
      {/* <pre>{JSON.stringify(extraPayments, null, 2)}</pre> */}
      <div className="flex flex-wrap justify-center gap-4">
        <Card className="dark:text-background bg-blue-500 text-white">
          <CardHeader>
            <CardTitle className="font-mono text-xl font-bold lg:text-2xl">
              {formatCurrency(feesTotalPayment || 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardTitle className="w-full text-center">
              Total amount expected
            </CardTitle>
            <CardDescription className="dark:text-background w-full text-center text-white">
              <span className="italic">from</span>{" "}
              <span>{`${academicYear || "All years"}, ${termName}`}</span>
            </CardDescription>
          </CardContent>
        </Card>
        {extraPayment > 0 && (
          <Card className="bg-destructive text-destructive-foreground">
            <CardHeader>
              <CardTitle className="font-mono text-xl font-bold lg:text-2xl">
                {formatCurrency(extraPayment)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardTitle className="w-full text-center">
                Extra payments
              </CardTitle>
              <CardDescription className="text-destructive-foreground w-full text-center">
                <span className="italic">from</span>{" "}
                <span>{`${academicYear || "All years"}, ${termName}`}</span>
              </CardDescription>
            </CardContent>
          </Card>
        )}
        <Card className="dark:text-background bg-green-500 text-white">
          <CardHeader>
            <CardTitle className="font-mono text-xl font-bold lg:text-2xl">
              {formatCurrency(totalFeesPaid)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardTitle className="w-full text-center">
              Collected payments
            </CardTitle>
            <CardDescription className="dark:text-background w-full text-center text-white">
              <span className="italic">from</span>{" "}
              <span>{`${academicYear || "All years"}, ${termName}`}</span>
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="dark:text-background bg-amber-500 text-white">
          <CardHeader>
            <CardTitle className="font-mono text-xl font-bold lg:text-2xl">
              {formatCurrency(totalFessBalance + extraPayment)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardTitle className="w-full text-center">
              Outstanding balance
            </CardTitle>
            <CardDescription className="dark:text-background w-full text-center text-white">
              <span className="italic">from</span>{" "}
              <span>{`${academicYear || "All years"}, ${termName}`}</span>
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
