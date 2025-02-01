"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UploadButton } from "@/components/ui/uploadthing"
import { useState } from "react"
import { toast } from "sonner"

export function PersonalInfoStep() {
  const form = useFormContext()
  const [previewUrl, setPreviewUrl] = useState("")

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Personal Information</h2>
      
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="relative flex h-32 w-32 shrink-0 overflow-hidden rounded-full">
          <Avatar className="h-full w-full">
            <AvatarImage 
              src={previewUrl || "/default-avatar.png"} 
              alt="Profile picture"
              className="aspect-square h-full w-full object-cover"
            />
            <AvatarFallback className="flex h-full w-full items-center justify-center">
              {form.watch("firstName")?.[0] || ""}{form.watch("lastName")?.[0] || ""}
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
              <Input placeholder="John" {...field} />
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
              <Input placeholder="Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date of birth</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
} 