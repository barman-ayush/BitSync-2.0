"use client"
import { useUserContext } from "@/context/userContext";
import { Lock } from "lucide-react";
import { Fragment } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
const AccessDenied = () => {
    const {userData} = useUserContext();
    const router = useRouter();

  return (
    <Fragment>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-md">
          <Lock className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-medium">Access Denied</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            You don't have permission to access this repository. Please contact
            the repository owner for access.
          </p>
          <div className="flex gap-4">
            {userData ? (
              <Button onClick={() => router.push("/")}>
                Return to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Log In
                </Button>
                <Button onClick={() => router.push("/signup")}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default AccessDenied;
