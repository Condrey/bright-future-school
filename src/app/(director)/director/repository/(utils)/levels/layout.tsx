import { webName } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: `%s | Levels - Utility Repository - Director | ${webName} Management System`,
    absolute: ` Levels - Utility Repository - Director | ${webName} Management System`,
    default: ` Levels - Utility Repository - Director | ${webName} Management System`,
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
