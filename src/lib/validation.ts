import {
  AssetCategory,
  AssetCondition,
  AssetItemStatus,
  AssetStatus,
  AssetUnit,
  BookStatus,
} from "@prisma/client";
import z from "zod";

const requiredString = z
  .string({ required_error: "This field should have a value" })
  .trim();

// Signup
export const signUpSchema = z.object({
  email: requiredString
    .min(1, "Please an email is required")
    .describe("Email for signing up")
    .email(),
  username: requiredString
    .min(1, "You need a username")
    .describe("User username for the user.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, - and _ are allowed"),
  password: requiredString
    .min(8, "Password must be at least 8 characters")
    .describe("Password for the user."),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

// Login
export const loginSchema = z.object({
  username: requiredString.min(
    1,
    "Please input your username that you registered with.",
  ),
  password: requiredString
    .min(1, "Password is required to login")
    .describe("Password that you registered with."),
});
export type LoginValues = z.infer<typeof loginSchema>;

//User
export const userSchema = z.object({
  name: requiredString
    .min(1, "Name must be provided.")
    .transform((val) =>
      val.trim().replace(/\b\w/g, (char) => char.toUpperCase()),
    ),
  id: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  telephone: z.string().optional(),
});
export type UserSchema = z.infer<typeof userSchema>;

// Pupil
export const pupilSchema = z.object({
  user: userSchema,
  id: z.string().optional(),
});
export type PupilSchema = z.infer<typeof pupilSchema>;

// Teaching Staff
export const teachingStaffSchema = z.object({
  user: userSchema,
  id: z.string().optional(),
});
export type TeachingStaffSchema = z.infer<typeof teachingStaffSchema>;
// Non Teaching Staff
export const nonTeachingStaffSchema = z.object({
  user: userSchema,
  id: z.string().optional(),
});
export type NonTeachingStaffSchema = z.infer<typeof nonTeachingStaffSchema>;

// Level
export const levelSchema = z.object({
  name: requiredString.min(1, "Level name must be provided."),
  id: z.string().optional(),
});
export type LevelSchema = z.infer<typeof levelSchema>;

// Stream
export const streamSchema = z.object({
  name: requiredString.min(1, "Stream name must be provided."),
  id: z.string().optional(),
});
export type StreamSchema = z.infer<typeof streamSchema>;
// Class stream
export const classStreamSchema = z.object({
  streamId: z.string().optional(),
  classId: z.string().optional(),
  staffId: z.string().optional(),
  id: z.string().optional(),
});
export type ClassStreamSchema = z.infer<typeof classStreamSchema>;

// Class
export const classSchema = z.object({
  name: requiredString.min(1, "Please provide a class name to proceed"),
  id: z.string().optional(),
  level: levelSchema,
});
export type ClassSchema = z.infer<typeof classSchema>;

// Term
export const termSchema = z.object({
  term: requiredString.min(1, "Please provide a term name to proceed"),
  id: z.string().optional(),
});
export type TermSchema = z.infer<typeof termSchema>;

// Year
export const yearSchema = z.object({
  year: requiredString.min(1, "Please provide a year name to proceed"),
  id: z.string().optional(),
  startAt: z.date({
    required_error: "Please select academic year starting date.",
  }),
  endAt: z.date({ required_error: "Please select a ending date." }),
});
export type YearSchema = z.infer<typeof yearSchema>;

// Class Term
export const classTermSchema = z.object({
  feesAmount: z.number(),
  id: z.string().optional(),
  startAt: z.date({
    required_error: "Please select term starting date.",
  }),
  endAt: z.date({ required_error: "Please select a ending date." }),
});
export type ClassTermSchema = z.infer<typeof classTermSchema>;

// Fees Payment
export const feesPaymentSchema = z.object({
  amountPaid: z.number(),
  id: z.string().optional(),
});
export type FeesPaymentSchema = z.infer<typeof feesPaymentSchema>;
// Fees
export const feesSchema = z.object({
  pupilId: requiredString.min(1, "This fees needs to be assigned a user."),
  id: z.string().optional(),
  feesPayment: feesPaymentSchema,
  termId: requiredString.min(1, "Term is missing"),
});
export type FeesSchema = z.infer<typeof feesSchema>;

// Asset management
export const assetSchema = z.object({
  id: z.string().optional(),
  name: requiredString.min(1, "Give the asset a name."),
  description: z.string().optional(),
  category: z.nativeEnum(AssetCategory),
});
export type AssetSchema = z.infer<typeof assetSchema>;

// Lab asset
export const laboratoryAssetSchema = z.object({
  id: z.string().optional(),
  asset: assetSchema,
  name: requiredString.min(1, "Provide lab item name"),
  quantity: z.number().optional(),
  trackQuantity: z.boolean().default(false),
  unit: z.nativeEnum(AssetUnit).default(AssetUnit.PIECE),
  status: z.nativeEnum(AssetItemStatus).default(AssetItemStatus.AVAILABLE),
});
export type LaboratoryAssetSchema = z.infer<typeof laboratoryAssetSchema>;

// Food store asset
// supplier management
export const supplierSchema = z.object({
  id: z.string().optional(),
  name: requiredString.min(1, "Give the supplier a name."),
  contactInfo: z.string().optional(),
  address: z.string().optional(),
});
export type SupplierSchema = z.infer<typeof supplierSchema>;
export const foodStoreAssetSchema = z.object({
  id: z.string().optional(),
  asset: assetSchema,
  foodName: requiredString.min(1, "Provide a food store item name"),
  quantity: z.number().optional(),
  trackQuantity: z.boolean().default(false),
  status: z.nativeEnum(AssetItemStatus).default(AssetItemStatus.AVAILABLE),
  unit: z.nativeEnum(AssetUnit).default(AssetUnit.PIECE),
  supplier: supplierSchema.optional(),
});
export type FoodStoreAssetSchema = z.infer<typeof foodStoreAssetSchema>;
// Food consumption
export const foodConsumptionSchema = z.object({
  id: z.string().optional(),
  foodStoreItemId: requiredString.min(
    1,
    "Food consumption must belong to  a store",
  ),
  quantityUsed: z.number(),
  usageDetails: z.string(),
});
export type FoodConsumptionSchema = z.infer<typeof foodConsumptionSchema>;

// General store
export const generalStoreAssetSchema = z.object({
  id: z.string().optional(),
  asset: assetSchema,
  name: requiredString.min(1, "Provide a general store item name"),
  quantity: z.number().optional(),
  trackQuantity: z.boolean().default(false),
  unit: z.nativeEnum(AssetUnit).default(AssetUnit.PIECE),
  status: z.nativeEnum(AssetItemStatus).default(AssetItemStatus.AVAILABLE),
});
export type GeneralStoreAssetSchema = z.infer<typeof generalStoreAssetSchema>;

// Computer lab
export const computerLabAssetSchema = z.object({
  id: z.string().optional(),
  asset: assetSchema,
  name: requiredString.min(1, "Provide a computer lab item name"),
  model: z.string().optional(),
  specification: z.string().optional(),
  quantity: z.number(),
  trackQuantity: z.boolean().default(true),
  unit: z.nativeEnum(AssetUnit).default(AssetUnit.PIECE),
});
export type ComputerLabAssetSchema = z.infer<typeof computerLabAssetSchema>;
export const individualComputerLabItemSchema = z.object({
  id: z.string().optional(),
  uniqueIdentifier: z.string().optional(),
  condition: z.nativeEnum(AssetCondition).default(AssetCondition.NEW),
  status: z.nativeEnum(AssetStatus).default(AssetStatus.AVAILABLE),
  computerLabItemId: requiredString.min(1, "Computer Lab Item is missing"),
});
export type IndividualComputerLabItemSchema = z.infer<
  typeof individualComputerLabItemSchema
>;

// Library lab
export const libraryAssetCategorySchema = z.object({
  id: z.string().optional(),
  category: requiredString.min(1, "Provide a category name"),
  description: z.string().optional(),
});
export type LibraryAssetCategorySchema = z.infer<
  typeof libraryAssetCategorySchema
>;
export const libraryAssetSchema = z.object({
  id: z.string().optional(),
  asset: assetSchema,
  title: requiredString
    .min(1, "Provide a library item name")
    .transform((val) =>
      val.trim().replace(/\b\w/g, (char) => char.toUpperCase()),
    ),
  author: requiredString.min(1, "Author is required"),
  category: libraryAssetCategorySchema,
  quantity: z.number(),
  trackQuantity: z.boolean().default(true),
  unit: z.nativeEnum(AssetUnit).default(AssetUnit.PIECE),
});
export type LibraryAssetSchema = z.infer<typeof libraryAssetSchema>;
export const individualBookSchema = z.object({
  id: z.string().optional(),
  isbn: z.string().optional(),
  status: z.nativeEnum(BookStatus).default(BookStatus.AVAILABLE),
  condition: z.nativeEnum(AssetCondition).default(AssetCondition.NEW),

  libraryBookId: requiredString.min(1, "Library book is missing"),
});
export type IndividualBookSchema = z.infer<typeof individualBookSchema>;

// Asset damages
export const assetDamageSchema = z.object({
  quantity: z.number().optional().default(1),
  isRepaired: z.boolean(),
  userId: requiredString.min(
    1,
    "Please include the person that damaged the item",
  ),
  damageDetails: requiredString.min(1, "Please describe the damage."),
  condition: z.nativeEnum(AssetCondition).default(AssetCondition.NEW),
  id: z.string(),
  parentId: z.string(),
});
export type AssetDamageSchema = z.infer<typeof assetDamageSchema>;

//miscellaneous
export const itemSchema = z.object({
  quantity: z.number(),
  parentId: z.string(),
});
export type ItemSchema = z.infer<typeof itemSchema>;
