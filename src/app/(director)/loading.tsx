import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex size-full min-h-dvh flex-col items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
