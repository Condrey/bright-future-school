import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Fragment } from "react";
import { getClassStreamById } from "../../action";
import { getExamById } from "./action";

interface PageProps {
  params: Promise<{ examId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { examId } = await params;
  const id = decodeURIComponent(examId);

  const [classStream, exam] = await Promise.all([
    getClassStreamById(id),
    getExamById(id),
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
      <BodyContainer>rr</BodyContainer>
    </Fragment>
  );
}
