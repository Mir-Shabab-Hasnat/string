"use client";

import { User } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Mail, Building2, User as UserIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProfileTabsProps {
  user: User;
  isOwner: boolean;
}

export default function ProfileTabs({ user, isOwner }: ProfileTabsProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto mt-6 shadow-md border rounded-xl">
      <CardContent className="p-6">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="flex justify-center mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            {isOwner && <TabsTrigger value="settings">Settings</TabsTrigger>}
          </TabsList>

          <TabsContent value="about">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  {user.organisation && (
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Organization</p>
                        <p className="font-medium">{user.organisation}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Status */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Account Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium capitalize">{user.role.toLowerCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="posts">
            <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
              <p>No posts yet</p>
            </div>
          </TabsContent>

          {isOwner && (
            <TabsContent value="settings">
              <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
                <p>Account settings coming soon</p>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
