import BodyContainer from "@/app/(director)/body-container";
import HeaderContainer from "@/app/(director)/header-container";
import prisma from "@/lib/prisma";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import ItemBody from "./item-body";
import { getComputerLabItem, getIndividualComputerLabItem } from "./action";
import ListOfItems from "./(tables)/list-of-tems";

interface PageProps {
  params: Promise<{ itemId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { itemId } = await params;
  const item = await getComputerLabItem(itemId)
  if (!item) throw new Error("Item not found");

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          { label: "Asset management", url: "/management/asset-management/" },
          {
            label: "Computer lab Assets",
            url: `/management/asset-management/store/${AssetCategory.COMPUTER_LAB.toLocaleLowerCase()}`,
          },
          {
            label: `${item.name}`,
          },
        ]}
        className="max-w-[95rem]"
      />
      <BodyContainer>
        {/* list of items  */}
        <ListOfItems oldItem={item}/>
      </BodyContainer>
    </Fragment>
  );
}
