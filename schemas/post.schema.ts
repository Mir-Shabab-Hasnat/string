import * as z from "zod"

export const createPostSchema = z.object({
  content: z.string().min(1, "Post content is required"),
  files: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
})

export type CreatePostData = z.infer<typeof createPostSchema> 