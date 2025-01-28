import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";
import { BookStatus } from "@prisma/client";
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
  const {
    data: summary,
    status,
    error,
    isFetching,
    refetch,
  } = useQuery({
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

  const booksBorrowed = summary
    .flatMap((s) => s.status)
    .filter((f) => f === BookStatus.BORROWED).length;
  const booksAvailable = summary
    .flatMap((s) => s.status)
    .filter((f) => f === BookStatus.AVAILABLE).length;
  const booksDamaged = summary
    .flatMap((s) => s.status)
    .filter((f) => f === BookStatus.DAMAGED).length;
  const items = summary.flatMap((s) => s.title).filter(Boolean);
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
            <CardTitle>{`${formatNumber(summary.length)} book${summary.length === 1 ? "" : "s"}`}</CardTitle>
          </div>
        </div>
        {!!items.length && items.length > 1 && (
          <CardDescription className="max-w-sm">
            including {items.slice(0, 3).join(", ")}
          </CardDescription>
        )}
      </CardHeader>
      <CardHeader>
        <div className="flex flex-row gap-2">
          <NumericHolder count={booksAvailable} label="Available" />
          <NumericHolder count={booksBorrowed} label="Borrowed" />
          <NumericHolder count={booksDamaged} label="Damaged" />
        </div>
      </CardHeader>
    </Card>
  );
}
