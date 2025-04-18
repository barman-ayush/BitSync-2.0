/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "@/lib/errorHandler";
import prismadb from "@/lib/prismadb";
import { handleError } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, description = "", isPublic = true } = body;
        console.log("[ BODY ]  : " , body);
        if (!id || !name) {
            throw new AppError("Data Missing !!");
        }

        const doesRepoExist = await prismadb.repo.findFirst({
            where: {
                ownerId: id,
                name: name
            }
        });

        if (doesRepoExist) return NextResponse.json({ success: false, message: "Repository with same name already exists!" });


        const repoData = await prismadb.repo.create({
            data: {
                ownerId: id, name, description, isPublic, admins: {
                    connect: { id: id }
                }
            }
        })

        return NextResponse.json({ success: "true", repoData });
    } catch (error: any) {
        return handleError({ error, route: "NEW_REPOSITORY", statusCode: 500 });
    }
}