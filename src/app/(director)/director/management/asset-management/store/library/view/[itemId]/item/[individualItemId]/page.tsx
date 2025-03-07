import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import { getIndividualBook } from "../../../../../../../../../../../components/assets/library/view/action";
import ItemBody from "../../../../../../../../../../../components/assets/library/view/item/item-body";

interface PageProps {
  params: Promise<{ individualItemId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { individualItemId } = await params;
  const individualItem = await getIndividualBook(
    decodeURIComponent(individualItemId),
  );
  if (!individualItem) throw Error("Missing item.");
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
            label: `${individualItem.libraryBook.author}'s ${individualItem.libraryBook.title} books `,
            url: `/management/asset-management/store/${AssetCategory.LIBRARY.toLocaleLowerCase()}/view/${individualItem.libraryBookId}`,
          },
          {
            label: individualItem.isbn || "Unknown ISBN",
          },
        ]}
      />
      <BodyContainer>
        <ItemBody oldItem={individualItem} />
      </BodyContainer>
    </Fragment>
  );
}
