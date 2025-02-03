"use client"

import { WizardForm } from "@/components/wizard/wizard-form"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic";

export default function WizardPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <WizardForm />
        </CardContent>
      </Card>
    </div>
  )
}



