import React, { Dispatch, Fragment, SetStateAction } from "react";
import { Button } from "./ui/button";
import { ChevronRight, FolderPlusIcon, Home, Upload } from "lucide-react";
import AddFile from "./file-addition.component";

interface BreadCrumbProps {
  setCurrentPath: Dispatch<SetStateAction<string[]>>;
  currentPath: string[];
  navigateToPathIndex: (index: number) => void;
}

const BreadCrumbs = ({
  setCurrentPath,
  currentPath,
  navigateToPathIndex,
}: BreadCrumbProps) => {
  return (
    <Fragment>
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
                {currentPath.map((path: string, index: number) => (
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
        <AddFile/>
      </div>
    </Fragment>
  );
};
export default BreadCrumbs;
