import { AlertTriangleIcon } from "lucide-react";
import { Fragment } from "react";
const MergeConflictResolver = () => {
  return (
    <Fragment>
      <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertTriangleIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium">Conflicts Management</h3>
        <p className="text-muted-foreground max-w-md mt-2">
          This section will show merge conflicts and allow you to resolve them.
          Currently, there are no conflicts to resolve.
        </p>
      </div>
    </Fragment>
  );
};
export default MergeConflictResolver;
