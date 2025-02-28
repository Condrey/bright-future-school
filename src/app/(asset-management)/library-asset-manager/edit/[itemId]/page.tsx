import FormLibrary from "@/components/assets/add-assets/(library)/form-library";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import prisma from "@/lib/prisma";
import { libraryBookDataInclude } from "@/lib/types";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";

interface PageProps {
  params: Promise<{ itemId: string }>;
}

const assetCategory = AssetCategory.LIBRARY;
const category = assetCategories[assetCategory];

export default async function Page({ params }: PageProps) {
  const { itemId } = await params;
  const item = await prisma.libraryBook.findUnique({
    where: { id: encodeURIComponent(itemId) },
    include: libraryBookDataInclude,
  });
  if (!item) throw new Error("Item not found");

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: `${category.label} management`,
            url: "",
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
