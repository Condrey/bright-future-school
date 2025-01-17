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
