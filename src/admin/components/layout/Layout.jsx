import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useLayout } from '../../context/LayoutContext';

const Layout = () => {
  const { isCollapsed } = useLayout();

  return (
    <div className="flex h-screen w-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-300 overflow-hidden">
      {/* Sidebar - Fixed */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar - Sticky */}
        <header className="flex-shrink-0">
          <Navbar />
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full">
          <div className="p-4 sm:p-6 lg:p-10 w-full">
            <Outlet />
          </div>

          {/* Footer */}
          <footer className="w-full p-6 text-center text-xs text-surface-500 border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 flex-shrink-0">
            &copy; {new Date().getFullYear()} RoyalVirtus Admin Panel. All Rights Reserved.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;
