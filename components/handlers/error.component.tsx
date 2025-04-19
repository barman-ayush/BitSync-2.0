import { XCircle } from "lucide-react";
import { Fragment } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Error = ({ error }: { error: string }) => {
  const router = useRouter();

  return (
    <Fragment>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-md">
          <XCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-xl font-medium">Repository Not Found</h3>
          <p className="text-muted-foreground mt-2 mb-6">{error}</p>
          <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
        </div>
      </div>
    </Fragment>
  );
};
export default Error;
