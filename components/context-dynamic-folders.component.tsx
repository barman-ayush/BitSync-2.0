"use client";
import { useBreadcrumbContext } from "@/context/breadCrumbContext";
import { useUploadedStreamContext } from "@/context/fileContext";
import { formatFileSize, getNonUploadedFileIcon } from "@/lib/helpers";
import { BreadcrumbNode, ContextFileNodes, NodeType } from "@/lib/type";
import { Fragment, useEffect, useState } from "react";
import { Folder } from "lucide-react";

const DynamicContextNodes = () => {
  const { currentPath, navigateNextFolder } = useBreadcrumbContext();
  const { uploadedStream } = useUploadedStreamContext();

  // File and its functions
  // Function to handle file click
  const handleFileClick = (file: any) => {
    // You'll implement file preview/selection logic here later
    console.log("File clicked:", file.fileName);
  };

  // Folders and its functions

  const [currentFolderChildren, setCurrentFolderChildren] = useState<
    ContextFileNodes[]
  >([]);

  useEffect(() => {
    if (currentPath.length === 0) {
      setCurrentFolderChildren(
        uploadedStream.filter((file) => file.levelOrder === 0)
      );
    } else {
      const currentNode = currentPath[currentPath.length - 1];
      setCurrentFolderChildren(
        uploadedStream.filter(
          (file) => file.levelOrder === currentNode.level + 1
        )
      );
    }
  }, [currentPath]);

  // Function to check if a node is a folder
  const isFolder = (node: ContextFileNodes) => {
    return !node.fileContent;
  };
  // Sort nodes - folders first, then files
  const sortedNodes = (): ContextFileNodes[] => {
    const nodes: ContextFileNodes[] = currentFolderChildren;
    return nodes.sort((a: ContextFileNodes, b: ContextFileNodes) => {
      // Determine if nodes are folders based on filename or type (if you add a type property later)
      const isAFolder = isFolder(a);
      const isBFolder = isFolder(b);

      // Sort folders first
      if (isAFolder && !isBFolder) return -1;
      if (!isAFolder && isBFolder) return 1;

      // Then alphabetically
      return a.fileName.localeCompare(b.fileName);
    });
  };

  // Function to handle folder click (navigate to it)
  const handleFolderClick = (folder: ContextFileNodes) => {
    const BreadCrumbNode: BreadcrumbNode = {
      nodeName: folder.fileName,
      level: folder.levelOrder,
      isContextFolder: true,
    };

    navigateNextFolder(BreadCrumbNode);
  };

  // Function to get proper folder name display (remove trailing slash if present)
  const getFolderDisplayName = (folderName: any) => {
    return folderName.endsWith("/") ? folderName.slice(0, -1) : folderName;
  };

  return (
    <Fragment>
      {/* Non-uploaded Files/Folders Header */}
      {sortedNodes().length > 0 && (
        <div className="py-2 px-4 bg-yellow-50 text-xs font-medium text-yellow-800">
          Non-uploaded Files
        </div>
      )}

      {/* Display Folders and Files */}
      {sortedNodes().map((node: ContextFileNodes, index: number) => (
        <div
          key={`non-uploaded-${index}`}
          className="grid grid-cols-12 py-2 px-4 hover:bg-accent/50 cursor-pointer bg-yellow-50/30"
          onClick={() =>
            isFolder(node) ? handleFolderClick(node) : handleFileClick(node)
          }
        >
          <div className="col-span-12 md:col-span-6 flex items-center">
            {isFolder(node) ? (
              <Folder className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            ) : (
              getNonUploadedFileIcon(node.fileName)
            )}
            <span className="ml-2 truncate">
              {isFolder(node)
                ? getFolderDisplayName(node.fileName)
                : node.fileName}
            </span>
            <span className="ml-2 text-xs text-muted-foreground md:hidden">
              {isFolder(node)
                ? "-"
                : node.fileContent
                ? formatFileSize(node.fileContent.size || 0)
                : "N/A"}
            </span>
          </div>
          <div className="hidden md:block md:col-span-2 text-sm text-muted-foreground">
            {isFolder(node)
              ? "-"
              : node.fileContent
              ? formatFileSize(node.fileContent.size || 0)
              : "N/A"}
          </div>
          <div className="hidden md:block md:col-span-4 text-sm text-muted-foreground">
            <span className="text-yellow-600">Not uploaded</span>
          </div>
        </div>
      ))}
    </Fragment>
  );
};

export default DynamicContextNodes;
