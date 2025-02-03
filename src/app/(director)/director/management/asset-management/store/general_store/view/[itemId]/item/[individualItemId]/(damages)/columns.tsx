import { assetConditions } from "@/app/(director)/director/management/asset-management/add-asset/barrel-file";
import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import TooltipContainer from "@/components/tooltip-container";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import UserAvatar from "@/components/user-avatar";
import { AssetDamageData } from "@/lib/types";
import { AssetCondition } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import DropDownMenuDamage from "./drop-down-menu-damage";

export const useDamagesColumns: ColumnDef<AssetDamageData>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span className="tabular-nums">{row.index + 1}</span>,
  },
  {
    accessorKey: "damagedBy.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Damaged by" />
    ),
    cell: ({ row }) => {
      const person = row.original.damagedBy;
      return (
        <div className="flex gap-2">
          <UserAvatar avatarUrl={person.avatarUrl} />
          <div>
            <div>{person.name}</div>
            <div className="text-xs text-muted-foreground">
              {person.telephone || person.email || `@${person.username}`}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "condition",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Condition" />;
    },
    cell: ({ row }) => {
      const condition = row.original.condition;
      return (
        <Badge
          variant={
            condition === AssetCondition.DAMAGED ||
            condition === AssetCondition.POOR
              ? "destructive"
              : condition === AssetCondition.FAIR
                ? "warn"
                : "go"
          }
        >
          {assetConditions[condition]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "damageDetails",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Damage details" />
    ),
    cell: ({ row }) => {
      return (
        <TooltipContainer label="read details" className="">
          <TipTapViewer content={row.original.damageDetails} />
        </TooltipContainer>
      );
    },
  },
  {
    accessorKey: "isRepaired",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is repaired?" />
    ),
    cell: ({ row }) => {
      const isRepaired = row.original.isRepaired;
      return (
        <div className="flex flex-col">
          <Badge variant={isRepaired ? "go" : "destructive"} className="w-fit">
            {isRepaired ? "Repaired" : "Not yet"}
          </Badge>
          {isRepaired && row.original.repairedAt && (
            <span className="text-xs italic">
              {format(row.original.repairedAt, "PPpp")}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recorded at" />
    ),
    cell: ({ row }) => {
      return <span>{format(row.original.createdAt, "PPP")}</span>;
    },
  },
  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <DropDownMenuDamage item={row.original} />,
  },
];
