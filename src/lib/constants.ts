import { StaffType } from "@prisma/client";

export const PARAM_NAME_ACADEMIC_YEAR = "academic-year";
export const PARAM_NAME_CLASS_TERM = "class-term";
export const PARAM_NAME_TERM = "term";
export const PARAM_NAME_ROLE = "role";
export const PARAM_NAME_LEVEL = "level";
export const PARAM_NAME_LIB_BOOK_CATEGORY_ID = "lib-book-category";
export const PARAM_NAME_LIB_BOOK_AUTHOR = "lib-book-author";
export const PARAM_NAME_LIB_BOOK_VARIANT = "lib-book-variant";
export const PARAM_NAME_COMPUTER_LAB_BRAND_MODEL = "brand model";
export const PARAM_NAME_GENERAL_STORE_ITEM_SUB_ASSET = "sub-asset";
export const PARAM_NAME_FOOD_STORE_ITEM_SUPPLIER = "supplier";
export const PARAM_NAME_VANDALISM_ASSET_CATEGORY = "vandalism-category";

export const staffTypes: Record<StaffType, string> = {
  TEACHING_STAFF: "Teaching Staff",
  NON_TEACHING_STAFF: "Non teaching staff",
};
