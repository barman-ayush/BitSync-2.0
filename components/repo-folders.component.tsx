import React, { Fragment, useState } from "react";
import { Button } from "./ui/button";
import { Download, Share } from "lucide-react";
import {
  BreadcrumbNode,
  ContextFileNodes,
  FileSystemNode,
  RepositoryDetails,
} from "@/lib/type";
import { useFlash } from "./Flash.component";
import { useUploadedStreamContext } from "@/context/fileContext";
import BreadCrumbs from "./bread-crumb.component";
import CommitBar from "./commit-bar.component";
import DynamicFolderStructure from "./folder-navigator.component";
import { useBreadcrumbContext } from "@/context/breadCrumbContext";

const RepoFolders = ({
  repoDetails,
  commits,
}: {
  repoDetails: RepositoryDetails;
  commits: any;
}) => {
  // Context Uses
  const { uploadedStream } = useUploadedStreamContext();
  const {currentPath , setCurrentPath} = useBreadcrumbContext();

  const { flash } = useFlash();
  const [selectedCommit, setSelectedCommit] = useState(commits[0]?.id || "");
  const [folderNodes, setFolderNodes] = useState<
    Record<string, FileSystemNode[]>
  >({});



  // Function to get the current repository folder nodes based on the path
  const getCurrentRepoFolder = (): FileSystemNode[] => {
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
    // try {
    //   const newPath = [...currentPath, folderName];
    //   setCurrentPath(newPath);
    //   // Create path key
    //   const pathKey = newPath.join("/");
    //   // Check if we already have the folder's contents
    //   if (!folderNodes[pathKey]) {
    //     // Here you would fetch the folder's contents from the API
    //     // For now, we'll just set an empty array as placeholder
    //     setFolderNodes({
    //       ...folderNodes,
    //       [pathKey]: [],
    //     });
    //     /* When API endpoint is available:
    //     const res = await axios.get(`/api/user/repository/files?repoId=${repoDetails.repo.id}&folderId=${folderId}`);
    //     if (res.data.success) {
    //       setFolderNodes({
    //         ...folderNodes,
    //         [pathKey]: res.data.data.nodes
    //       });
    //     }
    //     */
    //   }
    // } catch (error) {
    //   flash("Failed to load folder contents", { variant: "error" });
    //   console.error("Error navigating to folder:", error);
    // }
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

  return (
    <Fragment>
      <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-border">
        <CommitBar
          selectedCommit={selectedCommit}
          setSelectedCommit={setSelectedCommit}
          commits={commits}
        />

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
      <BreadCrumbs
        navigateToPathIndex={navigateToPathIndex}
      />
      <DynamicFolderStructure
        commits={commits}
        navigateUp={navigateUp}
        getCurrentRepoFolder={getCurrentRepoFolder}
        navigateToFolder={navigateToFolder}
      />
    </Fragment>
  );
};
export default RepoFolders;
