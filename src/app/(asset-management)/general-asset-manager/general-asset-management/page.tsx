import HeaderContainer from "@/components/sidebar/header-container";
import { Fragment } from "react";

export default function Page() {
  return (
    <Fragment>
      <HeaderContainer breadCrumbs={[{ label: "General asset management" }]} />
    </Fragment>
  );
}
