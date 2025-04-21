import FormComputerLab from "@/components/assets/add-assets/(computer-lab)/form-computer-lab";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import prisma from "@/lib/prisma";
import { computerLabItemDataInclude } from "@/lib/types";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";

interface PageProps {
  params: Promise<{ itemId: string }>;
}
const assetCategory = AssetCategory.COMPUTER_LAB;
const category = assetCategories[assetCategory];
export default async function Page({ params }: PageProps) {
  const { itemId } = await params;
  const item = await prisma.computerLabItem.findUnique({
    where: { id: itemId },
    include: computerLabItemDataInclude,
  });
  if (!item) throw new Error("Item not found");

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: `${category.label} management`,
            url: "/computer-lab-asset-management",
          },
          {
            label: `Update ${item.name}`,
          },
        ]}
        className="max-w-[95rem]"
      />
      <BodyContainer className="max-w-[95rem]">
        <FormComputerLab computerLabItemToEdit={item} />
      </BodyContainer>
    </Fragment>
  );
}
