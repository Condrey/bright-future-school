import { webName } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: `%s | Report card Management - Director | ${webName} Management System`,
    absolute: `Report card Management - Director | ${webName} Management System`,
    default: `Report card Management - Director | ${webName} Management System`,
  },
  description:
    "A place for directors to handle report card management for pupils/ students",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
