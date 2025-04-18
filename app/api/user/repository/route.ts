import { AppError } from "@/lib/errorHandler";
import prismadb from "@/lib/prismadb";
import { handleError } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    // page route has => /.../username/reponame
    const username = searchParams.get("user_name");
    const name = searchParams.get("name");
    const currentUserId = searchParams.get("id");

    if (!username || !name) {
      throw new AppError("Missing query parameters: user_id or name");
    }

    console.log(username, name, currentUserId);

    const ownerDetails = await prismadb.user.findFirst({ where: { username: username } })

    if (!ownerDetails) throw new AppError("No Such user found !!", 500);

    // Fetch repo details, owner, and permission groups
    const repo = await prismadb.repo.findFirst({
      where: {
        name,
        ownerId: ownerDetails.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            bio: true,
          },
        },
        admins: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            bio: true,
          }
        },
        collaborators: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            bio: true,
          }
        },
        viewers: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            bio: true,
          }
        },
        commits: { select: { commitHash: true, id: true, message: true } }
      },
    });

    console.log("REPO", repo)

    if (!repo) {
      throw new AppError("Repository not found", 404);
    }

    const isOwner = currentUserId === repo.ownerId;
    const hasAccess =
      repo.isPublic ||
      isOwner ||
      repo.admins.some(user => user.id === currentUserId) ||
      repo.collaborators.some(user => user.id === currentUserId) ||
      repo.viewers.some(user => user.id === currentUserId);

    if (!hasAccess) {
      return NextResponse.json({success : false , message : "Not Allowed to access!"})
      // throw new AppError("You do not have permission to access this repository", 403);
    }

    // Fetch root nodes (files + folders with parentId null)
    const rootNodes = await prismadb.fileSystemNode.findMany({
      where: {
        repoId: repo.id,
        parentId: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        name: true,
        type: true,
        mimeType: true,
        size: true,
        contentUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        repo: {
          id: repo.id,
          name: repo.name,
          description: repo.description,
          isPublic: repo.isPublic,
          createdAt: repo.createdAt,
          updatedAt: repo.updatedAt,
          commits: repo.commits
        },
        owner: repo.owner,
        rootNodes,
        admins : repo.admins,
        viewers : repo.viewers,
        collaborators : repo.collaborators,
      },
    });
  } catch (error: any) {
    return handleError({ error, route: "FETCH_REPO_DETAIL", statusCode: 500 });
  }
}
