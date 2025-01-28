import { cn, formatNumber } from "@/lib/utils";

export const NumericHolder = ({
  className,
  label,
  count,
}: {
  className?: string;
  label: string;
  count: number;
}) => {
  return (
    <div
      className={cn(
        "flex aspect-square w-24 max-w-24 flex-none flex-col items-center justify-between rounded-md border p-2",
        className,
      )}
    >
      <h1 className="w-full text-center font-mono text-xl font-bold">
        {formatNumber(count)}
      </h1>
      <span className="w-full text-center text-sm font-normal uppercase tracking-tighter">
        {label}
      </span>
    </div>
  );
};
