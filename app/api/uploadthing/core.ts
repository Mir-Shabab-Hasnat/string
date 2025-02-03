import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs/server";


const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 }
  })
    .middleware(async () => {
      
        const user = await currentUser();
        if (!user) throw new Error("Unauthorized");
        return { userId: user.id };
      
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        name: file.name,
        key: file.key,
        url: file.url,
        uploaderId: metadata.userId
      }
    }),

  postImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 }
  })
    .middleware(async () => {
      const user = await currentUser();
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        name: file.name,
        key: file.key,
        url: file.url,
        uploaderId: metadata.userId
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
