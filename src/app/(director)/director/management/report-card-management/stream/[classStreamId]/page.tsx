import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Fragment } from "react";
import { getAllTermsWithExams } from "../../action";
import { getClassStreamById } from "./action";
import ListOfExams from "./list-of-exams";

interface PageProps {
  params: Promise<{ classStreamId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { classStreamId } = await params;
  const id = decodeURIComponent(classStreamId);

  const [classStream, classTerms] = await Promise.all([
    getClassStreamById(id),
    getAllTermsWithExams(id),
  ]);

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: "Report card management",
            url: `/management/report-card-management`,
          },
          {
            label: `${classStream?.class?.academicYear?.year}, ${classStream?.class?.class?.name} ${classStream?.stream?.name} stream`,
          },
        ]}
      />
      <BodyContainer>
        <ListOfExams
          classStreamId={id}
          academicYearClassId={classStream?.classId!}
          classTerms={classTerms}
        />
      </BodyContainer>
    </Fragment>
  );
}
