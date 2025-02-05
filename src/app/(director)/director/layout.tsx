import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { webName } from "@/lib/utils";
import { Metadata } from "next";
import { AppSidebar } from "../app-side-bar";

export const metadata: Metadata = {
  title: {
    template: `%s | Director | ${webName} Management System`,
    absolute: `Director | ${webName} Management System`,
    default: `Director | ${webName} Management System`,
  },
  description:
    "A point where directors can use the School management system For School fees, report cards, and asset management.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="w-full">
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
