import { Fragment } from "react";
import { Button } from "./ui/button";
import { Bell, MenuIcon, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const SecondaryNavbar = ({ heading }: { heading: string }) => {
  return (
    <Fragment>
      <header className="sticky top-0 z-50 border-b bg-background/15 backdrop-blur-lg">
        <div className="relative mx-auto max-w-container px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-foreground">
                <MenuIcon className="h-5 w-5" />
              </Button>
              <Link href="/dashboard" className="flex items-center gap-2">
                <svg
                  height="32"
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="32"
                  fill="currentColor"
                  className="text-primary"
                >
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
                <span className="text-xl font-semibold">{heading}</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <Input
                  className="h-8 w-72 rounded-md bg-muted border-input pl-8 pr-10 py-1 text-sm"
                  placeholder="Type / to search"
                />
                <Search className="absolute left-2 top-1.5 h-4 w-4 text-muted-foreground" />
                <span className="absolute right-2 top-1.5 text-xs border border-input rounded px-1 text-muted-foreground">
                  /
                </span>
              </div>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Plus className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
              </Button>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <Button variant="default">Sign in</Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default SecondaryNavbar;