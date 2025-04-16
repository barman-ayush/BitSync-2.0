// app/api/users/search/route.ts
import { AppError } from "@/lib/errorHandler";
import prismadb from "@/lib/prismadb";
import { handleError } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const usernamePrefix = searchParams.get("username");
        const excludeUserId = searchParams.get("excludeUserId");
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        if (!usernamePrefix) {
            throw new AppError("Missing query parameter: username", 400);
        }

        // Create a filter object
        const filter: any = {
            username: {
                startsWith: usernamePrefix,
            },
        };

        // Add exclusion if provided
        // if (excludeUserId) {
        //     filter.id = {
        //         not: excludeUserId,
        //     };
        // }

        // Find users with matching username prefix
        const users = await prismadb.user.findMany({
            where: filter,
            select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true,
                bio: true,
            },
            take: limit, // Limit the number of results
            orderBy: {
                username: "asc", // Sort alphabetically
            },
        });

        return NextResponse.json({
            success: true,
            data: users,
        });
    } catch (error: any) {
        return handleError({
            error,
            route: "USERS_SEARCH",
            statusCode: error.statusCode || 500
        });
    }
}