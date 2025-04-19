import { Loader2 } from "lucide-react";
import { Fragment } from "react";
const Loading = () => {
  return (
    <Fragment>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <h3 className="text-xl font-medium">Loading repository...</h3>
        </div>
      </div>
    </Fragment>
  );
};
export default Loading;
