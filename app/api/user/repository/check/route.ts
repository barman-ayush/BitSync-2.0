import { AppError } from "@/lib/errorHandler";
import prismadb from "@/lib/prismadb";
import { handleError } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, repoName } = body;
        if (!userId || !repoName) throw new AppError("Credentials Required")

        const doesRepoExist = await prismadb.repo.findFirst({
            where: {
                ownerId: userId,
                name: repoName
            }
        });

        console.log("[ CHECK ] : " , doesRepoExist);

        if (!doesRepoExist) return NextResponse.json({ success: "true", message: "Repository under the same name already exists!" })
        return NextResponse.json({ success: "true", message: "Looks Good !" })

    } catch (error: any) {
        return handleError({ error, route: "REPO_CHECK", statusCode: 500 })
    }
}