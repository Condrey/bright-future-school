"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { assetItemStatuses } from "@/lib/enums";
import { formatNumber } from "@/lib/utils";
import { AssetItemStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { LibraryIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../add-asset/barrel-file";
import { getAllLibraryItems } from "./action";
import { NumericHolder } from "./numeric-holder";

interface LibraryItemsDetailsProps {}

export default function LibraryItemsDetails({}: LibraryItemsDetailsProps) {
  const { data, status, error, isFetching, refetch } = useQuery({
    queryKey: ["library-items", "summary"],
    queryFn: getAllLibraryItems,
  });

  if (status === "pending") {
    return <Skeleton className="h-56 w-80 lg:h-36" />;
  }
  if (status === "error") {
    console.error(error);
    return null;
  }

  const items = data.summary.flatMap((s) => s.title).filter(Boolean);
  const authors = data.authors.map((a) => a.author).length;
  const categories = data.categories.map((a) => a.category).length;
  const numberOfItems = data.summary
    .map((s) => s.individualBooks.length)
    .reduce((value, total) => value + total, 0);
  return (
    <Card className="flex flex-col lg:flex-row">
      <CardHeader>
        <div className="flex items-center gap-1">
          <LibraryIcon
            strokeWidth={0.8}
            className="size-16 text-muted-foreground"
          />
          <div>
            <CardTitle className="uppercase tracking-wider">Library</CardTitle>
            <CardTitle>{`${formatNumber(data.summary.length)} book${data.summary.length === 1 ? "" : "s"}, ${formatNumber(numberOfItems)} item${numberOfItems === 1 ? "" : "s"}`}</CardTitle>
          </div>
        </div>
        {!!items.length && items.length > 1 && (
          <CardDescription className="max-w-sm">
            including {items.slice(0, 3).join(", ")}
          </CardDescription>
        )}
      </CardHeader>
      <CardHeader>
        <div className="flex flex-row flex-wrap gap-2">
          <NumericHolder count={authors} label="Authors" />
          <NumericHolder count={categories} label="Book categories" />
          {Object.values(AssetItemStatus).map((value) => {
            const _count = data.summary
              .flatMap((s) => s.individualBooks.flatMap((i) => i.status))
              .filter((f) => f === value).length;
            const _label = assetItemStatuses[value];
            return <NumericHolder key={value} count={_count} label={_label} />;
          })}
        </div>
      </CardHeader>
    </Card>
  );
}
