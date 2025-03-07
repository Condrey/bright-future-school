import ListOfItems from "@/components/assets/food-store/view/(tables)/list-of-items";
import { getFoodStoreItem } from "@/components/assets/food-store/view/action";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";

interface PageProps {
  params: Promise<{ itemId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { itemId } = await params;
  const item = await getFoodStoreItem(itemId);
  if (!item) throw new Error("Item not found");

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          { label: "Asset management", url: "/management/asset-management/" },
          {
            label: "Food Store Assets",
            url: `/management/asset-management/store/${AssetCategory.FOOD_STORE.toLocaleLowerCase()}`,
          },
          {
            label: `${item.foodName} `,
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
