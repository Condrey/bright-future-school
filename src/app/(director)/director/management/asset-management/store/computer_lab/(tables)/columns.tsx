"use client";

import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import TooltipContainer from "@/components/tooltip-container";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ComputerLabItemData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { assetUnits } from "../../../add-asset/barrel-file";
import DropDownMenuComputerLabItem from "./drop-down-menu-computer-lab-item";

export const useComputerLabColumns: ColumnDef<ComputerLabItemData>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Item" />
    ),
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorKey: "model",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Model" />
    ),
    cell: ({ row }) => <span>{row.original.model}</span>,
  },
  {
    accessorKey: "specification",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Specification" />
    ),
    cell: ({ row }) => (
      <TooltipContainer label="See specification">
        <TipTapViewer content={row.original.specification} />
      </TooltipContainer>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell({ row }) {
      const itemNumber = row.original.quantity || 0;
      return (
        <div>
          {itemNumber === 0 ? (
            <Badge variant={"destructive"}>No items</Badge>
          ) : (
            <span>{`${formatNumber(itemNumber)} ${assetUnits[row.original.unit]}${itemNumber === 1 ? "" : "s"}`}</span>
          )}
        </div>
      );
    },
  },
  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell({row}) {
      return <DropDownMenuComputerLabItem computerLabItem={row.original}/>
      
    },
  },
];
