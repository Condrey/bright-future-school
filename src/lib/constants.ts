import { StaffType } from "@prisma/client";

export const PARAM_NAME_ACADEMIC_YEAR = "academic-year";
export const PARAM_NAME_CLASS_TERM = "class-term";
export const PARAM_NAME_TERM = "term";
export const PARAM_NAME_ROLE = "role";
export const PARAM_NAME_LEVEL = "level";
export const PARAM_NAME_LIB_BOOK_CATEGORY_ID = "lib-book-category";
export const PARAM_NAME_LIB_BOOK_AUTHOR = "lib-book-author";

export const staffTypes: Record<StaffType, string> = {
  TEACHING_STAFF: "Teaching Staff",
  NON_TEACHING_STAFF: "Non teaching staff",
};
