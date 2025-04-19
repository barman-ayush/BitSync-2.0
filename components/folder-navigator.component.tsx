import { NodeType } from "@/lib/type";
import { Fragment } from "react";
import { Button } from "./ui/button";
import { Folder, GitBranch } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import {
  formatFileSize,
  getFileIcon,
  getNonUploadedFileIcon,
} from "@/lib/helpers";

interface DynamicFolderStructureProps {
  commits: any;
  currentPath: string[] | [];
  navigateUp: () => any;
  getCurrentRepoFolder: () => any;
  getNonUploadedFilesForCurrentPath: () => any;
  navigateToFolder: (nodeId: any, nodeName: any) => any;
}

const DynamicFolderStructure = ({
  commits,
  currentPath,
  navigateUp,
  getCurrentRepoFolder,
  navigateToFolder,
  getNonUploadedFilesForCurrentPath,
}: DynamicFolderStructureProps) => {
  return (
    <Fragment>
      <ScrollArea className="flex-1 p-0">
        <div className="min-w-full divide-y divide-border">
          <div className="grid grid-cols-12 py-2 px-4 text-xs font-medium text-muted-foreground bg-muted/30">
            <div className="col-span-12 md:col-span-6">Name</div>
            <div className="hidden md:block md:col-span-2">Size</div>
            <div className="hidden md:block md:col-span-4">Last Modified</div>
          </div>
          {commits.length == 0 && (
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
          )}

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

          {getCurrentRepoFolder().length === 0 &&
            getNonUploadedFilesForCurrentPath().length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                {currentPath.length === 0
                  ? "This repository is empty"
                  : "This folder is empty"}
              </div>
            )}

          {/* Repository Files (Uploaded/Committed) */}
          {getCurrentRepoFolder()
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

          {/* Non-uploaded Files (From Context) */}
          {getNonUploadedFilesForCurrentPath().length > 0 && (
            <div className="py-2 px-4 bg-yellow-50 text-xs font-medium text-yellow-800">
              Non-uploaded Files
            </div>
          )}

          {getNonUploadedFilesForCurrentPath().map(
            (file: any, index: number) => (
              <div
                key={`non-uploaded-${index}`}
                className="grid grid-cols-12 py-2 px-4 hover:bg-accent/50 cursor-pointer bg-yellow-50/30"
              >
                <div className="col-span-12 md:col-span-6 flex items-center">
                  {getNonUploadedFileIcon(file.fileName)}
                  <span className="ml-2 truncate">{file.fileName}</span>
                  <span className="ml-2 text-xs text-muted-foreground md:hidden">
                    {file.fileContent
                      ? formatFileSize(file.fileContent.size || 0)
                      : "N/A"}
                  </span>
                </div>
                <div className="hidden md:block md:col-span-2 text-sm text-muted-foreground">
                  {file.fileContent
                    ? formatFileSize(file.fileContent.size || 0)
                    : "N/A"}
                </div>
                <div className="hidden md:block md:col-span-4 text-sm text-muted-foreground">
                  <span className="text-yellow-600">Not uploaded</span>
                </div>
              </div>
            )
          )}
        </div>
      </ScrollArea>
    </Fragment>
  );
};
export default DynamicFolderStructure;
