import { webName } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: `%s | Subjects - Utility Repository - Director | ${webName} Management System`,
    absolute: ` Subjects - Utility Repository - Director | ${webName} Management System`,
    default: ` Subjects - Utility Repository - Director | ${webName} Management System`,
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
