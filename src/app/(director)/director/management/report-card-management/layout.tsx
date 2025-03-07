import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { webName } from "@/lib/utils";
import { Metadata } from "next";
import { Fragment } from "react";
import ListOfClassStreams from "./stream/[classStreamId]/list-of-class-streams";

export const metadata: Metadata = {
  title: {
    template: `%s | Report card Management - Director | ${webName} Management System`,
    absolute: `Report card Management - Director | ${webName} Management System`,
    default: `Report card Management - Director | ${webName} Management System`,
  },
  description:
    "A place for directors to handle report card management for pupils/ students",
};
export default async function Layout({ children }: { children: React.ReactNode }) {
  
  return<div className="flex-row flex gap-4 w-full py-6 px-4">
           <ListOfClassStreams/>
           <div>{children}</div>
        </div>
}
