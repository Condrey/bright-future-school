import FormFoodStore from "@/components/assets/add-assets/(food-store)/form-food-store";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import prisma from "@/lib/prisma";
import { foodStoreItemDataInclude } from "@/lib/types";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";

interface PageProps {
  params: Promise<{ itemId: string }>;
}
const assetCategory = AssetCategory.FOOD_STORE;
const category = assetCategories[assetCategory];

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
          {
            label: `${category.label} management`,
            url: "/food-store-asset-management",
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
