"use client";

enum NodeType {
  FILE = 'FILE',
  FOLDER = 'FOLDER'
}

// Sample data following the Prisma schema
export const sampleRepository = {
  id: "clqw5t8xc0000abcdefghijk",
  name: "project-dashboard",
  description: "Modern dashboard application with multiple data visualization components",
  isPublic: true,
  createdAt: "2025-03-15T14:23:45Z",
  updatedAt: "2025-04-12T09:17:22Z",
  
  owner: {
    id: "clqw5uh7e0001lmnopqrstuv",
    username: "alexcoder",
    email: "alex@example.com",
    avatarUrl: "https://i.pravatar.cc/150?u=alexcoder"
  },
  
  admins: [
    {
      id: "clqw5uh7e0002wxyzabcdefg",
      username: "sarahdev",
      email: "sarah@example.com",
      avatarUrl: "https://i.pravatar.cc/150?u=sarahdev"
    }
  ],
  
  collaborators: [
    {
      id: "clqw5uh7e0003hijklmnopqr",
      username: "mikejs",
      email: "mike@example.com",
      avatarUrl: "https://i.pravatar.cc/150?u=mikejs"
    },
    {
      id: "clqw5uh7e0004stuvwxyzabc",
      username: "emilycss",
      email: "emily@example.com",
      avatarUrl: "https://i.pravatar.cc/150?u=emilycss"
    }
  ],
  
  viewers: [
    {
      id: "clqw5uh7e0005defghijklmn",
      username: "jasonqa",
      email: "jason@example.com",
      avatarUrl: "https://i.pravatar.cc/150?u=jasonqa"
    }
  ],
  
  commits: [
    {
      id: "clqw5vmpd0006opqrstuvwxy",
      message: "Initial commit with project structure",
      commitHash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      createdAt: "2025-03-15T14:30:22Z",
      author: {
        id: "clqw5uh7e0001lmnopqrstuv",
        username: "alexcoder",
        email: "alex@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=alexcoder"
      }
    },
    {
      id: "clqw5vmpd0007zabcdefghij",
      message: "Add dashboard components and layouts",
      commitHash: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7",
      createdAt: "2025-03-18T10:15:33Z",
      author: {
        id: "clqw5uh7e0003hijklmnopqr",
        username: "mikejs",
        email: "mike@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=mikejs"
      }
    },
    {
      id: "clqw5vmpd0008klmnopqrstu",
      message: "Implement authentication system",
      commitHash: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8",
      createdAt: "2025-03-25T16:42:11Z",
      author: {
        id: "clqw5uh7e0002wxyzabcdefg",
        username: "sarahdev",
        email: "sarah@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=sarahdev"
      }
    },
    {
      id: "clqw5vmpd0009vwxyzabcdef",
      message: "Update styling and responsive design",
      commitHash: "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9",
      createdAt: "2025-04-02T09:35:18Z",
      author: {
        id: "clqw5uh7e0004stuvwxyzabc",
        username: "emilycss",
        email: "emily@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=emilycss"
      }
    },
    {
      id: "clqw5vmpd0010ghijklmnopq",
      message: "Fix bug in data visualization module",
      commitHash: "e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
      createdAt: "2025-04-12T09:17:22Z",
      author: {
        id: "clqw5uh7e0001lmnopqrstuv",
        username: "alexcoder",
        email: "alex@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=alexcoder"
      }
    }
  ],
  
  rootNodes: [
    {
      id: "clqw5wpnh0011rstuvwxyzab",
      name: "src",
      type: NodeType.FOLDER,
      createdAt: "2025-03-15T14:30:22Z",
      updatedAt: "2025-03-15T14:30:22Z",
      children: [
        {
          id: "clqw5wpnh0012cdefghijklm",
          name: "components",
          type: NodeType.FOLDER,
          createdAt: "2025-03-15T14:30:22Z",
          updatedAt: "2025-03-18T10:15:33Z",
          parentId: "clqw5wpnh0011rstuvwxyzab",
          children: [
            {
              id: "clqw5wpnh0013nopqrstuvwx",
              name: "Dashboard.tsx",
              type: NodeType.FILE,
              mimeType: "text/typescript",
              size: 4235,
              createdAt: "2025-03-18T10:15:33Z",
              updatedAt: "2025-04-02T09:35:18Z",
              parentId: "clqw5wpnh0012cdefghijklm"
            },
            {
              id: "clqw5wpnh0014yzabcdefghi",
              name: "Sidebar.tsx",
              type: NodeType.FILE,
              mimeType: "text/typescript",
              size: 2860,
              createdAt: "2025-03-18T10:15:33Z",
              updatedAt: "2025-04-02T09:35:18Z",
              parentId: "clqw5wpnh0012cdefghijklm"
            },
            {
              id: "clqw5wpnh0015jklmnopqrst",
              name: "DataCard.tsx",
              type: NodeType.FILE,
              mimeType: "text/typescript",
              size: 1842,
              createdAt: "2025-03-18T10:15:33Z",
              updatedAt: "2025-04-12T09:17:22Z",
              parentId: "clqw5wpnh0012cdefghijklm"
            }
          ]
        },
        {
          id: "clqw5wpnh0016uvwxyzabcde",
          name: "hooks",
          type: NodeType.FOLDER,
          createdAt: "2025-03-15T14:30:22Z",
          updatedAt: "2025-03-25T16:42:11Z",
          parentId: "clqw5wpnh0011rstuvwxyzab",
          children: [
            {
              id: "clqw5wpnh0017fghijklmnop",
              name: "useAuth.ts",
              type: NodeType.FILE,
              mimeType: "text/typescript",
              size: 3218,
              createdAt: "2025-03-25T16:42:11Z",
              updatedAt: "2025-03-25T16:42:11Z",
              parentId: "clqw5wpnh0016uvwxyzabcde"
            },
            {
              id: "clqw5wpnh0018qrstuvwxyza",
              name: "useData.ts",
              type: NodeType.FILE,
              mimeType: "text/typescript",
              size: 2945,
              createdAt: "2025-03-25T16:42:11Z",
              updatedAt: "2025-04-12T09:17:22Z",
              parentId: "clqw5wpnh0016uvwxyzabcde"
            }
          ]
        },
        {
          id: "clqw5wpnh0019bcdefghijkl",
          name: "styles",
          type: NodeType.FOLDER,
          createdAt: "2025-03-15T14:30:22Z",
          updatedAt: "2025-04-02T09:35:18Z",
          parentId: "clqw5wpnh0011rstuvwxyzab",
          children: [
            {
              id: "clqw5wpnh0020mnopqrstuvw",
              name: "global.css",
              type: NodeType.FILE,
              mimeType: "text/css",
              size: 4820,
              createdAt: "2025-03-15T14:30:22Z",
              updatedAt: "2025-04-02T09:35:18Z",
              parentId: "clqw5wpnh0019bcdefghijkl"
            },
            {
              id: "clqw5wpnh0021xyzabcdefgh",
              name: "dashboard.module.css",
              type: NodeType.FILE,
              mimeType: "text/css",
              size: 2375,
              createdAt: "2025-03-18T10:15:33Z",
              updatedAt: "2025-04-02T09:35:18Z",
              parentId: "clqw5wpnh0019bcdefghijkl"
            }
          ]
        },
        {
          id: "clqw5wpnh0022ijklmnopqrs",
          name: "utils",
          type: NodeType.FOLDER,
          createdAt: "2025-03-15T14:30:22Z",
          updatedAt: "2025-03-15T14:30:22Z",
          parentId: "clqw5wpnh0011rstuvwxyzab",
          children: [
            {
              id: "clqw5wpnh0023tuvwxyzabcd",
              name: "formatters.ts",
              type: NodeType.FILE,
              mimeType: "text/typescript",
              size: 1580,
              createdAt: "2025-03-15T14:30:22Z",
              updatedAt: "2025-03-15T14:30:22Z",
              parentId: "clqw5wpnh0022ijklmnopqrs"
            },
            {
              id: "clqw5wpnh0024efghijklmno",
              name: "api.ts",
              type: NodeType.FILE,
              mimeType: "text/typescript",
              size: 3750,
              createdAt: "2025-03-15T14:30:22Z",
              updatedAt: "2025-04-12T09:17:22Z",
              parentId: "clqw5wpnh0022ijklmnopqrs"
            }
          ]
        },
        {
          id: "clqw5wpnh0025pqrstuvwxyz",
          name: "App.tsx",
          type: NodeType.FILE,
          mimeType: "text/typescript",
          size: 1240,
          createdAt: "2025-03-15T14:30:22Z",
          updatedAt: "2025-03-25T16:42:11Z",
          parentId: "clqw5wpnh0011rstuvwxyzab"
        },
        {
          id: "clqw5wpnh0026abcdefghijk",
          name: "index.tsx",
          type: NodeType.FILE,
          mimeType: "text/typescript",
          size: 850,
          createdAt: "2025-03-15T14:30:22Z",
          updatedAt: "2025-03-15T14:30:22Z",
          parentId: "clqw5wpnh0011rstuvwxyzab"
        }
      ]
    },
    {
      id: "clqw5wpnh0027lmnopqrstuv",
      name: "public",
      type: NodeType.FOLDER,
      createdAt: "2025-03-15T14:30:22Z",
      updatedAt: "2025-03-15T14:30:22Z",
      children: [
        {
          id: "clqw5wpnh0028wxyzabcdefg",
          name: "assets",
          type: NodeType.FOLDER,
          createdAt: "2025-03-15T14:30:22Z",
          updatedAt: "2025-03-15T14:30:22Z",
          parentId: "clqw5wpnh0027lmnopqrstuv",
          children: [
            {
              id: "clqw5wpnh0029hijklmnopqr",
              name: "logo.svg",
              type: NodeType.FILE,
              mimeType: "image/svg+xml",
              size: 4250,
              createdAt: "2025-03-15T14:30:22Z",
              updatedAt: "2025-03-15T14:30:22Z",
              parentId: "clqw5wpnh0028wxyzabcdefg"
            },
            {
              id: "clqw5wpnh0030stuvwxyzabc",
              name: "background.jpg",
              type: NodeType.FILE,
              mimeType: "image/jpeg",
              size: 275840,
              createdAt: "2025-03-15T14:30:22Z",
              updatedAt: "2025-03-15T14:30:22Z",
              parentId: "clqw5wpnh0028wxyzabcdefg"
            }
          ]
        },
        {
          id: "clqw5wpnh0031defghijklmn",
          name: "favicon.ico",
          type: NodeType.FILE,
          mimeType: "image/x-icon",
          size: 4286,
          createdAt: "2025-03-15T14:30:22Z",
          updatedAt: "2025-03-15T14:30:22Z",
          parentId: "clqw5wpnh0027lmnopqrstuv"
        },
        {
          id: "clqw5wpnh0032opqrstuvwxy",
          name: "index.html",
          type: NodeType.FILE,
          mimeType: "text/html",
          size: 1850,
          createdAt: "2025-03-15T14:30:22Z",
          updatedAt: "2025-03-25T16:42:11Z",
          parentId: "clqw5wpnh0027lmnopqrstuv"
        }
      ]
    },
    {
      id: "clqw5wpnh0033zabcdefghij",
      name: "README.md",
      type: NodeType.FILE,
      mimeType: "text/markdown",
      size: 4560,
      createdAt: "2025-03-15T14:30:22Z",
      updatedAt: "2025-04-12T09:17:22Z"
    },
    {
      id: "clqw5wpnh0034klmnopqrstu",
      name: "package.json",
      type: NodeType.FILE,
      mimeType: "application/json",
      size: 1240,
      createdAt: "2025-03-15T14:30:22Z",
      updatedAt: "2025-04-02T09:35:18Z"
    },
    {
      id: "clqw5wpnh0035vwxyzabcdef",
      name: "tsconfig.json",
      type: NodeType.FILE,
      mimeType: "application/json",
      size: 980,
      createdAt: "2025-03-15T14:30:22Z",
      updatedAt: "2025-03-15T14:30:22Z"
    }
  ]
};