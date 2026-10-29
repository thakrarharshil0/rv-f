import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Moon, 
  Sun,
  ChevronDown,
  Menu
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLayout } from '../../context/LayoutContext';

const Navbar = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { toggleSidebar } = useLayout();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full h-20 border-b border-surface-200 dark:border-surface-800 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        {/* Logo for mobile/small screens */}
        <div className="flex lg:hidden items-center justify-center w-10 h-10">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-contain dark:brightness-0 dark:invert" />
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Search Input */}
        <div className={`relative flex items-center w-full max-w-sm sm:max-w-lg transition-all duration-300 ${isSearchFocused ? 'scale-[1.01]' : ''}`}>
          <Search className={`absolute left-3 w-4 h-4 transition-colors ${isSearchFocused ? 'text-admin-primary-500' : 'text-surface-400'}`} />
          <input 
            type="text" 
            placeholder="Search..." 
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-10 pr-4 py-2.5 border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20 focus:border-admin-primary-500 transition-all text-sm dark:text-white"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 sm:p-2.5 border border-surface-200 dark:border-surface-700 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors group"
          title="Toggle Theme"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-5 h-5 text-surface-600 transition-transform group-hover:-rotate-12" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative group hidden sm:block">
          <button className="p-2.5 border border-surface-200 dark:border-surface-700 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <Bell className="w-5 h-5 text-surface-600 dark:text-surface-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-900 group-hover:animate-ping" />
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-surface-200 dark:border-surface-800 cursor-pointer group">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-xs font-semibold text-surface-900 dark:text-white">{user?.name || 'Admin'}</span>
            <span className="text-[10px] text-surface-500 font-medium capitalize">{user?.role || 'Administrator'}</span>
          </div>
          <div className="relative">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-admin-primary-600 to-indigo-600 p-[1.5px] group-hover:scale-105 transition-transform shadow-lg shadow-admin-primary-500/20">
              <div className="w-full h-full bg-white dark:bg-surface-900 rounded-xl overflow-hidden">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-surface-900 rounded-full" />
          </div>
          <ChevronDown size={14} className="text-surface-400 group-hover:translate-y-0.5 transition-transform hidden sm:block" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
