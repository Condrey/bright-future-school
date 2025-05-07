import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { getExamByIdAndPupils } from "./action";
import ListOfPupils from "./list-of-pupils";

interface PageProps {
  params: Promise<{ examId: string }>;
}
export default async function Page({ params }: PageProps) {
  const { examId } = await params;
  const id = decodeURIComponent(examId);
  const { exam, pupils } = await getExamByIdAndPupils(id);
  if (!exam) return notFound();
  const academicYearClass = exam.classTerm.classStream?.class;
  const year = academicYearClass?.academicYear?.year;
  const className = academicYearClass?.class?.slug;
  const classStream = exam.classTerm.classStream;
  const stream = classStream?.stream?.name;
  const classNameWithYear = `${year} ${(className || "").toUpperCase()} ${stream}`;
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          { label: `Tests & exams`, url: `/exams` },
          {
            label: `${classNameWithYear}`,
            url: `/exams/class-stream/${classStream?.id}`,
          },
          { label: `${exam.examName}` },
        ]}
      />
      <BodyContainer>
        <ListOfPupils examAndPupils={{ exam, pupils }} />
      </BodyContainer>
    </Fragment>
  );
}
