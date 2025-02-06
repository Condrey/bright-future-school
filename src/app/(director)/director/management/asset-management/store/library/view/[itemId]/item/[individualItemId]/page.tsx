import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";
import { getIndividualBook } from "../../action";
import ItemBody from "./item-body";

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
        className="max-w-[90rem]"
      />
      <BodyContainer className="max-w-[90rem]">
        <ItemBody oldItem={individualItem} />
      </BodyContainer>
    </Fragment>
  );
}
