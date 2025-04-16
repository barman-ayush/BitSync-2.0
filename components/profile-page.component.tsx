"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Linkedin, Users, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Define the profile data interface
interface ProfileData {
  displayName: string;
  username: string;
  pronoun: string;
  avatar: string;
  location: string;
  email: string;
  linkedin: string;
  followers: number;
  following: number;
}

// Define the repository interface
interface Repository {
  id: string;
  name: string;
  isPublic: boolean;
  description?: string;
  language: string;
  languageColor: string;
}

interface GithubProfileSimplifiedProps {
  profile: ProfileData;
  pinnedRepos: Repository[];
}

const Profile: React.FC<GithubProfileSimplifiedProps> = ({
  profile,
  pinnedRepos,
}) => {
  const { user } = useUser();
  const router = useRouter();
  return (
    <div className="bg-background text-foreground min-h-full">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile sidebar */}
          <div className="md:w-1/4">
            <div className="relative">
              {user ? (
                <Image
                  src={user?.imageUrl as string}
                  alt={profile.displayName}
                  width={296}
                  height={296}
                  className="rounded-full border-4 border-background w-full max-w-[296px]"
                />
              ) : (
                <div className="rounded-full border-4 border-background w-full max-w-[296px] aspect-square flex items-center justify-center bg-muted/20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h1 className="text-2xl font-semibold">{profile.displayName}</h1>
              <p className="text-muted-foreground">
                {profile.username} · {profile.pronoun}
              </p>

              <Button
                variant="outline"
                className="w-full mt-3 text-sm bg-muted/20 border-input hover:bg-muted/40"
              >
                Edit profile
              </Button>

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-primary hover:underline"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-semibold">Repositories</h2>
              <Button
                variant="default"
                size="sm"
                className=" text-sm hover:cursor-pointer"
                onClick={() => {
                  router.push("/repository/new");
                }}
              >
                Add Repository
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pinnedRepos.map((repo) => (
                <div
                  key={repo.id}
                  className="p-4 border border-input rounded-md bg-background/5"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-muted-foreground"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
                      </svg>
                      <Link
                        href={`/${profile.username}/${repo.name}`}
                        className="text-primary hover:underline"
                      >
                        {repo.name}
                      </Link>
                      <Badge
                        variant="outline"
                        className="text-xs bg-transparent"
                      >
                        Public
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground h-7 w-7"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  {repo.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {repo.description}
                    </p>
                  )}

                  <div className="flex items-center mt-3">
                    <span
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: repo.languageColor }}
                    ></span>
                    <span className="text-sm text-muted-foreground">
                      {repo.language}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
