import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Clock } from "lucide-react";
import { Dispatch, Fragment, SetStateAction } from "react";

interface CommitBarProps {
  selectedCommit: string | "";
  setSelectedCommit: Dispatch<SetStateAction<string | "">>;
  commits: any;
}

const CommitBar = ({
  selectedCommit,
  setSelectedCommit,
  commits,
}: CommitBarProps) => {
  return (
    <Fragment>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Select value={selectedCommit} onValueChange={setSelectedCommit}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Select version" />
          </SelectTrigger>
          <SelectContent>
            {commits.map((commit: any) => (
              <SelectItem key={commit.id} value={commit.id}>
                <div className="flex items-center">
                  <span className="truncate">{commit.message}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({commit.commitHash.substring(0, 7)})
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">
            {commits.find((c: any) => c.id === selectedCommit)?.createdAt
              ? new Date(
                  commits.find((c: any) => c.id === selectedCommit)
                    ?.createdAt || ""
                ).toLocaleString()
              : "Unknown date"}
          </span>
        </div>
      </div>
    </Fragment>
  );
};
export default CommitBar;
