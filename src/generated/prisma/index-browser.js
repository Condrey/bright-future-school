/* !!! This is code generated by Prisma. Do not edit directly. !!!
/* eslint-disable */

Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip,
} = require("./runtime/index-browser.js");

const Prisma = {};

exports.Prisma = Prisma;
exports.$Enums = {};

/**
 * Prisma Client JS version: 6.7.0
 * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
 */
Prisma.prismaVersion = {
  client: "6.7.0",
  engine: "3cff47a7f5d65c3ea74883f1d736e41d68ce91ed",
};

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.Decimal = Decimal;

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.validator = Public.validator;

/**
 * Extensions
 */
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull,
};

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable",
});

exports.Prisma.UserScalarFieldEnum = {
  id: "id",
  name: "name",
  username: "username",
  email: "email",
  avatarUrl: "avatarUrl",
  role: "role",
  createdAt: "createdAt",
  telephone: "telephone",
  passwordHash: "passwordHash",
  googleId: "googleId",
  bio: "bio",
  isWelcomed: "isWelcomed",
  isVerified: "isVerified",
  emailVerified: "emailVerified",
};

exports.Prisma.EmailVerificationTokenScalarFieldEnum = {
  id: "id",
  userId: "userId",
  expires: "expires",
};

exports.Prisma.PupilScalarFieldEnum = {
  id: "id",
  userId: "userId",
  genericPassword: "genericPassword",
};

exports.Prisma.StaffScalarFieldEnum = {
  id: "id",
  staffType: "staffType",
  userId: "userId",
  genericPassword: "genericPassword",
};

exports.Prisma.LevelScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
};

exports.Prisma.StreamScalarFieldEnum = {
  id: "id",
  name: "name",
};

exports.Prisma.ClassScalarFieldEnum = {
  id: "id",
  name: "name",
  levelId: "levelId",
  createdAt: "createdAt",
  slug: "slug",
};

exports.Prisma.AcademicYearScalarFieldEnum = {
  id: "id",
  year: "year",
  startAt: "startAt",
  endAt: "endAt",
};

exports.Prisma.AcademicYearClassScalarFieldEnum = {
  id: "id",
  academicYearId: "academicYearId",
  classId: "classId",
};

exports.Prisma.SubjectScalarFieldEnum = {
  id: "id",
  subjectName: "subjectName",
  slug: "slug",
  code: "code",
  levelId: "levelId",
};

exports.Prisma.GradingScalarFieldEnum = {
  id: "id",
  from: "from",
  to: "to",
  grade: "grade",
  remarks: "remarks",
};

exports.Prisma.AcademicYearSubjectScalarFieldEnum = {
  id: "id",
  academicYearClassId: "academicYearClassId",
  subjectId: "subjectId",
};

exports.Prisma.ClassStreamScalarFieldEnum = {
  id: "id",
  staffId: "staffId",
  classId: "classId",
  streamId: "streamId",
};

exports.Prisma.TermScalarFieldEnum = {
  id: "id",
  term: "term",
  slug: "slug",
};

exports.Prisma.ClassTermScalarFieldEnum = {
  id: "id",
  startAt: "startAt",
  endAt: "endAt",
  termId: "termId",
  classStreamId: "classStreamId",
  feesAmount: "feesAmount",
};

exports.Prisma.FeesScalarFieldEnum = {
  id: "id",
  pupilId: "pupilId",
  balance: "balance",
  termId: "termId",
  status: "status",
};

exports.Prisma.FeesPaymentScalarFieldEnum = {
  id: "id",
  amountPaid: "amountPaid",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  feesId: "feesId",
  userId: "userId",
};

exports.Prisma.SessionScalarFieldEnum = {
  id: "id",
  userId: "userId",
  expiresAt: "expiresAt",
  role: "role",
};

exports.Prisma.AssetScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  category: "category",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.FoodStoreItemScalarFieldEnum = {
  id: "id",
  assetId: "assetId",
  foodName: "foodName",
  unit: "unit",
  quantity: "quantity",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  supplierId: "supplierId",
  trackQuantity: "trackQuantity",
  status: "status",
  isConsumable: "isConsumable",
};

exports.Prisma.IndividualFoodStoreItemScalarFieldEnum = {
  id: "id",
  foodStoreItemId: "foodStoreItemId",
  uniqueIdentifier: "uniqueIdentifier",
  status: "status",
  condition: "condition",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.FoodConsumptionScalarFieldEnum = {
  id: "id",
  quantityUsed: "quantityUsed",
  dateUsedAt: "dateUsedAt",
  usageDetails: "usageDetails",
  foodStoreItemId: "foodStoreItemId",
};

exports.Prisma.SupplierScalarFieldEnum = {
  id: "id",
  name: "name",
  contactInfo: "contactInfo",
  address: "address",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.LibraryBookScalarFieldEnum = {
  id: "id",
  title: "title",
  author: "author",
  assetId: "assetId",
  libraryBookCategoryId: "libraryBookCategoryId",
  quantity: "quantity",
  trackQuantity: "trackQuantity",
  unit: "unit",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.IndividualBookScalarFieldEnum = {
  id: "id",
  isbn: "isbn",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  libraryBookId: "libraryBookId",
  condition: "condition",
  borrowCount: "borrowCount",
};

exports.Prisma.LibraryBookCategoryScalarFieldEnum = {
  id: "id",
  category: "category",
  description: "description",
};

exports.Prisma.BorrowerScalarFieldEnum = {
  id: "id",
  borrowedAt: "borrowedAt",
  returnAt: "returnAt",
  status: "status",
  userId: "userId",
  individualBookId: "individualBookId",
};

exports.Prisma.LabItemScalarFieldEnum = {
  id: "id",
  name: "name",
  quantity: "quantity",
  unit: "unit",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  assetId: "assetId",
  trackQuantity: "trackQuantity",
  status: "status",
};

exports.Prisma.IndividualLabItemScalarFieldEnum = {
  id: "id",
  labItemId: "labItemId",
  uniqueIdentifier: "uniqueIdentifier",
  status: "status",
  condition: "condition",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.ComputerLabItemScalarFieldEnum = {
  id: "id",
  name: "name",
  model: "model",
  specification: "specification",
  quantity: "quantity",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  assetId: "assetId",
  trackQuantity: "trackQuantity",
  unit: "unit",
};

exports.Prisma.IndividualComputerLabItemScalarFieldEnum = {
  id: "id",
  computerLabItemId: "computerLabItemId",
  uniqueIdentifier: "uniqueIdentifier",
  status: "status",
  condition: "condition",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.GeneralStoreItemScalarFieldEnum = {
  id: "id",
  name: "name",
  quantity: "quantity",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  assetId: "assetId",
  status: "status",
  trackQuantity: "trackQuantity",
  unit: "unit",
};

exports.Prisma.IndividualGeneralStoreItemScalarFieldEnum = {
  id: "id",
  generalStoreItemId: "generalStoreItemId",
  uniqueIdentifier: "uniqueIdentifier",
  status: "status",
  condition: "condition",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.AssetDamageScalarFieldEnum = {
  id: "id",
  damageDetails: "damageDetails",
  condition: "condition",
  quantity: "quantity",
  userId: "userId",
  individualComputerLabItemId: "individualComputerLabItemId",
  isRepaired: "isRepaired",
  repairedAt: "repairedAt",
  createdAt: "createdAt",
  individualBookId: "individualBookId",
  individualLabItemId: "individualLabItemId",
  individualFoodStoreItemId: "individualFoodStoreItemId",
  individualGeneralStoreItemId: "individualGeneralStoreItemId",
  isSchoolCost: "isSchoolCost",
  repairBalance: "repairBalance",
  repairPrice: "repairPrice",
};

exports.Prisma.AssetRepairPaymentScalarFieldEnum = {
  id: "id",
  paidAmount: "paidAmount",
  paidAt: "paidAt",
  updatedAt: "updatedAt",
  assetDamageId: "assetDamageId",
  userId: "userId",
  isSchoolCost: "isSchoolCost",
};

exports.Prisma.ExamScoreScalarFieldEnum = {
  id: "id",
  score: "score",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  examSubjectId: "examSubjectId",
  pupilId: "pupilId",
};

exports.Prisma.ExamScalarFieldEnum = {
  id: "id",
  examName: "examName",
  examType: "examType",
  classTermId: "classTermId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.ExamSubjectScalarFieldEnum = {
  id: "id",
  examId: "examId",
  examDate: "examDate",
  academicYearSubjectId: "academicYearSubjectId",
};

exports.Prisma.SortOrder = {
  asc: "asc",
  desc: "desc",
};

exports.Prisma.QueryMode = {
  default: "default",
  insensitive: "insensitive",
};

exports.Prisma.NullsOrder = {
  first: "first",
  last: "last",
};
exports.Role = exports.$Enums.Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  DIRECTOR: "DIRECTOR",
  BURSAR: "BURSAR",
  ASSET_CARETAKER: "ASSET_CARETAKER",
  GENERAL_STORE_ASSET_CARETAKER: "GENERAL_STORE_ASSET_CARETAKER",
  COMPUTER_LAB_ASSET_CARETAKER: "COMPUTER_LAB_ASSET_CARETAKER",
  LABORATORY_ASSET_CARETAKER: "LABORATORY_ASSET_CARETAKER",
  LIBRARY_ASSET_CARETAKER: "LIBRARY_ASSET_CARETAKER",
  FOOD_STORE_ASSET_CARETAKER: "FOOD_STORE_ASSET_CARETAKER",
  STAFF: "STAFF",
  CLASS_TEACHER: "CLASS_TEACHER",
  USER: "USER",
};

exports.StaffType = exports.$Enums.StaffType = {
  TEACHING_STAFF: "TEACHING_STAFF",
  NON_TEACHING_STAFF: "NON_TEACHING_STAFF",
};

exports.FeesStatus = exports.$Enums.FeesStatus = {
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
  NILL: "NILL",
};

exports.AssetCategory = exports.$Enums.AssetCategory = {
  LIBRARY: "LIBRARY",
  COMPUTER_LAB: "COMPUTER_LAB",
  LABORATORY: "LABORATORY",
  GENERAL_STORE: "GENERAL_STORE",
  FOOD_STORE: "FOOD_STORE",
};

exports.AssetUnit = exports.$Enums.AssetUnit = {
  KILOGRAM: "KILOGRAM",
  GRAMS: "GRAMS",
  PACKETS: "PACKETS",
  SAC: "SAC",
  LITER: "LITER",
  PIECE: "PIECE",
  PAIR: "PAIR",
  JERRICAN: "JERRICAN",
  CONTAINER: "CONTAINER",
  OTHERS: "OTHERS",
};

exports.AssetItemStatus = exports.$Enums.AssetItemStatus = {
  AVAILABLE: "AVAILABLE",
  IN_USE: "IN_USE",
  EXPIRED: "EXPIRED",
};

exports.AssetStatus = exports.$Enums.AssetStatus = {
  AVAILABLE: "AVAILABLE",
  ASSIGNED: "ASSIGNED",
  UNDER_MAINTENANCE: "UNDER_MAINTENANCE",
  DISPOSED: "DISPOSED",
};

exports.AssetCondition = exports.$Enums.AssetCondition = {
  NEW: "NEW",
  GOOD: "GOOD",
  FAIR: "FAIR",
  POOR: "POOR",
  DAMAGED: "DAMAGED",
};

exports.BookStatus = exports.$Enums.BookStatus = {
  AVAILABLE: "AVAILABLE",
  BORROWED: "BORROWED",
  DAMAGED: "DAMAGED",
};

exports.BorrowStatus = exports.$Enums.BorrowStatus = {
  ONGOING: "ONGOING",
  RETURNED: "RETURNED",
};

exports.ExamType = exports.$Enums.ExamType = {
  ASSESSMENT: "ASSESSMENT",
  TEST: "TEST",
  EXERCISE: "EXERCISE",
  MOCK: "MOCK",
  EXAM: "EXAM",
};

exports.Prisma.ModelName = {
  User: "User",
  EmailVerificationToken: "EmailVerificationToken",
  Pupil: "Pupil",
  Staff: "Staff",
  Level: "Level",
  Stream: "Stream",
  Class: "Class",
  AcademicYear: "AcademicYear",
  AcademicYearClass: "AcademicYearClass",
  Subject: "Subject",
  Grading: "Grading",
  AcademicYearSubject: "AcademicYearSubject",
  classStream: "classStream",
  Term: "Term",
  ClassTerm: "ClassTerm",
  Fees: "Fees",
  FeesPayment: "FeesPayment",
  Session: "Session",
  Asset: "Asset",
  FoodStoreItem: "FoodStoreItem",
  IndividualFoodStoreItem: "IndividualFoodStoreItem",
  FoodConsumption: "FoodConsumption",
  Supplier: "Supplier",
  LibraryBook: "LibraryBook",
  IndividualBook: "IndividualBook",
  LibraryBookCategory: "LibraryBookCategory",
  Borrower: "Borrower",
  LabItem: "LabItem",
  IndividualLabItem: "IndividualLabItem",
  ComputerLabItem: "ComputerLabItem",
  IndividualComputerLabItem: "IndividualComputerLabItem",
  GeneralStoreItem: "GeneralStoreItem",
  IndividualGeneralStoreItem: "IndividualGeneralStoreItem",
  AssetDamage: "AssetDamage",
  AssetRepairPayment: "AssetRepairPayment",
  ExamScore: "ExamScore",
  Exam: "Exam",
  ExamSubject: "ExamSubject",
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message;
        const runtime = getRuntime();
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message =
            "PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `" +
            runtime.prettyName +
            "`).";
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`;

        throw new Error(message);
      },
    });
  }
}

exports.PrismaClient = PrismaClient;

Object.assign(exports, Prisma);
