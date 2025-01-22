"use client";

import TooltipContainer from "@/components/tooltip-container";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import UserAvatar from "@/components/user-avatar";
import { TermWithYearData } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { FeesStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import DropDownMenuTermClassStream from "./drop-down-menu-term-class-stream";

export const useYearTermStreamColumns: ColumnDef<TermWithYearData>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "classStream.class.class.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class" />
    ),
    cell: ({ row }) => {
      const classValue = row.original.classStream?.class?.class?.name;
      const levelName = row.original.classStream?.class?.class?.level?.name;
      const stream = row.original.classStream?.stream?.name;
      const year = row.original.classStream?.class?.academicYear?.year;
      const currentYear = new Date().getFullYear();

      return (
        <div className="space-y-0.5">
          <div className="font-bold">
            <Badge
              variant={
                Number(year || 0) === currentYear
                  ? "go"
                  : Number(year || 0) < currentYear
                    ? "destructive"
                    : "warn"
              }
            >
              {year}
            </Badge>{" "}
            • {classValue}
          </div>
          <div className="">{stream} stream</div>
          <div className="text-xs text-muted-foreground">{levelName} level</div>
        </div>
      );
    },
  },

  {
    accessorKey: "classStream.classTeacher.user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class teacher" />
    ),
    cell: ({ row }) => {
      const classTeacher = row.original.classStream?.classTeacher?.user;
      const name = classTeacher?.name;
      const avatarUrl = classTeacher?.avatarUrl;
      const description =
        classTeacher?.telephone ||
        classTeacher?.email ||
        `@${classTeacher?.username}`;
      return (
        <>
          {!classTeacher ? (
            <Badge variant={"destructive"}>Not assigned</Badge>
          ) : (
            <div className="flex gap-3">
              <UserAvatar avatarUrl={avatarUrl} />
              <div className="5 flex flex-col gap-0">
                <div>{name}</div>
                <div className="text-xs text-muted-foreground">
                  {description}
                </div>
              </div>
            </div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "term.term",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Term" />
    ),
    cell: ({ row }) => {
      const term = row.original.term?.term;
      const termStart = row.original.startAt;
      const termEnd = row.original.endAt;

      return (
        <div className="space-y-0.5">
          <div>{term}</div>
          {termStart.toString() !== termEnd.toString() && (
            <div className="text-xs">{`${format(termStart, "MMMM")}-${format(termEnd, "MMMM")}`}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "classStream._count.pupils",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pupils/ students" />
    ),
    cell: ({ row }) => {
      const pupilNumber = row.original.classStream?._count.pupils || 0;
      return (
        <>
          {pupilNumber === 0 ? (
            <Badge variant={"destructive"}>Not assigned</Badge>
          ) : pupilNumber === 1 ? (
            "1 pupil/ students"
          ) : (
            `${formatNumber(pupilNumber)} pupils/ students`
          )}
        </>
      );
    },
  },
  {
    accessorKey: "feesAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fees Amount" />
    ),
    cell: ({ row }) => {
      const schoolFeesAmount = row.original.feesAmount || 0;

      return (
        <div>
          {schoolFeesAmount === 0 ? (
            <TooltipContainer label={formatCurrency(schoolFeesAmount)}>
              <p>
                Please,{" "}
                <strong className="font-bold">
                  allocate the school fees amount
                </strong>{" "}
                for this particular year and term
              </p>
            </TooltipContainer>
          ) : (
            <span>{formatCurrency(schoolFeesAmount)}</span>
          )}
        </div>
      );
    },
  },
  {
    id: "fees.paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid" />
    ),
    cell: ({ row }) => {
      const feesCollected =
        row.original.fees
          .flatMap((f) => f.feesPayments.flatMap((p) => p.amountPaid))
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;
      const pupilNumber = row.original.classStream?._count.pupils || 0;
      const feesAmount = row.original.feesAmount;
      const totalFeesAmount = pupilNumber * (feesAmount || 0);
      const classTermId = row.original.id;

      const extraPayment =
        row.original.classStream?.pupils
          .map((p) => {
            const _totalAmountPaid =
              p.fees
                .flatMap((f) => {
                  let _feesPayments = 0;
                  if (f.term.id === classTermId) {
                    _feesPayments =
                      f.feesPayments.reduce(
                        (total, amount) =>
                          (total || 0) + (amount.amountPaid || 0),
                        0,
                      ) || 0;
                  }
                  return _feesPayments;
                })
                .reduce((total, amount) => (total || 0) + (amount || 0), 0) ||
              0;
            if (!feesAmount) return 0;
            if (feesAmount === 0) return 0;
            const _balance = feesAmount - _totalAmountPaid;
            if (_totalAmountPaid <= 0) return 0;
            return _balance < 0 ? -_balance : 0;
          })
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

      return (
        <div className="space-y-0.5">
          <span>{formatCurrency(feesCollected)}</span>
          {extraPayment > 0 && (
            <div>
              <span className="flex-none px-1 py-0.5 text-xs font-extrabold text-destructive animate-in">
                + Extra {formatCurrency(extraPayment)}
              </span>
            </div>
          )}
          <div>
            <span className="italic text-muted-foreground">of</span>{" "}
            {formatCurrency(totalFeesAmount)}
          </div>
        </div>
      );
    },
  },
  {
    id: "fees.payment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment status" />
    ),
    cell: ({ row }) => {
      const feesAmount = row.original.feesAmount || 0;
      const pupilNumber = row.original.classStream?._count.pupils || 0;
      const totalFeesAmount = pupilNumber * feesAmount;

      const feesCollected =
        row.original.fees
          .flatMap((f) => f.feesPayments.flatMap((p) => p.amountPaid))
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

      const feesStatus =
        feesCollected <= 0
          ? FeesStatus.NILL
          : feesCollected >= totalFeesAmount
            ? FeesStatus.COMPLETED
            : FeesStatus.PENDING;
      return (
        <div className="space-y-0.5">
          <Badge
            variant={
              feesStatus === FeesStatus.NILL
                ? "destructive"
                : feesStatus === FeesStatus.PENDING
                  ? "warn"
                  : "go"
            }
          >
            {feesStatus}
          </Badge>
          <div>
            <span className="italic text-muted-foreground">Bal</span>{" "}
            {formatCurrency(totalFeesAmount - feesCollected)}
          </div>
        </div>
      );
    },
  },

  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => (
      <DropDownMenuTermClassStream termClassStream={row.original!} />
    ),
  },
];
