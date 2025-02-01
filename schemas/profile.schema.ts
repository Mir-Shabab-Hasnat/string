import * as z from "zod"

export const editProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  organisation: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  role: z.enum(["STUDENT", "RESEARCHER", "PROFESSOR", "PROFESSIONAL", "OTHER"]),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  profilePicture: z.string().url().optional().or(z.literal("")),
})

export const updateProfileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  organisation: z.string().optional(),
  profilePicture: z.string().url().optional().or(z.literal("")),
  userId: z.string()
})

export type EditProfileData = z.infer<typeof editProfileSchema>
export type UpdateProfileData = z.infer<typeof updateProfileSchema> 