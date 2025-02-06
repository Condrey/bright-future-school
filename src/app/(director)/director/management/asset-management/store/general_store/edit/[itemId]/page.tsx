import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import prisma from "@/lib/prisma";
import { generalStoreItemDataInclude } from "@/lib/types";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import FormGeneralStore from "../../../../add-asset/[assetCategory]/(general-store)/form-general-store";

interface PageProps {
  params: Promise<{ itemId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { itemId } = await params;
  const item = await prisma.generalStoreItem.findUnique({
    where: { id: itemId },
    include: generalStoreItemDataInclude,
  });
  if (!item) throw new Error("Item not found");

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          { label: "Asset management", url: "/management/asset-management/" },
          {
            label: "General Store Assets",
            url: `/management/asset-management/store/${AssetCategory.GENERAL_STORE.toLocaleLowerCase()}`,
          },
          {
            label: `Update ${item.name}`,
          },
        ]}
        className="max-w-[95rem]"
      />
      <BodyContainer className="max-w-[95rem]">
        <FormGeneralStore generalStoreItemToEdit={item} />
      </BodyContainer>
    </Fragment>
  );
}
