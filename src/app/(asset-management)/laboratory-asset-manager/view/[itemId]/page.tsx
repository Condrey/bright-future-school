import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import ListOfItems from "@/components/assets/laboratory/view/(tables)/list-of-items";
import { getLaboratoryItem } from "@/components/assets/laboratory/view/action";
import { assetCategories } from "@/lib/enums";

interface PageProps {
  params: Promise<{ itemId: string }>;
}

const assetCategory = AssetCategory.LABORATORY;
const category = assetCategories[assetCategory];

export default async function Page({ params }: PageProps) {
  const { itemId } = await params;
  const item = await getLaboratoryItem(decodeURIComponent(itemId));
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
            label: `${item.name} variants`,
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
