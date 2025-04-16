"use client";

import React, { useState, useEffect } from "react";
import {
  Folder,
  File,
  Users,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Search,
  Eye,
  Edit,
  Shield,
  Home,
  ArrowRight,
  Download,
  Share,
  Clock,
  GitBranch,
  Menu,
  X,
  Lock,
  XCircle,
  Loader2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useFlash } from "./Flash.component";
import { handleClientError } from "@/lib/utils";
import axios from "axios";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import RepoAccess from "./repo-access.component";
import MergeConflictResolver from "./merge-conflict.component";

// Types based on the Prisma schema
enum NodeType {
  FILE = "FILE",
  FOLDER = "FOLDER",
}

interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  email : string;
}

interface RepoData {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FileSystemNode {
  id: string;
  name: string;
  type: NodeType;
  mimeType?: string;
  size?: number;
  contentUrl?: string;
  createdAt: string;
  updatedAt: string;
  children?: FileSystemNode[];
  parentId?: string | null;
}


export interface RepositoryDetails {
  repo: RepoData;
  owner: User;
  rootNodes: FileSystemNode[];
  admins: User[] | [];
  collaborators: User[] | [];
  viewers: User[] | [];
}

// Sample data for commits (API doesn't yet return commits)
// const commits = [
//   {
//     id: "commit-1",
//     message: "Initial commit",
//     commitHash: "a1b2c3d4e5f6",
//     createdAt: new Date().toISOString(),
//     author: {
//       id: "user-1",
//       username: "system",
//       email: "system@example.com",
//     },
//   },
// ];

export default function RepositoryViewer({
  user,
  repo,
}: {
  user: string;
  repo: string;
}) {
  const { flash } = useFlash();
  const userContext = useUserContext();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [repoDetails, setRepoDetails] = useState<RepositoryDetails | null>(
    null
  );

  const [activeTab, setActiveTab] = useState("files");
  const [commits, setcommits] = useState<any>([]);
  const [selectedCommit, setSelectedCommit] = useState(commits[0]?.id || "");
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [folderNodes, setFolderNodes] = useState<
    Record<string, FileSystemNode[]>
  >({});

  // UseEffect Helpers
  const fetchRepoDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      setAccessDenied(false);

      const res = await axios.get(
        `/api/user/repository?name=${repo}&user_name=${user}&id=${userContext?.userData?.id}`
      );

      console.log("RES", res);

      if (res.data.success) {
        setRepoDetails(res.data.data);
      } else {
        setError("Failed to load repository details");
      }
    } catch (error: any) {
      console.error("Error fetching repository:", error);

      if (error.response?.status === 403) {
        setAccessDenied(true);
      } else if (error.response?.status === 404) {
        setError("Repository not found");
      } else {
        setError("Failed to load repository");
        handleClientError(error, "REPOSITORY_COMPONENT", flash);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("User Change observerd");
    if (userContext.userData) {
      console.log("User");
      fetchRepoDetails();
    }
  }, [userContext.userData]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();
    // fetchRepoDetails();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Function to get the current folder nodes based on the path
  const getCurrentFolder = (): FileSystemNode[] => {
    if (!repoDetails) return [];

    if (currentPath.length === 0) {
      return repoDetails.rootNodes;
    }

    // Create path key
    const pathKey = currentPath.join("/");
    return folderNodes[pathKey] || [];
  };

  // Function to navigate to a folder and fetch its contents
  const navigateToFolder = async (folderId: string, folderName: string) => {
    try {
      const newPath = [...currentPath, folderName];
      setCurrentPath(newPath);

      // Create path key
      const pathKey = newPath.join("/");

      // Check if we already have the folder's contents
      if (!folderNodes[pathKey]) {
        // Here you would fetch the folder's contents from the API
        // For now, we'll just set an empty array as placeholder
        setFolderNodes({
          ...folderNodes,
          [pathKey]: [],
        });

        /* When API endpoint is available:
        const res = await axios.get(`/api/user/repository/files?repoId=${repoDetails.repo.id}&folderId=${folderId}`);
        if (res.data.success) {
          setFolderNodes({
            ...folderNodes,
            [pathKey]: res.data.data.nodes
          });
        }
        */
      }
    } catch (error) {
      flash("Failed to load folder contents", { variant: "error" });
      console.error("Error navigating to folder:", error);
    }
  };

  // Function to navigate up one level
  const navigateUp = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  // Function to navigate to a specific path index
  const navigateToPathIndex = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  // Function to format file size
  const formatFileSize = (bytes?: number): string => {
    if (bytes === undefined) return "N/A";

    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Function to get icon for file type
  const getFileIcon = (node: FileSystemNode) => {
    if (node.type === NodeType.FOLDER) {
      return <Folder className="h-5 w-5 text-blue-500" />;
    }

    // Basic file type detection
    const fileExtension = node.name.split(".").pop()?.toLowerCase();

    switch (fileExtension) {
      case "pdf":
        return <File className="h-5 w-5 text-red-500" />;
      case "doc":
      case "docx":
        return <File className="h-5 w-5 text-blue-700" />;
      case "xls":
      case "xlsx":
        return <File className="h-5 w-5 text-green-600" />;
      case "ppt":
      case "pptx":
        return <File className="h-5 w-5 text-orange-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <File className="h-5 w-5 text-purple-500" />;
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
        return <File className="h-5 w-5 text-yellow-500" />;
      case "html":
      case "css":
        return <File className="h-5 w-5 text-orange-400" />;
      case "md":
        return <File className="h-5 w-5 text-gray-500" />;
      default:
        return <File className="h-5 w-5 text-gray-400" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <h3 className="text-xl font-medium">Loading repository...</h3>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-md">
          <XCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-xl font-medium">Repository Not Found</h3>
          <p className="text-muted-foreground mt-2 mb-6">{error}</p>
          <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Access denied state
  if (accessDenied) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-md">
          <Lock className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-medium">Access Denied</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            You don't have permission to access this repository. Please contact
            the repository owner for access.
          </p>
          <div className="flex gap-4">
            {userContext.userData ? (
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
    );
  }

  if (!repoDetails) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-medium">No repository data available</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-background flex relative">
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 p-1 bg-background border border-border rounded-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transform transition-transform duration-200 ease-in-out
        fixed md:relative z-40 md:z-auto w-64 border-r border-border bg-card h-full p-4 flex flex-col shadow-lg md:shadow-none`}
      >
        <div className="flex items-center space-x-2 mb-6">
          <GitBranch className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold truncate">
            {repoDetails.repo.name}
          </h2>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Avatar className="h-8 w-8">
            <img
              src={
                repoDetails.owner.avatarUrl || "https://github.com/shadcn.png"
              }
              alt={repoDetails.owner.username}
            />
          </Avatar>
          <div className="text-sm">
            <div className="font-medium">{repoDetails.owner.username}</div>
            <div className="text-muted-foreground text-xs">Owner</div>
          </div>
        </div>

        <div className="mb-4">
          {repoDetails.repo.isPublic ? (
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-green-500/10 text-green-500 border-green-500/20"
            >
              <Eye className="h-3 w-3" /> Public
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-amber-500/10 text-amber-500 border-amber-500/20"
            >
              <Shield className="h-3 w-3" /> Private
            </Badge>
          )}
        </div>

        <div className="text-sm text-muted-foreground mb-6">
          {repoDetails.repo.description || "No description provided"}
        </div>

        <div className="space-y-1 mb-6">
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "files" ? "bg-accent" : ""
            }`}
            onClick={() => setActiveTab("files")}
          >
            <Folder className="mr-2 h-4 w-4" />
            Files
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "access" ? "bg-accent" : ""
            }`}
            onClick={() => setActiveTab("access")}
          >
            <Users className="mr-2 h-4 w-4" />
            Access Settings
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "conflicts" ? "bg-accent" : ""
            }`}
            onClick={() => setActiveTab("conflicts")}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Conflicts
          </Button>
        </div>

        <div className="mt-auto">
          <div className="text-xs text-muted-foreground mb-2">
            Repository Stats
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Commits:</span>
              <span>{commits.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Created:</span>
              <span>
                {new Date(repoDetails.repo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile sidebar (only visible when sidebar is open on mobile) */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="border-b border-border p-4 bg-background md:pl-4 pl-16">
          <h1 className="text-2xl font-bold mb-1">{repoDetails.repo.name}</h1>
          <p className="text-muted-foreground">
            {repoDetails.repo.description}
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <TabsContent
            value="files"
            className="flex-1 p-0 m-0 overflow-hidden flex flex-col"
          >
            <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Select
                  value={selectedCommit}
                  onValueChange={setSelectedCommit}
                >
                  <SelectTrigger className="w-full md:w-[250px]">
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {commits.map((commit: any) => (
                      <SelectItem key={commit.id} value={commit.id}>
                        <div className="flex items-center">
                          <span className="truncate">{commit.message}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({commit.commitHash.substring(0, 7)})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {commits.find((c: any) => c.id === selectedCommit)
                      ?.createdAt
                      ? new Date(
                          commits.find((c: any) => c.id === selectedCommit)
                            ?.createdAt || ""
                        ).toLocaleString()
                      : "Unknown date"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                {commits.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">Download</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 md:flex-none"
                >
                  <Share className="h-4 w-4 mr-2" />
                  <span className="whitespace-nowrap">Share</span>
                </Button>
              </div>
            </div>

            {/* Breadcrumb and Upload Button */}
            {
              <>
                <div className="flex items-center justify-between p-2 bg-muted/30 text-sm">
                  <div className="flex items-center overflow-x-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 flex-shrink-0"
                      onClick={() => setCurrentPath([])}
                    >
                      <Home className="h-4 w-4" />
                    </Button>

                    {currentPath.length > 0 && (
                      <>
                        <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground flex-shrink-0" />
                        <div className="flex items-center overflow-x-auto hide-scrollbar">
                          {currentPath.map((path, index) => (
                            <React.Fragment key={index}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 flex-shrink-0 whitespace-nowrap"
                                onClick={() => navigateToPathIndex(index)}
                              >
                                {path}
                              </Button>
                              {index < currentPath.length - 1 && (
                                <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground flex-shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Upload Button */}
                  <Button variant="outline" size="sm" className="flex-shrink-0">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>

                {/* File Explorer */}
                {commits.length == 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg mx-4 my-6">
                    <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No commits yet</h3>
                    <p className="text-muted-foreground text-center mb-6 max-w-md">
                      This repository doesn't have any commits. Create your
                      first commit to begin tracking changes to your files.
                    </p>
                    <Button className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="flex-1 p-0">
                    <div className="min-w-full divide-y divide-border">
                      <div className="grid grid-cols-12 py-2 px-4 text-xs font-medium text-muted-foreground bg-muted/30">
                        <div className="col-span-12 md:col-span-6">Name</div>
                        <div className="hidden md:block md:col-span-2">
                          Size
                        </div>
                        <div className="hidden md:block md:col-span-4">
                          Last Modified
                        </div>
                      </div>

                      {currentPath.length > 0 && (
                        <div
                          className="grid grid-cols-12 py-2 px-4 hover:bg-accent/50 cursor-pointer"
                          onClick={navigateUp}
                        >
                          <div className="col-span-12 md:col-span-6 flex items-center">
                            <Folder className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                            <span className="truncate">..</span>
                            <span className="ml-2 text-xs text-muted-foreground md:hidden">
                              -
                            </span>
                          </div>
                          <div className="hidden md:block md:col-span-2">-</div>
                          <div className="hidden md:block md:col-span-4">-</div>
                        </div>
                      )}

                      {getCurrentFolder().length === 0 && (
                        <div className="py-8 text-center text-muted-foreground">
                          {currentPath.length === 0
                            ? "This repository is empty"
                            : "This folder is empty"}
                        </div>
                      )}

                      {getCurrentFolder()
                        .sort((a, b) => {
                          // Sort folders first, then files
                          if (
                            a.type === NodeType.FOLDER &&
                            b.type !== NodeType.FOLDER
                          )
                            return -1;
                          if (
                            a.type !== NodeType.FOLDER &&
                            b.type === NodeType.FOLDER
                          )
                            return 1;
                          return a.name.localeCompare(b.name);
                        })
                        .map((node) => (
                          <div
                            key={node.id}
                            className="grid grid-cols-12 py-2 px-4 hover:bg-accent/50 cursor-pointer"
                            onClick={() =>
                              node.type === NodeType.FOLDER
                                ? navigateToFolder(node.id, node.name)
                                : null
                            }
                          >
                            <div className="col-span-12 md:col-span-6 flex items-center">
                              {getFileIcon(node)}
                              <span className="ml-2 truncate">{node.name}</span>
                              <span className="ml-2 text-xs text-muted-foreground md:hidden">
                                {node.type === NodeType.FOLDER
                                  ? "-"
                                  : formatFileSize(node.size)}
                              </span>
                            </div>
                            <div className="hidden md:block md:col-span-2 text-sm text-muted-foreground">
                              {node.type === NodeType.FOLDER
                                ? "-"
                                : formatFileSize(node.size)}
                            </div>
                            <div className="hidden md:block md:col-span-4 text-sm text-muted-foreground">
                              {new Date(node.updatedAt).toLocaleString()}
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                )}
              </>
            }
          </TabsContent>

          <TabsContent value="access" className="flex-1 p-4 overflow-auto">
            <RepoAccess repoDetails={repoDetails} />
          </TabsContent>

          <TabsContent value="conflicts" className="flex-1 p-4 overflow-auto">
            <MergeConflictResolver />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
