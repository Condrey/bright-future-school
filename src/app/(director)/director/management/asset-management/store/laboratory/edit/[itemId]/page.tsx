import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import prisma from "@/lib/prisma";
import { laboratoryItemDataInclude } from "@/lib/types";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import FormLaboratory from "../../../../add-asset/[assetCategory]/(lab)/form-laboratory";

interface PageProps {
  params: Promise<{ itemId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { itemId } = await params;
  const item = await prisma.labItem.findUnique({
    where: { id: itemId },
    include: laboratoryItemDataInclude,
  });
  if (!item) throw new Error("Item not found");

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          { label: "Asset management", url: "/management/asset-management/" },
          {
            label: "Laboratory Assets",
            url: `/management/asset-management/store/${AssetCategory.LABORATORY.toLocaleLowerCase()}`,
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
