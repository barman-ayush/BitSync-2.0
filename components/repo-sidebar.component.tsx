import { RepositoryDetails } from "@/lib/type";
import { Avatar } from "@radix-ui/react-avatar";
import {  AlertTriangle, Eye, Folder, GitBranch, Shield, Users } from "lucide-react";
import { Fragment } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
const RepoSideBar = ({repoDetails , sidebarOpen , commits , activeTab ,setActiveTab} : {repoDetails : RepositoryDetails  ,sidebarOpen : boolean , activeTab : string ; commits : any[] ; setActiveTab : any}) => {
  return (
    <Fragment>
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transform transition-transform duration-200 ease-in-out
        fixed md:relative z-40 md:z-auto w-64 border-r border-border bg-card h-full p-4 flex flex-col shadow-lg md:shadow-none`}
      >
        <div className="flex items-center space-x-2 mb-6">
          <GitBranch className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold truncate">
            {repoDetails.repo.name}
          </h2>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Avatar className="h-8 w-8">
            <img
              src={
                repoDetails.owner.avatarUrl || "https://github.com/shadcn.png"
              }
              alt={repoDetails.owner.username}
            />
          </Avatar>
          <div className="text-sm">
            <div className="font-medium">{repoDetails.owner.username}</div>
            <div className="text-muted-foreground text-xs">Owner</div>
          </div>
        </div>

        <div className="mb-4">
          {repoDetails.repo.isPublic ? (
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-green-500/10 text-green-500 border-green-500/20"
            >
              <Eye className="h-3 w-3" /> Public
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-amber-500/10 text-amber-500 border-amber-500/20"
            >
              <Shield className="h-3 w-3" /> Private
            </Badge>
          )}
        </div>

        <div className="text-sm text-muted-foreground mb-6">
          {repoDetails.repo.description || "No description provided"}
        </div>

        <div className="space-y-1 mb-6">
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "files" ? "bg-accent" : ""
            }`}
            onClick={() => setActiveTab("files")}
          >
            <Folder className="mr-2 h-4 w-4" />
            Files
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "access" ? "bg-accent" : ""
            }`}
            onClick={() => setActiveTab("access")}
          >
            <Users className="mr-2 h-4 w-4" />
            Access Settings
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "conflicts" ? "bg-accent" : ""
            }`}
            onClick={() => setActiveTab("conflicts")}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Conflicts
          </Button>
        </div>

        <div className="mt-auto">
          <div className="text-xs text-muted-foreground mb-2">
            Repository Stats
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Commits:</span>
              <span>{commits.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Created:</span>
              <span>
                {new Date(repoDetails.repo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default RepoSideBar;
