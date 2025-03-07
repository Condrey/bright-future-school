import ListOfItems from "@/components/assets/computer-lab/view/(tables)/list-of-items";
import { getComputerLabItem } from "@/components/assets/computer-lab/view/action";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";

interface PageProps {
  params: Promise<{ itemId: string }>;
}
const assetCategory = AssetCategory.COMPUTER_LAB;
const category = assetCategories[assetCategory];
export default async function Page({ params }: PageProps) {
  const { itemId } = await params;
  const item = await getComputerLabItem(itemId);
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
            label: `${item.model} ${item.name} variants`,
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
