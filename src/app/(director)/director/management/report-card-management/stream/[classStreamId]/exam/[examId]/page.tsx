import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { getClassStreamWithPupilsAndExams } from "./action";
import Content from "./content";

interface PageProps {
  params: Promise<{ examId: string; classStreamId: string }>;
}

export default async function Page({ params }: PageProps) {
  const parameters = await params;
  const examId = decodeURIComponent(parameters.examId);

  const exam = await getClassStreamWithPupilsAndExams({
    examId,
  });
  if (!exam) return notFound();

  const classValue = exam.classTerm.classStream?.class;
  const classStream = exam.classTerm.classStream;

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: "Report card management",
            url: `/management/report-card-management`,
          },
          {
            label: `${classValue?.academicYear?.year}, ${classValue?.class?.name} ${classStream?.stream?.name} stream`,
            url: `/management/report-card-management/stream/${classStream?.id}`,
          },
          {
            label: `${exam.examName}, ${exam.classTerm.term?.term} `,
          },
        ]}
      />
      <BodyContainer>
        <Content exam={exam} />
      </BodyContainer>
    </Fragment>
  );
}
