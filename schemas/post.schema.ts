import * as z from "zod"

export const createPostSchema = z.object({
  content: z.string().min(1, "Post content is required"),
  imageUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()).default([]),
})

export type CreatePostData = z.infer<typeof createPostSchema> 