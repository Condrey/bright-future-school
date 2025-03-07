import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getUser } from "./action";
import UserDetails from "./user-details/user-details";

const getLoggedUser = cache(getUser);
// TODO: rethink 
export async function generateMetadata(
  // parent: ResolvingMetadata,
): Promise<Metadata> {
  const { user: pupil } = await getLoggedUser();
  if (!pupil) return notFound();
  const { name, email, telephone, username, avatarUrl } = pupil;
  // const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${name} - ${telephone || email || `$${username}`}`,
    description: `Details of ${name} - ${telephone || email || `$${username}`}, including fees payments and class streams attended over the years`,
    // openGraph: {
    //   images: !avatarUrl ? previousImages : [avatarUrl, ...previousImages],
    // },
  };
}

export default async function Page() {
  const pupil = await getLoggedUser();
  return (
    <div>
      <UserDetails oldPupil={pupil} />
    </div>
  );
}
