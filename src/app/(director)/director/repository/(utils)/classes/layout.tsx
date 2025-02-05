import { webName } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: `%s | Classes - Utility Repository - Director | ${webName} Management System`,
    absolute: ` Classes - Utility Repository - Director | ${webName} Management System`,
    default: ` Classes - Utility Repository - Director | ${webName} Management System`,
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
