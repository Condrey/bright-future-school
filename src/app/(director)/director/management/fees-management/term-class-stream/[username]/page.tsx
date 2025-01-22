import BodyContainer from "@/app/(director)/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/app/(director)/header-container";
import { Fragment, Suspense } from "react";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer
          breadCrumbs={[
            { label: "Streams", url: "/management/fees-management" },
            {
              label: "Fees management",
              url: "/management/fees-management/term-class-stream",
            },
            { label: username },
          ]}
        />
      </Suspense>
      <BodyContainer>
        {/* TODO: Yet to implement user details */}
        <span>Yet to implement user details </span>
      </BodyContainer>
    </Fragment>
  );
}
