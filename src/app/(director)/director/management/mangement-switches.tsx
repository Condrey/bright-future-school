import TermSwitcher, {
  TermSwitcherFallback,
} from "@/app/(director)/term-switcher";
import YearSwitcher, {
  YearSwitcherFallback,
} from "@/app/(director)/year-switcher";
import { Suspense } from "react";

interface ManagementSwitchersProps {
  yearPathnameEndPoint?: string;
  termPathnameEndPoint?: string;
}

export default function ManagementSwitches({
  yearPathnameEndPoint,
  termPathnameEndPoint,
}: ManagementSwitchersProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {!!yearPathnameEndPoint && (
        <Suspense fallback={<YearSwitcherFallback />}>
          <YearSwitcher
            pathname={`/director/management/${yearPathnameEndPoint}`}
          />
        </Suspense>
      )}
      {!!termPathnameEndPoint && (
        <Suspense fallback={<TermSwitcherFallback />}>
          <TermSwitcher
            pathname={`/director/management/${termPathnameEndPoint}`}
          />
        </Suspense>
      )}
    </div>
  );
}
