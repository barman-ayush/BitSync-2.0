import React, { Fragment, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import {
  ChevronRight,
  Clock,
  Download,
  File,
  Folder,
  GitBranch,
  Home,
  Share,
  Upload,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { FileSystemNode, NodeType, RepositoryDetails } from "@/lib/type";
import { useFlash } from "./Flash.component";
const RepoFolders = ({
  repoDetails,
  commits,
}: {
  repoDetails: RepositoryDetails;
  commits: any;
}) => {
  const { flash } = useFlash();
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedCommit, setSelectedCommit] = useState(commits[0]?.id || "");
  const [folderNodes, setFolderNodes] = useState<
    Record<string, FileSystemNode[]>
  >({});

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

  return (
    <Fragment>
      <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Select value={selectedCommit} onValueChange={setSelectedCommit}>
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
              {commits.find((c: any) => c.id === selectedCommit)?.createdAt
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
            <Button variant="outline" size="sm" className="flex-1 md:flex-none">
              <Download className="h-4 w-4 mr-2" />
              <span className="whitespace-nowrap">Download</span>
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex-1 md:flex-none">
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
                    {currentPath.map((path: any, index: any) => (
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
                This repository doesn't have any commits. Create your first
                commit to begin tracking changes to your files.
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
                  <div className="hidden md:block md:col-span-2">Size</div>
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
    </Fragment>
  );
};
export default RepoFolders;
