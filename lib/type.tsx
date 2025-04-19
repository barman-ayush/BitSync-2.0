import { Dispatch, SetStateAction } from "react";

export type UserProps = {
  id: string;
  username: string;
  email: string;
  password: string;
  avatarUrl: string;
  bio: string | string;
  createdAt: any;
  updatedAt: any;
};

export interface RepositoryFormData {
  name: string;
  description: string;
  isPublic: boolean;
}

export enum NodeType {
  FILE = "FILE",
  FOLDER = "FOLDER",
}

export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  email : string;
}

export interface RepoData {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FileSystemNode {
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


// UPLOADEDSTREAM CONTEXT TYPES
export interface ContextFileNodes{
  parentFolderId? : string | null; //  For file/folder saved insisde a folder already in db 
  localParentFolderName? : string | null; // For a folder/file inside a not submitted folder
  levelOrder : number;
  fileName : string;
  fileContent? : any; //  Distinction between file and folder
}

export interface UploadedStreamContextProps{
  uploadedStream : ContextFileNodes[] | [];
  setUploadedStream : Dispatch<SetStateAction<ContextFileNodes[] | []>>
  addFile : (file : ContextFileNodes) => void;
  removeFile : (file : ContextFileNodes) => void
  isValidFolder : (file : ContextFileNodes) => void;
}


// Breadcrumb
export interface BreadcrumbNode{
  nodeName : string;
  isContextFolder? : boolean;
  level : number;
}