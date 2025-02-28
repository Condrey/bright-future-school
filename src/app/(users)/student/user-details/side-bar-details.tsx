import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import UserAvatar from "@/components/user-avatar";
import { PupilData } from "@/lib/types";
import { notFound } from "next/navigation";

interface SideBarDetailsProps {
  pupil: PupilData;
}

export default function SideBarDetails({ pupil }: SideBarDetailsProps) {
  if (!pupil.user) return notFound();
  const { name, email, telephone, username, avatarUrl, bio } = pupil.user;

  return (
    <div className="flex max-w-sm size-full flex-col gap-4">
      {/* Default info  */}
      <div className="flex w-full flex-col items-center">
        <UserAvatar avatarUrl={avatarUrl} size={100} />
        <h1 className="text-2xl font-semibold">{name}</h1>
        <p className="text-lg">{`@${username}`}</p>
        <p className="text-sm text-muted-foreground">{email || "No email"}</p>
        <p className="text-sm text-muted-foreground">
          {telephone || "No telephone"}
        </p>
        <div className=""></div>
      </div>

      {/* The bio  */}
      <div className="flex w-full flex-col items-center">
        <h1 className="text-2xl font-semibold">Bio</h1>
        {!bio ? (
          <p className="text-muted-foreground">No bio added</p>
        ) : (
          <TipTapViewer content={bio} />
        )}
      </div>
    </div>
  );
}
