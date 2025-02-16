import UnauthorizedUser from "@/app/(director)/unauthorized-user";
import SessionProvider from "@/app/session-provider";
import { validateRequest } from "@/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { myPrivileges, userRoles } from "@/lib/enums";
import { webName } from "@/lib/utils";
import { Role } from "@prisma/client";
import { Metadata } from "next";
import { redirect } from "next/navigation";

const role = Role.GENERAL_STORE_ASSET_CARETAKER;
const { label: roleLabel, description: roleDescription } = userRoles[role];
export const metadata: Metadata = {
  title: {
    template: `%s | ${roleLabel} - ${webName} Management System`,
    absolute: `${roleLabel} - ${webName} Management System`,
    default: `${roleLabel} - ${webName} Management System`,
  },
  description: roleDescription,
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, user } = await validateRequest();

  if (!user) redirect("/login");
  if (!user.isVerified) redirect(`/user-verification/${user.id}`);

  const isAuthorized = myPrivileges[user.role].includes(role);

  if (!isAuthorized) return <UnauthorizedUser />;
  return (
    <SessionProvider value={{ session, user }}>
      <SidebarProvider>
        <div className="size-full">{children}</div>
      </SidebarProvider>
    </SessionProvider>
  );
}
