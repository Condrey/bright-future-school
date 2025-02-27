import { getAllFoodStoreSuppliers } from "@/components/assets/food-store/suppliers/action";
import ListOfSuppliers from "@/components/assets/food-store/suppliers/list-of-suppliers";
import SupplierFoodItems from "@/components/assets/food-store/suppliers/supplier-food-items";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Food store suppliers",
};
export default async function Page() {
  const assetCategory = AssetCategory.FOOD_STORE;
  const category = assetCategories[assetCategory];
  const suppliers = await getAllFoodStoreSuppliers();
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: `${category.label} management`,
            url: "/food-store-asset-management",
          },
          { label: "Food store suppliers" },
        ]}
      />
      <BodyContainer className="flex flex-row gap-6">
        <ListOfSuppliers
          oldData={
            suppliers as { name: string; contactInfo: string; id: string }[]
          }
        />
        <SupplierFoodItems />
      </BodyContainer>
    </Fragment>
  );
}
