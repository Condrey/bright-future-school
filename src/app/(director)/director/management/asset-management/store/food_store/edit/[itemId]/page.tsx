import FormFoodStore from "@/components/assets/add-assets/(food-store)/form-food-store";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import prisma from "@/lib/prisma";
import { foodStoreItemDataInclude } from "@/lib/types";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";

interface PageProps {
  params: Promise<{ itemId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { itemId } = await params;
  const item = await prisma.foodStoreItem.findUnique({
    where: { id: decodeURIComponent(itemId) },
    include: foodStoreItemDataInclude,
  });
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
            label: `Update ${item.foodName}`,
          },
        ]}
        className="max-w-[95rem]"
      />
      <BodyContainer className="max-w-[95rem]">
        <FormFoodStore foodStoreItemToEdit={item} />
      </BodyContainer>
    </Fragment>
  );
}
