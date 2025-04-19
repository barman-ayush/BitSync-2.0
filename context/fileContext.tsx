"use client";
import { ContextFileNodes, UploadedStreamContextProps } from "@/lib/type";
import { ReactNode, createContext, useContext, useState } from "react";

const UploadedStreamContext = createContext<UploadedStreamContextProps>({
  uploadedStream: [],
  setUploadedStream: () => {},
  addFile: () => {},
  removeFile: () => {},
  isValidFolder: () => {},
});

const defaultValue: ContextFileNodes[] = [
  {
    levelOrder: 0,
    parentFolderId: null,
    fileName: "root1",
    fileContent: "hello ayush",
  },
  {
    levelOrder: 0,
    parentFolderId: null,
    fileName: "root2",
  },
  {
    levelOrder: 1,
    parentFolderId: null,
    fileName: "root3",
  },
  {
    levelOrder: 0,
    parentFolderId: null,
    fileName: "root3",
  },
];

export function UploadedStreamWrapper({ children }: { children: ReactNode }) {
  const [uploadedStream, setUploadedStream] = useState<ContextFileNodes[] | []>(
    defaultValue
    // []
  );

  const addFile = (file: ContextFileNodes) => {
    setUploadedStream((prev) => [...prev, file]);
  };

  const removeFile = (file: ContextFileNodes) => {
    setUploadedStream((prev) =>
      prev.filter((f) => f.fileName !== file.fileName)
    );
  };

  const isValidFolder = (node: ContextFileNodes) => {
    const currentLevel = node.levelOrder;
    const isAnyConflict = uploadedStream.filter(
      (tempNode: ContextFileNodes) =>
        tempNode.levelOrder === currentLevel &&
        node.fileName === tempNode.fileName
    );
    return isAnyConflict.length == 0;
  };

  return (
    <UploadedStreamContext.Provider
      value={{
        uploadedStream,
        setUploadedStream,
        addFile,
        removeFile,
        isValidFolder,
      }}
    >
      {children}
    </UploadedStreamContext.Provider>
  );
}

export function useUploadedStreamContext() {
  return useContext(UploadedStreamContext);
}
