import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Fragment } from "react";
import { getClassStreamById } from "../../action";

interface PageProps{
    params:Promise<{classStreamId:string}>
}

export default async  function Page({params}:PageProps){
    const {classStreamId} = await params;
    const id = decodeURIComponent(classStreamId)
    const classStream  = await getClassStreamById(id)
    return <Fragment>
        <HeaderContainer breadCrumbs={[{label:'Report card management',url:`/management/report-card-management`},
            {label:`${classStream?.class?.academicYear?.year}, ${classStream?.class?.class?.name} ${classStream?.stream?.name} stream`}
            ]}/>
        <BodyContainer>
            <h1>Please choose exams</h1>
d        </BodyContainer>
    </Fragment>
}