import { getIndividualComputerLabItem } from "@/components/assets/computer-lab/view/action";
import ItemBody from "@/components/assets/computer-lab/view/item/item-body";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";

interface PageProps {
  params: Promise<{ individualItemId: string }>;
}
const assetCategory = AssetCategory.COMPUTER_LAB;
const category = assetCategories[assetCategory];
export default async function Page({ params }: PageProps) {
  const { individualItemId } = await params;
  const individualItem = await getIndividualComputerLabItem(
    decodeURIComponent(individualItemId),
  );
  if (!individualItem) throw Error("Missing item.");
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: `${category.label} management`,
            url: "/computer-lab-asset-management",
          },
          {
            label: `${individualItem.computerLabItem.model} ${individualItem.computerLabItem.name} variants`,
            url: `/computer-lab-asset-management/view/${individualItem.computerLabItemId}`,
          },
          {
            label: individualItem.uniqueIdentifier || "Unknown identifier",
          },
        ]}
      />
      <BodyContainer>
        <ItemBody oldItem={individualItem} />
      </BodyContainer>
    </Fragment>
  );
}
