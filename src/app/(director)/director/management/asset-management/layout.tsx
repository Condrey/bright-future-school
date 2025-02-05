import { webName } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: `%s | Asset Management - Director | ${webName} Management System`,
    absolute: `Asset Management - Director | ${webName} Management System`,
    default: `Asset Management - Director | ${webName} Management System`,
  },
  description:
    "A place for directors to handle asset management such as library, computer lab, science lab, food items, and general assets.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
