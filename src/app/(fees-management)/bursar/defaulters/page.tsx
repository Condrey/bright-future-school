import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Fragment } from "react";

export default function Page(){
    return <Fragment>
        <HeaderContainer breadCrumbs={[{label:'Defaulters'}]}/>
        <BodyContainer>
        <h1 className="text-xl">{new Date().getFullYear()} fees defaulters</h1>
        </BodyContainer>
    </Fragment>
}