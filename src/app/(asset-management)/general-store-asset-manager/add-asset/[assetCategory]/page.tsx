import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import FormComputerLab from "@/components/assets/add-assets/(computer-lab)/form-computer-lab";
import FormFoodStore from "@/components/assets/add-assets/(food-store)/form-food-store";
import FormGeneralStore from "@/components/assets/add-assets/(general-store)/form-general-store";
import FormLaboratory from "@/components/assets/add-assets/(lab)/form-laboratory";
import FormLibrary from "@/components/assets/add-assets/(library)/form-library";

interface PageProps {
  params: Promise<{ assetCategory: string }>;
}

export default async function Page({ params }: PageProps) {
  const { assetCategory } = await params;

  const assetCategories: Record<
    AssetCategory,
    { label: string; node: React.ReactNode }
  > = {
    LIBRARY: { label: "Library item", node: <FormLibrary /> },
    COMPUTER_LAB: { label: "Computer lab item", node: <FormComputerLab /> },
    LABORATORY: { label: "Laboratory item", node: <FormLaboratory /> },
    GENERAL_STORE: { label: "General store item", node: <FormGeneralStore /> },
    FOOD_STORE: { label: "Food store item", node: <FormFoodStore /> },
  };
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: "General asset management",
            url: "/general-asset-management",
          },
          {
            label: `Add ${assetCategories[assetCategory.toUpperCase() as AssetCategory].label.toLocaleLowerCase()}`,
          },
        ]}
        className="max-w-[95rem]"
      />
      <BodyContainer className="max-w-[95rem]">
        {assetCategories[assetCategory.toUpperCase() as AssetCategory].node}
      </BodyContainer>
    </Fragment>
  );
}
