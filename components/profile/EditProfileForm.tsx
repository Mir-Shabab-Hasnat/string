"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { User } from "@prisma/client"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as z from "zod"

const editProfileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  organisation: z.string().optional(),
  profilePicture: z.string().url().optional().or(z.literal("")),
})

type EditProfileData = z.infer<typeof editProfileSchema>

export default function EditProfileForm({ user }: { user: User }) {
  const router = useRouter()
  
  const form = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      organisation: user.organisation || "",
      profilePicture: user.profilePicture || "",
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: EditProfileData) => {
      const response = await fetch(`/api/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) throw new Error("Failed to update profile")
      
      return response.json()
    },
    onSuccess: () => {
      toast.success("Profile updated successfully")
      router.push(`/profile/${user.id}`)
      router.refresh()
    },
    onError: () => {
      toast.error("Failed to update profile")
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
        {/* Form fields */}
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
        {/* Add other form fields similarly */}
        
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
} 