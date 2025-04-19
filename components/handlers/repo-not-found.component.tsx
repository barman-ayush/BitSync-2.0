import { AlertTriangle } from "lucide-react";
import { Fragment } from "react";
const RepoNotFound = () => {
  return (
    <Fragment>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-medium">No repository data available</h3>
        </div>
      </div>
    </Fragment>
  );
};
export default RepoNotFound;
