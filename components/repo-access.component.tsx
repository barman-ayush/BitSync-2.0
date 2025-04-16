import { Fragment, useEffect, useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { 
  Search, 
  Shield, 
  Eye, 
  Edit, 
  X, 
  CheckCircle,
  User as UserIcon,
  Loader2 
} from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import axios from "axios";
import { useFlash } from "./Flash.component";
import { handleClientError } from "@/lib/utils";
import { useUserContext } from "@/context/userContext";
import { Badge } from "./ui/badge";

type UserRole = "OWNER" | "ADMIN" | "COLLABORATOR" | "VIEWER";

interface User {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
}


type NodeType = 'FILE' | 'FOLDER';

interface RepoData {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FileSystemNode {
  id: string;
  name: string;
  type: NodeType;
  mimeType?: string;
  size?: number;
  contentUrl?: string;
  createdAt: string;
  updatedAt: string;
  children?: FileSystemNode[];
  parentId?: string | null;
}

export interface RepositoryDetails {
    repo: RepoData;
    owner: User;
    rootNodes: FileSystemNode[];
    admins: User[] | [];
    collaborators: User[] | [];
    viewers: User[] | [];
  }

const RepoAccess = ({ repoDetails }: { repoDetails: RepositoryDetails }) => {
  const { flash } = useFlash();
  const userContext = useUserContext();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("COLLABORATOR");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [debounceTimeout] = useState(500); // 500ms debounce
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Search users when search query changes
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Don't search if query is too short
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    // Set a new timeout for debounced search
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        
        const response = await axios.get(`/api/search/user`, {
          params: {
            username: searchQuery,
            excludeUserId: userContext?.userData?.id,
            limit: 5
          }
        });
        
        if (response.data.success) {
          setSearchResults(response.data.data);
          setShowResults(true);
        } else {
          setSearchResults([]);
          flash("Failed to search users", { variant: "error" });
        }
      } catch (error) {
        setSearchResults([]);
        handleClientError(error, "USER_SEARCH", flash);
      } finally {
        setIsSearching(false);
      }
    }, debounceTimeout);
    
    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, userContext?.userData?.id, flash, debounceTimeout]);

  // Handle selecting a user from search results
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearchQuery("");
    setShowResults(false);
  };

  // Handle clicking outside the search results
  useEffect(() => {
    const handleClickOutside = () => {
      setShowResults(false);
    };
    
    document.addEventListener("click", handleClickOutside);
    
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle adding a user to the repository
  const handleAddUser = async () => {
    if (!selectedUser || !userContext?.userData) return;
    
    try {
      setIsAddingUser(true);
      
      // Convert frontend role format to backend role format
      const backendRole = selectedRole.toLowerCase();
      
      // Make API request to add the user to the repository
      const response = await axios.post('/api/user/role/add', {
        repoId: repoDetails.repo.id,
        currentUserId: userContext.userData.id,
        userToAddId: selectedUser.id,
        role: backendRole
      });
      
      if (response.data.success) {
        flash(`${selectedUser.username} has been added as a ${selectedRole.toLowerCase()}`, { variant: "success" });
        
        // Reset the selected user
        setSelectedUser(null);
        
        // Refresh the page to show updated repository access
        window.location.reload();
      } else {
        flash(response.data.error || "Failed to add user", { variant: "error" });
      }
    } catch (error) {
      handleClientError(error, "ADD_USER_ROLE", flash);
    } finally {
      setIsAddingUser(false);
    }
  };

  // Handle role badge display
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "OWNER":
        return <Badge className="bg-purple-100 text-purple-700">Owner</Badge>;
      case "ADMIN":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Admin</Badge>;
      case "COLLABORATOR":
        return <Badge variant="outline" className="border-green-200 text-green-700">Collaborator</Badge>;
      case "VIEWER":
        return <Badge variant="outline" className="border-amber-200 text-amber-700">Viewer</Badge>;
      default:
        return null;
    }
  };

  // Get role icon
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "OWNER":
        return <Shield className="h-4 w-4 mr-2 text-purple-500" />;
      case "ADMIN":
        return <Shield className="h-4 w-4 mr-2 text-blue-500" />;
      case "COLLABORATOR":
        return <Edit className="h-4 w-4 mr-2 text-green-500" />;
      case "VIEWER":
        return <Eye className="h-4 w-4 mr-2 text-amber-500" />;
      default:
        return null;
    }
  };

  // Check if there are any users with assigned roles (besides owner)
  const hasAssignedUsers = repoDetails.admins.length > 0 || repoDetails.collaborators.length > 0 || repoDetails.viewers.length > 0;

  return (
    <Fragment>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">User Access Management</h3>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by username"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (searchResults.length > 0) {
                        setShowResults(true);
                      }
                    }}
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <div 
                    className="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ul className="py-1">
                      {searchResults.map((user) => (
                        <li 
                          key={user.id}
                          className="px-3 py-2 hover:bg-accent cursor-pointer flex items-center"
                          onClick={() => handleSelectUser(user)}
                        >
                          <div className="flex items-center flex-1">
                            <div className="h-8 w-8 mr-2 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                              {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover" />
                              ) : (
                                <UserIcon className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{user.username}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                          <CheckCircle className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100" />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* No Results Message */}
                {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                  <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg py-2 px-3">
                    <p className="text-sm text-muted-foreground">No users found</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as UserRole)}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrator</SelectItem>
                    <SelectItem value="COLLABORATOR">Collaborator</SelectItem>
                    <SelectItem value="VIEWER">Viewer</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  className="whitespace-nowrap"
                  disabled={!selectedUser || isAddingUser}
                  onClick={handleAddUser}
                >
                  {isAddingUser ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add User"
                  )}
                </Button>
              </div>
            </div>

            {/* Selected User Display */}
            {selectedUser && (
              <div className="mb-6 p-3 border border-border rounded-md bg-accent/30 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 mr-3 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {selectedUser.avatarUrl ? (
                      <img src={selectedUser.avatarUrl} alt={selectedUser.username} className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium flex items-center">
                      {selectedUser.username}
                      <span className="ml-2">{getRoleBadge(selectedRole)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => setSelectedUser(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="space-y-6">
              {/* Owner Section */}
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  {getRoleIcon("OWNER")}
                  Owner
                </h4>
                <div className="bg-accent/50 rounded-md p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <img
                        src={
                          repoDetails.owner.avatarUrl ||
                          "https://github.com/shadcn.png"
                        }
                        alt={repoDetails.owner.username}
                      />
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {repoDetails.owner.username}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {repoDetails.owner.bio || "No bio provided"}
                      </div>
                    </div>
                  </div>
                  {getRoleBadge("OWNER")}
                </div>
              </div>
              
              {/* Admins Section */}
              {repoDetails.admins.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    {getRoleIcon("ADMIN")}
                    Administrators
                  </h4>
                  <div className="space-y-2">
                    {repoDetails.admins.map((admin) => (
                      <div key={admin.id} className="bg-accent/30 rounded-md p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 mr-3 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                            {admin.avatarUrl ? (
                              <img src={admin.avatarUrl} alt={admin.username} className="h-full w-full object-cover" />
                            ) : (
                              <UserIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{admin.username}</div>
                            <div className="text-sm text-muted-foreground">{admin.bio || "No bio provided"}</div>
                          </div>
                        </div>
                        {getRoleBadge("ADMIN")}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Collaborators Section */}
              {repoDetails.collaborators.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    {getRoleIcon("COLLABORATOR")}
                    Collaborators
                  </h4>
                  <div className="space-y-2">
                    {repoDetails.collaborators.map((collaborator) => (
                      <div key={collaborator.id} className="bg-accent/30 rounded-md p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 mr-3 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                            {collaborator.avatarUrl ? (
                              <img src={collaborator.avatarUrl} alt={collaborator.username} className="h-full w-full object-cover" />
                            ) : (
                              <UserIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{collaborator.username}</div>
                            <div className="text-sm text-muted-foreground">{collaborator.bio || "No bio provided"}</div>
                          </div>
                        </div>
                        {getRoleBadge("COLLABORATOR")}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Viewers Section */}
              {repoDetails.viewers.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    {getRoleIcon("VIEWER")}
                    Viewers
                  </h4>
                  <div className="space-y-2">
                    {repoDetails.viewers.map((viewer) => (
                      <div key={viewer.id} className="bg-accent/30 rounded-md p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 mr-3 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                            {viewer.avatarUrl ? (
                              <img src={viewer.avatarUrl} alt={viewer.username} className="h-full w-full object-cover" />
                            ) : (
                              <UserIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{viewer.username}</div>
                            <div className="text-sm text-muted-foreground">{viewer.bio || "No bio provided"}</div>
                          </div>
                        </div>
                        {getRoleBadge("VIEWER")}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* No users message if no assigned users */}
              {!hasAssignedUsers && (
                <div className="py-4 text-center text-muted-foreground">
                  No additional users have access to this repository
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
};

export default RepoAccess;