import { ListOfIndividualFoodStoreItems } from "@/components/assets/food-store/(tables)/list-of-individual-food-store-items";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";

const assetCategory = AssetCategory.FOOD_STORE;
const category = assetCategories[assetCategory];

export const metadata = {
  title: category.label,
};

export default function Page() {
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[{ label: `${category.label} management` }]}
      />
      <BodyContainer>
        <ListOfIndividualFoodStoreItems />
      </BodyContainer>
    </Fragment>
  );
}
