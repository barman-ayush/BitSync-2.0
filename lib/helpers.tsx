import { File, FileArchive, FileCode, FileText, Folder , Image } from "lucide-react";
import { FileSystemNode, NodeType } from "./type";

export function getFileIcon  (node: FileSystemNode) {
  if (node.type === NodeType.FOLDER) {
    return <Folder className="h-5 w-5 text-blue-500" />;
  }

  // Basic file type detection
  const fileExtension = node.name.split(".").pop()?.toLowerCase();

  switch (fileExtension) {
    case "pdf":
      return <File className="h-5 w-5 text-red-500" />;
    case "doc":
    case "docx":
      return <File className="h-5 w-5 text-blue-700" />;
    case "xls":
    case "xlsx":
      return <File className="h-5 w-5 text-green-600" />;
    case "ppt":
    case "pptx":
      return <File className="h-5 w-5 text-orange-500" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <File className="h-5 w-5 text-purple-500" />;
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
      return <File className="h-5 w-5 text-yellow-500" />;
    case "html":
    case "css":
      return <File className="h-5 w-5 text-orange-400" />;
    case "md":
      return <File className="h-5 w-5 text-gray-500" />;
    default:
      return <File className="h-5 w-5 text-gray-400" />;
  }
};

export function getNonUploadedFileIcon(fileName: string){
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  // Image files
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
    return <Image className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />;
  }

  // Code files
  if (
    [
      "js",
      "jsx",
      "ts",
      "tsx",
      "html",
      "css",
      "py",
      "java",
      "php",
      "go",
      "rb",
    ].includes(extension)
  ) {
    return (
      <FileCode className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
    );
  }

  // Archive files
  if (["zip", "rar", "tar", "gz", "7z"].includes(extension)) {
    return (
      <FileArchive className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
    );
  }

  // Text files
  if (
    [
      "txt",
      "md",
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
    ].includes(extension)
  ) {
    return (
      <FileText className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
    );
  }

  // Default file icon
  return <File className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />;
};


export const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined) return "N/A";

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};