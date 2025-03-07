import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Metadata } from "next";
import { Fragment } from "react";
import { getAllFoodStoreSuppliers } from "@/components/assets/food-store/suppliers/action";
import ListOfSuppliers from "@/components/assets/food-store/suppliers/list-of-suppliers";
import SupplierFoodItems from "@/components/assets/food-store/suppliers/supplier-food-items";

export const metadata: Metadata = {
  title: "Food store suppliers",
};
export default async function Page() {
  const assetCategory = AssetCategory.FOOD_STORE;
  const suppliers = await getAllFoodStoreSuppliers();
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: "Asset management",
            url: `/management/asset-management/`,
          },
          {
            label: assetCategories[assetCategory].label + "s",
            url: `/management/asset-management/store/${assetCategory.toLocaleLowerCase()}`,
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
