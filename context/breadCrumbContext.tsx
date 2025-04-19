"use client";

import { BreadcrumbNode } from "@/lib/type";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface contextProps {
  currentPath: BreadcrumbNode[];
  setCurrentPath: Dispatch<SetStateAction<BreadcrumbNode[]>>;
  navigateNextFolder: (file: BreadcrumbNode) => void;
  getCurrentFolder: () => BreadcrumbNode | null;
}

const BreadcrumbContext = createContext<contextProps>({
  currentPath: [],
  setCurrentPath: () => {},
  navigateNextFolder: () => {},
  getCurrentFolder: () => {
    return null;
  },
});

export function BreadcrumbWrapper({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState<BreadcrumbNode[]>([]);
  const navigateNextFolder = (file: BreadcrumbNode) => {
    setCurrentPath([...currentPath, file]);
  };

  const getCurrentFolder = () => {
    const currentNode =
      currentPath.length === 0 ? null : currentPath[currentPath.length - 1];
    return currentNode;
  };
  return (
    <BreadcrumbContext.Provider
      value={{
        currentPath,
        setCurrentPath,
        navigateNextFolder,
        getCurrentFolder,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbContext() {
  return useContext(BreadcrumbContext);
}
