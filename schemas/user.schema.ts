import * as z from "zod"

export const userFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  birthDate: z.date(),
  role: z.enum(["STUDENT", "PROFESSIONAL", "ACADEMIC"]),
  organisation: z.string().min(2, "Organisation name must be at least 2 characters"),
})

export type UserFormData = z.infer<typeof userFormSchema> 

