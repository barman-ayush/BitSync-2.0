"use client"
import { ContextFileNodes, UploadedStreamContextProps } from "@/lib/type";
import { ReactNode, createContext, useContext, useState } from "react";

const UploadedStreamContext = createContext<UploadedStreamContextProps>({
  uploadedStream: [],
  setUploadedStream: () => {},
  addFile: () => {},
  removeFile: () => {},
});

const defaultValue: ContextFileNodes[] = [
  {
    parentFolderId: null,
    fileName: "root1",
  },
  {
    parentFolderId: null,
    fileName: "root2",
  },
  {
    parentFolderId: null,
    fileName: "root3",
  },
];

export function UploadedStreamWrapper({ children }: { children: ReactNode }) {
  const [uploadedStream, setUploadedStream] = useState<ContextFileNodes[] | []>(
    defaultValue
  );

  const addFile = (file: ContextFileNodes) => {
    setUploadedStream((prev) => [...prev, file]);
  };

  const removeFile = (file: ContextFileNodes) => {
    setUploadedStream((prev) =>
      prev.filter((f) => f.fileName !== file.fileName)
    );
  };

  return (
    <UploadedStreamContext.Provider
      value={{ uploadedStream, setUploadedStream, addFile, removeFile }}
    >
      {children}
    </UploadedStreamContext.Provider>
  );
}

export function useUploadedStreamContext() {
  return useContext(UploadedStreamContext);
}
