import { getAllBookAuthors } from "@/components/assets/library/authors/action";
import AuthorBooks from "@/components/assets/library/authors/author-books";
import ListOfAuthors from "@/components/assets/library/authors/list-of-authors";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Library book authors",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const assetCategory = AssetCategory.LIBRARY;
  const authors = await getAllBookAuthors();
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: "Asset management",
            url: `/management/asset-management/`,
          },
          {
            label: assetCategories[assetCategory].label + "s",
            url: `/management/asset-management/store/${assetCategory.toLocaleLowerCase()}`,
          },
          { label: "Authors" },
        ]}
      />
      <BodyContainer className="flex flex-row gap-6">
        <ListOfAuthors oldData={authors} />
        <AuthorBooks />
      </BodyContainer>
    </Fragment>
  );
}
