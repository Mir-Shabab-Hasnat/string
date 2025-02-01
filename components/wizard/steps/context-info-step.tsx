"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function ContextInfoStep() {
  const form = useFormContext()
  const role = form.watch("role")

  const getLabel = () => {
    switch (role) {
      case "STUDENT":
        return "School/Institution Name"
      case "PROFESSIONAL":
        return "Organization Name"
      case "ACADEMIC":
        return "Affiliated Institution"
      default:
        return "Organization"
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Additional Information</h2>
      <FormField
        control={form.control}
        name="organisation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{getLabel()}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
} 