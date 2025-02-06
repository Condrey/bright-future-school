import { cn } from "@/lib/utils";

interface BodyContainerProps {
  children: React.ReactNode;
  className?: string;
}
export default function BodyContainer({
  children,
  className,
}: BodyContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto flex size-full max-w-[80rem] flex-1 grow flex-col gap-5 p-4 px-4 py-6 pt-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
