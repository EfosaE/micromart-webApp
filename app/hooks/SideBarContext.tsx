import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface SidebarContextType {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

// Create the context with a default value of `undefined`
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// SidebarProvider Props
interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{ isSidebarOpen, openSidebar, closeSidebar, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook to use the SidebarContext
export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
