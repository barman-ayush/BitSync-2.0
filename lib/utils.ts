/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge"
import { AppError } from "./errorHandler";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function handleError({ error, route, statusCode = 500 }: { error: any, statusCode: number, route: string }) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  console.log(` [${route}] : `, error);
  console.error("Error completing match : ", errorMessage);
  return NextResponse.json(
    { error: errorMessage },
    { status: statusCode }
  );
}


export function handleClientError(error: any, origin: string, flash: any
) {
  console.log(` [${origin}] : `, error);
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    flash(message, { variant: "error" })
  } else {
    const { message = `ERROR IN [${origin}] ` } = error;
    flash(message, { variant: "error" })
  }
}

