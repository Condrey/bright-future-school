import YearSwitcher, {
  YearSwitcherFallback,
} from "@/app/(director)/year-switcher";
import { Suspense } from "react";

interface UsersSwitchersProps {
  yearPathnameEndPoint?: string;
}

export default function UsersSwitches({
  yearPathnameEndPoint,
}: UsersSwitchersProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {!!yearPathnameEndPoint && (
        <Suspense fallback={<YearSwitcherFallback />}>
          <YearSwitcher
            pathname={`/director/repository/${yearPathnameEndPoint}`}
          />
        </Suspense>
      )}
    </div>
  );
}
