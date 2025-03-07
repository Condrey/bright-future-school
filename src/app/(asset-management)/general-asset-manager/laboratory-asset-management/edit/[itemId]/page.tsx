import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import prisma from "@/lib/prisma";
import { laboratoryItemDataInclude } from "@/lib/types";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import FormLaboratory from "@/components/assets/add-assets/(lab)/form-laboratory";
import { assetCategories } from "@/lib/enums";

interface PageProps {
  params: Promise<{ itemId: string }>;
}
  const assetCategory = AssetCategory.LABORATORY;
  const category = assetCategories[assetCategory];
  
export default async function Page({ params }: PageProps) {
  const { itemId } = await params;
  const item = await prisma.labItem.findUnique({
    where: { id: decodeURIComponent(itemId) },
    include: laboratoryItemDataInclude,
  });
  if (!item) throw new Error("Item not found");

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: `${category.label} management`,
            url: "/laboratory-asset-management",
          },

          {
            label: `Update ${item.name}`,
          },
        ]}
        className="max-w-[95rem]"
      />
      <BodyContainer className="max-w-[95rem]">
        <FormLaboratory laboratoryItemToEdit={item} />
      </BodyContainer>
    </Fragment>
  );
}
