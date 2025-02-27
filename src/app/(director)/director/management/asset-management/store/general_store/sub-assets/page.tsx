import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Metadata } from "next";
import { Fragment } from "react";
import { getAllSubAssets } from "@/components/assets/general-asset-manager/sub-assets/action";
import ListOfGeneralStoreItems from "@/components/assets/general-asset-manager/sub-assets/list-of-general-store-items";
import ListOfSubAssets from "@/components/assets/general-asset-manager/sub-assets/list-of-sub-assets";

export const metadata: Metadata = {
  title: "Sub assets",
};
export default async function Page() {
  const assetCategory = AssetCategory.GENERAL_STORE;
  const subAssets = await getAllSubAssets();
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
          { label: "Sub assets" },
        ]}
      />
      <BodyContainer className="flex flex-row gap-6">
        <ListOfSubAssets oldData={subAssets} />
        <ListOfGeneralStoreItems />
      </BodyContainer>
    </Fragment>
  );
}
