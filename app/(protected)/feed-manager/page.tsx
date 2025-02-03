import FeedManagerContent from "@/components/feed-manager/FeedManagerContent";
import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FeedManagerPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const preferences = await prisma.userFeedPreferences.findUnique({
    where: { userId: user.id },
    select: {
      tags: true,
      showOtherContent: true,
    },
  });

  return (
    <div className="container max-w-4xl py-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Feed Manager</h1>
        <FeedManagerContent initialPreferences={preferences} />
      </Card>
    </div>
  );
} 
