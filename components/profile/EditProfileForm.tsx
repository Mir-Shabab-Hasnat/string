"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { UploadButton } from "@/components/ui/uploadthing";
import Image from "next/image";
import { useState } from "react";
import { updateProfileSchema } from "@/schemas/user.schema";
import { z } from "zod";

interface EditProfileFormProps {
  user: User;
}

type FormData = z.infer<typeof updateProfileSchema>;

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(user.profilePicture || "");

  const form = useForm<FormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      organisation: user.organisation || "",
      profilePicture: user.profilePicture || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Use the uploaded image URL if available, otherwise keep the existing one
      const profilePicture = imageUrl || user.profilePicture;

      const res = await fetch(`/api/user/${user.id}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          profilePicture,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully");
      router.refresh();
      router.push(`/profile/${user.id}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="space-y-4">
              <FormLabel>Profile Picture</FormLabel>
              <div className="flex items-center gap-4">
                {imageUrl && (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border">
                    <Image
                      src={imageUrl}
                      alt="Profile picture"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]) {
                      setImageUrl(res[0].url);
                      form.setValue("profilePicture", res[0].url);
                      toast.success("Image uploaded successfully");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Failed to upload image: ${error.message}`);
                  }}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organisation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
