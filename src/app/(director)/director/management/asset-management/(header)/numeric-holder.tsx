import { cn, formatCurrency, formatNumber } from "@/lib/utils";

interface NumericHolderProps {
  className?: string;
  label: string;
  count: number;
  isCurrency?: boolean;
}

export const NumericHolder = ({
  className,
  label,
  count,
  isCurrency = false,
}: NumericHolderProps) => {
  return (
    <div
      className={cn(
        "flex aspect-square w-24 max-w-24 flex-none flex-col items-center justify-between rounded-md border p-2 lg:max-w-28",
        isCurrency && "aspect-auto w-fit max-w-fit lg:max-w-fit",
        className,
      )}
    >
      <h1
        className={cn(
          "w-full text-center font-mono text-xl font-bold",
          isCurrency && "font-normal",
        )}
      >
        {isCurrency ? formatCurrency(count) : formatNumber(count)}
      </h1>
      <span
        className={cn(
          "line-clamp-2 w-full text-ellipsis break-words text-center text-sm font-normal uppercase tracking-tighter",
          isCurrency && "capitalize text-muted-foreground",
        )}
      >
        {label}
      </span>
    </div>
  );
};
