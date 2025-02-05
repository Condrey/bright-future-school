import { webName } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: `%s | Fees Management - Director | ${webName} Management System`,
    absolute: `Fees Management - Director | ${webName} Management System`,
    default: `Fees Management - Director | ${webName} Management System`,
  },
  description:
    "A place for directors to handle fees management for pupils/ students",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
