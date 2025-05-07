"use client";

import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { DataTable } from "@/components/ui/data-table";
import { ExamData, PupilDataSelect } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { getExamByIdAndPupils } from "./action";
import ButtonUpdateExamSubjects from "./button-update-exam-subjects";
import { createTableRows, usePupilsColumn } from "./columns";
import { PlusIcon } from "lucide-react";
import { YearContainer } from "@/components/year-container";

interface ListOfPupilsProps {
  examAndPupils: { exam: ExamData | null; pupils: PupilDataSelect[] };
}
export default function ListOfPupils({ examAndPupils }: ListOfPupilsProps) {
  const { exam, pupils } = examAndPupils;
  if (!exam) return notFound();
  const query = useQuery({
    queryKey: ["exam-with-pupils", exam.id],
    queryFn: async () => getExamByIdAndPupils(exam.id),
    initialData: examAndPupils,
  });

  const { data, status } = query;
  const academicYearClass = exam.classTerm.classStream?.class;
  const year = academicYearClass?.academicYear?.year;
  const className = academicYearClass?.class?.slug;
  const classStream = exam.classTerm.classStream;
  const stream = classStream?.stream?.name;
  const classNameWithYear = `${year} ${(className || "").toUpperCase()} ${stream}`;

  if(status==='error') return  <ErrorContainer
  errorMessage="Error fetching examination or test"
  query={query}
/>
if(status === "success" && !data.exam?.examSubjects.length) return  <EmptyContainer
message={
  "There are no subjects added for this test/ exam yet. Please add!"
}
>
<ButtonUpdateExamSubjects exam={exam} variant={"secondary"}>
  Add subject
</ButtonUpdateExamSubjects>
</EmptyContainer>


  const baseFields =  ['id',
    'pupil',
    'examSubjects',
    'agg',
    'position',]
    const tableData = createTableRows({
      examScores: data?.exam?.examSubjects.flatMap(
        (s) => s.examScores,
      )!,
      examSubjectList: data?.exam?.examSubjects!,
      pupils: data.pupils,
    })
    const subjectNames = Object.keys(tableData[0]).filter(
      key => !baseFields.includes(key)
    );

  return (
    <div>
     
        <div className="space-y-6">
          <div className="gap-3 flex justify-between items-center">
            <h1 className="text-lg"><YearContainer year={year}/> {className} {stream} <span className="block sm:inline text-xs sm:text-lg">({exam.examName} - {exam.classTerm.term?.term})</span></h1>
          <ButtonUpdateExamSubjects exam={exam} variant={"default"}>
            <PlusIcon/>subject
          </ButtonUpdateExamSubjects>
          </div>
          <DataTable
            columns={usePupilsColumn(subjectNames)}
            data={tableData}
            filterColumn={{id:'pupil_user_name',label:'pupil/ student name'}}
          />
        </div>
    
    </div>
  );
}
