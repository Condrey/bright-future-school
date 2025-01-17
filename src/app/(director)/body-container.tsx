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
    <div className={cn("flex flex-1 flex-col gap-4 p-4 pt-0", className)}>
      {children}{" "}
    </div>
  );
}
