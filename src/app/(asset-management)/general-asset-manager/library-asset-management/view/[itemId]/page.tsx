import ListOfItems from "@/components/assets/library/view/(tables)/list-of-items";
import { getLibraryItem } from "@/components/assets/library/view/action";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";

interface PageProps {
  params: Promise<{ itemId: string }>;
}
const assetCategory = AssetCategory.LIBRARY;
const category = assetCategories[assetCategory];

export default async function Page({ params }: PageProps) {
  const { itemId } = await params;
  const item = await getLibraryItem(decodeURIComponent(itemId));
  if (!item) throw new Error("Item not found");

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: `${category.label} management`,
            url: "/library-asset-management",
          },
          {
            label: `${item.author}'s ${item.title} variants`,
          },
        ]}
      />
      <BodyContainer>
        {/* list of items  */}
        <ListOfItems oldItem={item} />
      </BodyContainer>
    </Fragment>
  );
}
