import FormComputerLab from "@/components/assets/add-assets/(computer-lab)/form-computer-lab";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import prisma from "@/lib/prisma";
import { computerLabItemDataInclude } from "@/lib/types";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";

interface PageProps {
  params: Promise<{ itemId: string }>;
}

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
          { label: "Asset management", url: "/management/asset-management/" },
          {
            label: "Computer lab Assets",
            url: `/management/asset-management/store/${AssetCategory.COMPUTER_LAB.toLocaleLowerCase()}`,
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
