import { GitBranch } from "lucide-react";
import { Fragment } from "react";
import { Button } from "../ui/button";
const NoCommitYet = () => {
  return (
    <Fragment>
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg mx-4 my-6">
        <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No commits yet</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          This repository doesn't have any commits. Create your first commit to
          begin tracking changes to your files.
        </p>
        <Button className="flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
        </Button>
      </div>
    </Fragment>
  );
};
export default NoCommitYet;
