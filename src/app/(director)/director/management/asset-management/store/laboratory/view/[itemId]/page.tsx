import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import ListOfItems from "@/components/assets/laboratory/view/(tables)/list-of-items";
import { getLaboratoryItem } from "@/components/assets/laboratory/view/action";

interface PageProps {
  params: Promise<{ itemId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { itemId } = await params;
  const item = await getLaboratoryItem(decodeURIComponent(itemId));
  if (!item) throw new Error("Item not found");

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          { label: "Asset management", url: "/management/asset-management/" },
          {
            label: "Laboratory Assets",
            url: `/management/asset-management/store/${AssetCategory.LABORATORY.toLocaleLowerCase()}`,
          },
          {
            label: `${item.name} variants`,
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
