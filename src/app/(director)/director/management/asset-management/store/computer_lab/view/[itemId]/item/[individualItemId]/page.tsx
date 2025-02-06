import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import { getIndividualComputerLabItem } from "../../action";
import ItemBody from "./item-body";

interface PageProps {
  params: Promise<{ individualItemId: string }>;
}

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
          { label: "Asset management", url: "/management/asset-management/" },
          {
            label: "Computer lab Assets",
            url: `/management/asset-management/store/${AssetCategory.COMPUTER_LAB.toLocaleLowerCase()}`,
          },
          {
            label: `${individualItem.computerLabItem.model} ${individualItem.computerLabItem.name} variants`,
            url: `/management/asset-management/store/${AssetCategory.COMPUTER_LAB.toLocaleLowerCase()}/view/${individualItem.computerLabItemId}`,
          },
          {
            label: individualItem.uniqueIdentifier || "Unknown identifier",
          },
        ]}
        className="max-w-[90rem]"
      />
      <BodyContainer className="max-w-[90rem]">
        <ItemBody oldItem={individualItem} />
      </BodyContainer>
    </Fragment>
  );
}
