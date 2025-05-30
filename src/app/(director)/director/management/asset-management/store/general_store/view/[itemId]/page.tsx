import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import ListOfItems from "@/components/assets/general-asset-manager/view/(tables)/list-of-items";
import { getGeneralStoreItem } from "@/components/assets/general-asset-manager/view/action";

interface PageProps {
  params: Promise<{ itemId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { itemId } = await params;
  const item = await getGeneralStoreItem(itemId);
  if (!item) throw new Error("Item not found");

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          { label: "Asset management", url: "/management/asset-management/" },
          {
            label: "General Store Assets",
            url: `/management/asset-management/store/${AssetCategory.GENERAL_STORE.toLocaleLowerCase()}`,
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
