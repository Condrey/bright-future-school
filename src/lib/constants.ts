import { StaffType } from "@prisma/client";

export const PARAM_NAME_ACADEMIC_YEAR = "academic-year";
export const PARAM_NAME_CLASS_TERM = "class-term";
export const staffTypes: Record<StaffType, string> = {
  TEACHING_STAFF: "Teaching Staff",
  NON_TEACHING_STAFF: "Non teaching staff",
};
