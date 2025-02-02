import BodyContainer from "@/app/(director)/body-container";
import HeaderContainer from "@/app/(director)/header-container";
import prisma from "@/lib/prisma";
import { libraryBookDataInclude } from "@/lib/types";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import FormLibrary from "../../../../add-asset/[assetCategory]/(library)/form-library";

interface PageProps {
  params: Promise<{ itemId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { itemId } = await params;
  const item = await prisma.libraryBook.findUnique({
    where: { id: itemId },
    include: libraryBookDataInclude,
  });
  if (!item) throw new Error("Item not found");

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          { label: "Asset management", url: "/management/asset-management/" },
          {
            label: "Library Assets",
            url: `/management/asset-management/store/${AssetCategory.LIBRARY.toLocaleLowerCase()}`,
          },
          {
            label: `Update ${item.title}`,
          },
        ]}
        className="max-w-[95rem]"
      />
      <BodyContainer className="max-w-[95rem]">
        <FormLibrary libraryItemToEdit={item} />
      </BodyContainer>
    </Fragment>
  );
}
