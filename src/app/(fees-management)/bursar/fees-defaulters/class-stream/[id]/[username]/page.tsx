import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import prisma from "@/lib/prisma";
import { userDataSelect } from "@/lib/types";
import { cache, Fragment } from "react";

interface PageProps {
  params: Promise<{ username: string }>;
}

async function userDetails(username: string) {
  const data = await prisma.user.findUnique({
    where: { username },
    select: userDataSelect,
  });
  return data;
}
const getCachedUserDetails = cache(userDetails);

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const user = await getCachedUserDetails(username);
  return {
    title: `${user?.name} fees payment details`,
  };
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  const user = await getCachedUserDetails(username);
  return (
    <Fragment>
      <HeaderContainer />
      <BodyContainer>
        <h1 className="text-xl">
          {user?.name}, {user?.telephone || user?.email || `@${user?.username}`}
        </h1>
      </BodyContainer>
    </Fragment>
  );
}
