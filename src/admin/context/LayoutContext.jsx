import React, { createContext, useContext, useState, useEffect } from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on mobile when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <LayoutContext.Provider value={{ 
      isCollapsed, 
      setIsCollapsed, 
      toggleCollapse,
      isSidebarOpen, 
      setIsSidebarOpen,
      toggleSidebar,
      closeSidebar
    }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used within a LayoutProvider');
  return context;
};
