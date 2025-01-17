import { DirectorDashboardParam } from "@/lib/types";
import { cn, formatNumber, webName } from "@/lib/utils";
import { CheckCheckIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface UtilitySetupComponentProps {
  dashboardParams: DirectorDashboardParam;
}
interface DirectorDashboardParamComponent {
  title: string;
  url: string;
  showIndicator: boolean;
  isVisible: boolean;
  description: string;
}

export default function UtilitySetupComponent({
  dashboardParams,
}: UtilitySetupComponentProps) {
  const basePathname = "/director/repository";
  const searchParams = useSearchParams();
  const components = getComponents(dashboardParams);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="mx-auto w-full max-w-prose">
        <header className="cursor-pointer text-center text-2xl font-bold tracking-tighter">
          Incomplete utility components setup.
        </header>
        <section>
          <p className="text-center">
            We noticed that you have not completed the utility components set up
            required for the smooth operation of <cite>{webName}</cite>. This
            utility components include; level, class, stream, term, academic
            year, among others.
          </p>
        </section>
      </div>
      {/* steps of completion */}
      <div className="mx-auto grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {components.map((item, index, array) => (
          <Link
            key={item.title}
            href={basePathname + "/" + item.url + "?" + searchParams.toString()}
            className={cn(
              "cols group relative flex max-w-sm auto-cols-max flex-col items-center gap-3 rounded-md p-4",
              item.isVisible
                ? "cursor-pointer bg-primary/95 text-primary-foreground transition-colors hover:bg-primary"
                : "pointer-events-none cursor-not-allowed bg-secondary text-secondary-foreground",
            )}
          >
            <CheckCheckIcon
              className={cn(
                "absolute right-4 top-4",
                item.showIndicator && "hidden",
              )}
            />
            <h2 className="text-center text-xl italic">{`Step ${formatNumber(index + 1)} of ${formatNumber(array.length)}`}</h2>
            <h1
              className={cn(
                "text-center text-2xl font-bold tracking-tight",
                item.isVisible &&
                  "transition-all group-hover:scale-110 group-hover:underline",
              )}
            >
              {item.title}
            </h1>
            <p className="text-center">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function UtilitySetupComponentFallback() {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin" />
    </div>
  );
}

function getComponents(
  dashboardParams: DirectorDashboardParam,
): DirectorDashboardParamComponent[] {
  const { academicYears, classStreams, classes, levels, streams, terms } =
    dashboardParams;

  const components: DirectorDashboardParamComponent[] = [
    {
      title: "Levels",
      url: "levels",
      showIndicator: levels < 1,
      isVisible: true,
      description:
        "To represent the overall stage of education, such as primary, secondary, providing a framework for organizing students based on academic progression.",
    },
    {
      title: "Classes",
      url: "classes",
      showIndicator: classes < 1,
      isVisible: levels > 0,
      description:
        "It groups students within a level, to study together under a shared curriculum, typically defined by a grade or academic year.",
    },
    {
      title: "Streams",
      url: "streams",
      showIndicator: streams < 1,
      isVisible: classes > 0,
      description:
        "This subdivides a class so as to manage large student population more effectively. and or, to group students by academic ability.",
    },
    {
      title: "Terms",
      url: "terms",
      showIndicator: terms < 1,
      isVisible: streams > 0,
      description:
        "A distinct portion of the academic year. Often divided into quarters, trimesters, or semesters.Helps in structuring school calendar and learning activities.",
    },
    {
      title: "Academic years",
      url: "years",
      showIndicator: academicYears < 1,
      isVisible: terms > 0 && streams > 0 && classes > 0,
      description:
        "Provides grouping for a full circle of learning activities and assessments over a predefined period.",
    },
  ];
  return components;
}
