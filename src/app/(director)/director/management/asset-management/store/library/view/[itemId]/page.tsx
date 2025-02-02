import BodyContainer from "@/app/(director)/body-container";
import HeaderContainer from "@/app/(director)/header-container";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import ListOfItems from "./(tables)/list-of-items";
import { getLibraryItem } from "./action";

interface PageProps {
  params: Promise<{ itemId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { itemId } = await params;
  const item = await getLibraryItem(itemId);
  if (!item) throw new Error("Item not found");

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          { label: "Asset management", url: "/management/asset-management/" },
          {
            label: "Library Assets",
            url: `/management/asset-management/store/${AssetCategory.LIBRARY.toLocaleLowerCase()}`,
          },
          {
            label: `${item.author} ${item.title} books`,
          },
        ]}
      />
      <BodyContainer>
        {/* list of items  */}
        <ListOfItems oldItem={item} />
      </BodyContainer>
    </Fragment>
  );
}
