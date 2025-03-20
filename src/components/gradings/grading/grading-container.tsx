import { Grading } from "@prisma/client";

interface GradingContainerProps {
  grading: Grading;
}

export default function GradingContainer({ grading }: GradingContainerProps) {
  return (
    <div className="grid grid-flow-col-dense grid-cols-2 gap-2 text-sm font-normal">
      <span className="w-full">
        {grading.from} - {grading.to}
      </span>
      <span className="">
        (<span className="font-bold">{grading.grade}</span>
        {", "}
        <span className="italic">{grading.remarks}</span>)
      </span>
    </div>
  );
}
