import { staffTypes } from "@/lib/enums";
import { webName } from "@/lib/utils";
import { StaffType } from "@prisma/client";
import { Metadata } from "next";

const staffType = StaffType.TEACHING_STAFF;
export const metadata: Metadata = {
  title: {
    template: `%s | ${staffTypes[staffType].label} | User Repository - Director | ${webName} Management System`,
    absolute: `${staffTypes[staffType].label} | User Repository - Director | ${webName} Management System`,
    default: `${staffTypes[staffType].label} | User Repository - Director | ${webName} Management System`,
  },
  description: staffTypes[staffType].description,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
