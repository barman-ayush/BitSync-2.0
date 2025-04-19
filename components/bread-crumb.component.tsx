import React, { Dispatch, Fragment, SetStateAction } from "react";
import { Button } from "./ui/button";
import { ChevronRight, FolderPlusIcon, Home, Upload } from "lucide-react";
import AddFile from "./file-addition.component";
import { BreadcrumbNode } from "@/lib/type";
import { useBreadcrumbContext } from "@/context/breadCrumbContext";

interface BreadCrumbProps {
  navigateToPathIndex: (index: number) => void;
}

const BreadCrumbs = ({ navigateToPathIndex }: BreadCrumbProps) => {
  const { currentPath, setCurrentPath } = useBreadcrumbContext();

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
                {currentPath.map((path: BreadcrumbNode, index: number) => (
                  <React.Fragment key={index}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 flex-shrink-0 whitespace-nowrap"
                      onClick={() => navigateToPathIndex(index)}
                    >
                      {path.nodeName}
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
        <AddFile />
      </div>
    </Fragment>
  );
};
export default BreadCrumbs;
