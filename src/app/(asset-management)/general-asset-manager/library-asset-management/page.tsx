import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";

const assetCategory = AssetCategory.LIBRARY;
export const category = assetCategories[assetCategory];

export const metadata = {
  title: category.label,
};

export default function Page() {
  return (
    <Fragment>
      <HeaderContainer breadCrumbs={[{ label: `${category.label} management` }]} />
      <BodyContainer>
        To display graphs and charts here, not yet implemented{" "}
      </BodyContainer>
    </Fragment>
  );
}
