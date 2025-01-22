import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/user-avatar";
import { ClassStreamData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface ClassDetailsProps {
  classStream: ClassStreamData | null;
}

export default function ClassDetails({ classStream }: ClassDetailsProps) {
  if (!classStream) return null;
  const classTeacher = classStream?.classTeacher?.user;
  const name = classTeacher?.name;
  const avatarUrl = classTeacher?.avatarUrl;
  const description =
    classTeacher?.telephone ||
    classTeacher?.email ||
    `@${classTeacher?.username}`;
  const pupilNumber = classStream._count.pupils || 0;
  const year = classStream?.class?.academicYear?.year;
  const currentYear = new Date().getFullYear();

  return (
    <div className="hidden flex-row justify-evenly gap-3 divide-x-2 rounded-md bg-card p-4 shadow-md md:flex-col md:divide-x-0 lg:flex">
      <div className="flex flex-col gap-1">
        <div className="font-bold">
          <Badge
            variant={
              Number(year || 0) === currentYear
                ? "go"
                : Number(year || 0) < currentYear
                  ? "destructive"
                  : "warn"
            }
          >
            {year}
          </Badge>{" "}
          • {classStream.class?.class?.name} class
        </div>
        <span className="text-xs text-muted-foreground">
          {classStream.class?.class?.level?.name} level
        </span>
        <span>{classStream.stream?.name} stream</span>
        <div>
          {" "}
          {pupilNumber === 0 ? (
            <Badge variant={"destructive"}>Not assigned</Badge>
          ) : pupilNumber === 1 ? (
            "1 pupil/ students"
          ) : (
            `${formatNumber(pupilNumber)} pupils/ students`
          )}
        </div>
      </div>
      <hr />
      <div className="ps-2">
        <div className="font-bold">Class teacher</div>
        {!classTeacher ? (
          <Badge variant={"destructive"}>Not assigned</Badge>
        ) : (
          <div className="flex flex-wrap gap-3">
            <UserAvatar avatarUrl={avatarUrl} />
            <div className="5 flex flex-col gap-0">
              <div>{name}</div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
