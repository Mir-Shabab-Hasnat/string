"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User } from "@prisma/client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { UploadButton } from "@/components/ui/uploadthing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { updateProfile } from "@/app/(protected)/profile/[id]/_actions/updateProfile";
import { editProfileSchema, type EditProfileData } from "@/schemas/profile.schema";

export default function EditProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState(user.profilePicture || "");
  
  const form = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      organisation: user.organisation || "",
      profilePicture: user.profilePicture || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: EditProfileData) => {
      return updateProfile({ ...data, userId: user.id });
    },
    onMutate: () => {
      toast.loading("Updating profile...");
    },
    onSuccess: () => {
      toast.dismiss();
      queryClient.invalidateQueries({ queryKey: ['user', user.id] });
      toast.success("Profile updated successfully");
      router.push(`/profile/${user.id}`);
      router.refresh();
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error updating profile: " + (error instanceof Error ? error.message : "Unknown error"));
    },
  });

  const onSubmit = async (data: EditProfileData) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      // Error is handled in mutation's onError
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-32 w-32 shrink-0 overflow-hidden rounded-full">
            <Avatar className="h-full w-full">
              <AvatarImage 
                src={previewUrl || "/default-avatar.png"} 
                alt="Profile picture"
                className="aspect-square h-full w-full object-cover"
              />
              <AvatarFallback className="flex h-full w-full items-center justify-center">
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res?.[0]) {
                const url = res[0].url;
                setPreviewUrl(url);
                form.setValue("profilePicture", url);
                toast.success("Profile picture uploaded");
              }
            }}
            onUploadError={(error: Error) => {
              toast.error(`Upload failed: ${error.message}`);
            }}
          />
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
        
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
