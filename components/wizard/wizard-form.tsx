"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { PersonalInfoStep } from "./steps/personal-info-step"
import { CategoryStep } from "./steps/category-step"
import { ContextInfoStep } from "./steps/context-info-step"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { userFormSchema, type UserFormData } from "@/schemas/user.schema"

export function WizardForm() {
  const [step, setStep] = useState(1)
  const router = useRouter()
  
  const mutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error("Failed to create user")
      }
      
      return response.json()
    },
    onSuccess: () => {
      toast.success("Profile created successfully!")
      router.push("/dashboard")
    },
    onError: (error) => {
      toast.error("Something went wrong. Please try again.")
      console.error("Error creating profile:", error)
    },
  })

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      organisation: "",
      profilePicture: "",
    },
  })

  const onSubmit = async (data: UserFormData) => {
    mutation.mutate(data)
  }

  const nextStep = () => {
    const fields = step === 1 
      ? ["firstName", "lastName", "birthDate"] as const
      : step === 2 
      ? ["role"] as const
      : ["organisation"] as const

    form.trigger(fields).then((isValid) => {
      if (isValid) setStep(step + 1)
    })
  }

  const previousStep = () => setStep(step - 1)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Progress value={(step / 3) * 100} className="mb-8" />
        
        {step === 1 && <PersonalInfoStep />}
        {step === 2 && <CategoryStep />}
        {step === 3 && <ContextInfoStep />}

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={previousStep}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step === 3 ? (
            <Button type="submit">Complete</Button>
          ) : (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
} 

