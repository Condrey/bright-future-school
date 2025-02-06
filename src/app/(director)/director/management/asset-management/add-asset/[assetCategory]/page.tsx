import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import FormComputerLab from "./(computer-lab)/form-computer-lab";
import FormFoodStore from "./(food-store)/form-food-store";
import FormGeneralStore from "./(general-store)/form-general-store";
import FormLaboratory from "./(lab)/form-laboratory";
import FormLibrary from "./(library)/form-library";

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
          { label: "Asset management", url: "/management/asset-management/" },
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
