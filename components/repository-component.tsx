"use client";

import React, { useState, useEffect } from "react";
import {
  Folder,
  File,
  Users,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Search,
  Eye,
  Edit,
  Shield,
  Home,
  ArrowRight,
  Download,
  Share,
  Clock,
  GitBranch,
  Menu,
  X,
  Lock,
  XCircle,
  Loader2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useFlash } from "./Flash.component";
import { handleClientError } from "@/lib/utils";
import axios from "axios";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import RepoAccess from "./repo-access.component";
import MergeConflictResolver from "./merge-conflict.component";
import { FileSystemNode, NodeType, RepositoryDetails } from "@/lib/type";
import RepoSideBar from "./repo-sidebar.component";
import RepoFolders from "./repo-folders.component";
import AccessDenied from "./handlers/access-denied.component";
import RepoNotFound from "./handlers/repo-not-found.component";
import Loading from "./handlers/loading.component";
import Error from "./handlers/error.component";

export default function RepositoryViewer({
  user,
  repo,
}: {
  user: string;
  repo: string;
}) {
  const { flash } = useFlash();
  const userContext = useUserContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [repoDetails, setRepoDetails] = useState<RepositoryDetails | null>(
    null
  );

  const [activeTab, setActiveTab] = useState("files");
  const [commits, setcommits] = useState<any>([]);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // UseEffect Helpers
  const fetchRepoDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      setAccessDenied(false);

      const res = await axios.get(
        `/api/user/repository?name=${repo}&user_name=${user}&id=${userContext?.userData?.id}`
      );

      console.log("RES", res);

      if (res.data.success) {
        setRepoDetails(res.data.data);
      } else if (res.data.success == false) {
        setAccessDenied(true);
      } else {
        setError("Failed to load repository details");
      }
    } catch (error: any) {
      console.error("Error fetching repository:", error);
      if (error.response?.status === 403) {
        setAccessDenied(true);
      } else if (error.response?.status === 404) {
        setError("Repository not found");
      } else {
        setError("Failed to load repository");
        handleClientError(error, "REPOSITORY_COMPONENT", flash);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("User Change observerd");
    if (userContext.userData) {
      console.log("User");
      fetchRepoDetails();
    }
  }, [userContext.userData]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();
    // fetchRepoDetails();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Loading state
  if (loading) return <Loading />;

  // Error state
  if (error) return <Error error={error} />;

  // Access denied state
  if (accessDenied) return <AccessDenied />;

  if (!repoDetails) return <RepoNotFound />;

  return (
    <div className="w-full h-screen bg-background flex relative">
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 p-1 bg-background border border-border rounded-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <RepoSideBar
        sidebarOpen={sidebarOpen}
        repoDetails={repoDetails}
        commits={commits}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Backdrop for mobile sidebar (only visible when sidebar is open on mobile) */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="border-b border-border p-4 bg-background md:pl-4 pl-16">
          <h1 className="text-2xl font-bold mb-1">{repoDetails.repo.name}</h1>
          <p className="text-muted-foreground">
            {repoDetails.repo.description}
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <TabsContent
            value="files"
            className="flex-1 p-0 m-0 overflow-hidden flex flex-col"
          >
            <RepoFolders commits={commits} repoDetails={repoDetails} />
          </TabsContent>

          <TabsContent value="access" className="flex-1 p-4 overflow-auto">
            <RepoAccess repoDetails={repoDetails} />
          </TabsContent>

          <TabsContent value="conflicts" className="flex-1 p-4 overflow-auto">
            <MergeConflictResolver />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
