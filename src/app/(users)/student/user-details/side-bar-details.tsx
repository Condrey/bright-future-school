import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import UserAvatar from "@/components/user-avatar";
import { PupilData } from "@/lib/types";
import { LucideVerified } from "lucide-react";
import { notFound } from "next/navigation";

interface SideBarDetailsProps {
  pupil: PupilData;
}

export default function SideBarDetails({ pupil }: SideBarDetailsProps) {
  if (!pupil.user) return notFound();
  const { name, email, telephone, username, avatarUrl, bio, isVerified } =
    pupil.user;

  return (
    <div className="flex size-full max-w-sm flex-col gap-4">
      {/* Default info  */}
      <div className="flex w-full flex-col items-center">
        <UserAvatar avatarUrl={avatarUrl} size={100} />
        <div className="flex items-center gap-1">
          <h1 className="text-2xl font-semibold">{name}</h1>
          {isVerified && (
            <LucideVerified className="size-6 fill-green-500 text-background" />
          )}{" "}
        </div>
        <p className="text-lg">{`@${username}`}</p>
        <p className="text-sm text-muted-foreground">{email || "No email"}</p>
        <p className="text-sm text-muted-foreground">
          {telephone || "No telephone"}
        </p>
        <div className=""></div>
      </div>
      <hr />
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
