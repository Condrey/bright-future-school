import { webName } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: `%s | Academic years - Utility Repository - Director | ${webName} Management System`,
    absolute: ` Academic years - Utility Repository - Director | ${webName} Management System`,
    default: ` Academic years - Utility Repository - Director | ${webName} Management System`,
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
