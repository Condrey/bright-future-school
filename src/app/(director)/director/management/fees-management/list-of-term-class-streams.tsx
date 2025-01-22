"use client";

import { directorDashboardParamsQueryKey } from "@/app/(director)/hook";
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PARAM_NAME_ACADEMIC_YEAR, PARAM_NAME_TERM } from "@/lib/constants";
import { DirectorDashboardParam, TermWithYearData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { yearTermStreamsQueryKey } from "../../repository/(users)/utils";
import { getYearTermFeesManagementSummary } from "./action";
import { useYearTermStreamColumns } from "./columns";

interface ListOfTermClassStreamsProps {
  terms: TermWithYearData[];
  termName: string;
}
export default function ListOfTermClassStreams({
  terms,
  termName,
}: ListOfTermClassStreamsProps) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const year = searchParams.get(PARAM_NAME_ACADEMIC_YEAR)??undefined;
  const termId = searchParams.get(PARAM_NAME_TERM)??undefined;

  const { data, status, error, isFetching, refetch } = useQuery({
    queryKey: yearTermStreamsQueryKey(year, termId),
    queryFn: async () =>
      await getYearTermFeesManagementSummary({ year, termId }),
    initialData: terms,
    // staleTime: Infinity,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          Error occurred while fetching class streams.
        </p>
        <LoadingButton
          loading={isFetching}
          onClick={() => refetch()}
          className="w-fit"
        >
          Refresh
        </LoadingButton>
      </div>
    );
  }
  if (status === "success" && !data.length) {
    async function handleClick() {
      await queryClient.cancelQueries();
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) => oldData && { ...oldData, classStreams: 0 },
      );
    }
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p>There are no class streams in the database.</p>
        <Button onClick={() => handleClick()}>Create class streams</Button>
      </div>
    );
  }
  return (
    <div>
      <DataTable
        columns={useYearTermStreamColumns}
        data={data}
        ROWS_PER_TABLE={5}
        filterColumn={{ id: "classStream_class_class_name", label: "Class" }}
        tableHeaderSection={
          <TableHeaderSection terms={data} termName={termName} />
        }
      />
    </div>
  );
}

export function ListOfTermClassStreamsFallback() {
  // TODO: implement the function body.
  return <div>Loading</div>;
}

function TableHeaderSection({ terms, termName }: ListOfTermClassStreamsProps) {
  const searchParam = useSearchParams();
  const academicYear = searchParam.get(PARAM_NAME_ACADEMIC_YEAR)??undefined;
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
        <Card className="bg-blue-500 text-white dark:text-background">
          <CardHeader>
            <CardTitle className="font-mono text-xl font-bold lg:text-2xl">
              {formatCurrency(feesTotalPayment || 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardTitle className="w-full text-center">
              Total amount expected
            </CardTitle>
            <CardDescription className="w-full text-center text-white dark:text-background">
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
              <CardDescription className="w-full text-center text-destructive-foreground">
                <span className="italic">from</span>{" "}
                <span>{`${academicYear || "All years"}, ${termName}`}</span>
              </CardDescription>
            </CardContent>
          </Card>
        )}
        <Card className="bg-green-500 text-white dark:text-background">
          <CardHeader>
            <CardTitle className="font-mono text-xl font-bold lg:text-2xl">
              {formatCurrency(totalFeesPaid)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardTitle className="w-full text-center">
              Collected payments
            </CardTitle>
            <CardDescription className="w-full text-center text-white dark:text-background">
              <span className="italic">from</span>{" "}
              <span>{`${academicYear || "All years"}, ${termName}`}</span>
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-amber-500 text-white dark:text-background">
          <CardHeader>
            <CardTitle className="font-mono text-xl font-bold lg:text-2xl">
              {formatCurrency(totalFessBalance + extraPayment)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardTitle className="w-full text-center">
              Outstanding balance
            </CardTitle>
            <CardDescription className="w-full text-center text-white dark:text-background">
              <span className="italic">from</span>{" "}
              <span>{`${academicYear || "All years"}, ${termName}`}</span>
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
