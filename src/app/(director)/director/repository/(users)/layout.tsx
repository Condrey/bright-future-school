import { webName } from "@/lib/utils";
import { Metadata } from "next";
import BannerContainer from "./banner-container";

export const metadata: Metadata = {
  title: {
    template: `%s | User Repository - Director | ${webName} Management System`,
    absolute: `User Repository - Director | ${webName} Management System`,
    default: `User Repository - Director | ${webName} Management System`,
  },
  description:
    "A place for directors to handle user Repository for pupils/ students, teaching and non teaching staffs",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-full flex-col space-y-2">
      <BannerContainer />
      {children}
    </div>
  );
}
