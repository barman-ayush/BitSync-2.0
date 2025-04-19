import { BreadcrumbNode, ContextFileNodes, NodeType } from "@/lib/type";
import { Fragment } from "react";
import { Button } from "./ui/button";
import { Folder, GitBranch } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import {
  formatFileSize,
  getFileIcon,
  getNonUploadedFileIcon,
} from "@/lib/helpers";
import NoCommitYet from "./handlers/no-commit.component";
import { useBreadcrumbContext } from "@/context/breadCrumbContext";
import DynamicContextNodes from "./context-dynamic-folders.component";

interface DynamicFolderStructureProps {
  commits: any;
  navigateUp: () => any;
  getCurrentRepoFolder: () => any;
  navigateToFolder: (nodeId: any, nodeName: any) => any;
}

const DynamicFolderStructure = ({
  commits,
  navigateUp,
  getCurrentRepoFolder,
  navigateToFolder,
}: DynamicFolderStructureProps) => {
  const { currentPath } = useBreadcrumbContext();

  return (
    <Fragment>
      <ScrollArea className="flex-1 p-0">
        <div className="min-w-full divide-y divide-border">
          <div className="grid grid-cols-12 py-2 px-4 text-xs font-medium text-muted-foreground bg-muted/30">
            <div className="col-span-12 md:col-span-6">Name</div>
            <div className="hidden md:block md:col-span-2">Size</div>
            <div className="hidden md:block md:col-span-4">Last Modified</div>
          </div>
          {commits.length == 0 && <NoCommitYet />}

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

          {/* {getCurrentRepoFolder().length === 0 &&
            getNonUploadedFilesForCurrentPath().length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                {currentPath.length === 0
                  ? "This repository is empty"
                  : "This folder is empty"}
              </div>
            )} */}

          {/* Repository Files (Uploaded/Committed) */}
          {!currentPath[Math.max(0, currentPath.length - 1)]?.isContextFolder &&
            getCurrentRepoFolder()
              .sort((a: any, b: any) => {
                // Sort folders first, then files
                if (a.type === NodeType.FOLDER && b.type !== NodeType.FOLDER)
                  return -1;
                if (a.type !== NodeType.FOLDER && b.type === NodeType.FOLDER)
                  return 1;
                return a.name.localeCompare(b.name);
              })
              .map((node: any) => (
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
          <DynamicContextNodes />
        </div>
      </ScrollArea>
    </Fragment>
  );
};
export default DynamicFolderStructure;
