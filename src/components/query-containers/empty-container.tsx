import { cn } from "@/lib/utils";

interface EmptyContainerProps {
  message: String;
  className?: string;
  children?: React.ReactNode;
}
export default function EmptyContainer({
  message,
  className,
  children,
}: EmptyContainerProps) {
  return (
    <div
      className={cn(
        "flex min-h-[20rem] flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <p className="max-w-sm text-center text-muted-foreground">{message}</p>
      {children}
    </div>
  );
}
