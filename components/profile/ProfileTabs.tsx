"use client";

import { User } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileTabsProps {
  user: User;
  isOwner: boolean;
}

export default function ProfileTabs({ user, isOwner }: ProfileTabsProps) {
  return (
    <Card className="w-full max-w-lg mx-auto mt-6 shadow-md border rounded-xl">
      <CardContent>
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="flex justify-center">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="text-center text-muted-foreground mt-4">
              No posts yet.
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="text-center mt-4">
              <p className="text-muted-foreground">
                {user.firstName} is a member of {user.organisation || "this platform"}.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
