import SessionProvider from "@/app/session-provider";
import { validateRequest } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import UnauthorizedUser from "./unauthorized-user";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, user } = await validateRequest();

  if (!user) redirect("/login");
  const isAuthorized =
    user.role === Role.DIRECTOR || user.role === Role.SUPER_ADMIN;

  if (!isAuthorized) return <UnauthorizedUser />;
  return (
    <SessionProvider value={{ session, user }}>
      <div className="px-4: mx-auto flex size-full max-w-[100rem] grow gap-5">
        {children}
      </div>
    </SessionProvider>
  );
}
