"use client";
import { useUser } from "@clerk/nextjs";
import { Fragment, useEffect } from "react";
import { useFlash } from "./Flash.component";
import { handleClientError } from "@/lib/utils";
import axios from "axios";
import { useUserContext } from "@/context/userContext";

const Logger = () => {
  const { user, isSignedIn } = useUser();
  const { setUserData } = useUserContext();
  console.log(
    "USER => ",
    user,
    user?.fullName,
    user?.primaryEmailAddress?.emailAddress,
    user?.imageUrl
  );
  const { flash } = useFlash();
  useEffect(() => {
    // Async Fucntion definition :

    const registerUser = async () => {
      const response = await axios.post("/api/user/register", {
        username: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        src: user?.imageUrl,
      });
      console.log(" [REGISTER_USER] : ", response.data);
      setUserData(response.data.userData);
    };

    try {
      if (isSignedIn) {
        registerUser();
      }
    } catch (e: any) {
      handleClientError(e, "LOGGER.COMPONENT.TSX", flash);
    }
  }, [user]);
  return <Fragment></Fragment>;
};
export default Logger;
