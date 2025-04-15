/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */

import { AppError } from "@/lib/errorHandler";
import prismadb from "@/lib/prismadb";
import { handleError } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest
) {
    try {
        const body = await request.json();
        const { username, email }: { username: string; email: string } = body;
        if (!username || !email) {
            throw new AppError("Username and Email is required !!");
        }

        var userData = await prismadb.user.findUnique({
            where: { email: email },
        });

        if (!userData) {
            userData = await prismadb.user.create({
                data: {
                    password: "",
                    email,
                    username,
                    avatarUrl: body?.src || "",
                },
            });
        }

        return NextResponse.json({ userData });
    } catch (error) {
        return handleError({ error, route: "RESITER_USER", statusCode: 500 })
    }
}