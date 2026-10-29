import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Store, LogOut, X, ChevronDown } from 'lucide-react';
import { useLayout } from '../../context/LayoutContext';
import { sidebarSections } from '../../constants/navigation';
import { useAuth } from '../../../contexts/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const { isCollapsed, toggleCollapse, isSidebarOpen, closeSidebar } = useLayout();
  const location = useLocation();
  const isDropdownActive = (submenu) => {
    return submenu?.some(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)));
  };

  const [openDropdowns, setOpenDropdowns] = useState(() => {
    const initialState = {};
    sidebarSections.forEach(section => {
      section.items.forEach(item => {
        if (item.submenu && item.submenu.some(sub => location.pathname === sub.path || (sub.path !== '/admin' && location.pathname.startsWith(sub.path)))) {
          initialState[item.slug] = true;
        }
      });
    });
    return initialState;
  });

  const navigate = useNavigate();

  useEffect(() => {
    sidebarSections.forEach(section => {
      section.items.forEach(item => {
        if (item.submenu && item.submenu.some(sub => location.pathname === sub.path || (sub.path !== '/admin' && location.pathname.startsWith(sub.path)))) {
          setOpenDropdowns((prev) => ({ ...prev, [item.slug]: true }));
        }
      });
    });
  }, [location.pathname]);

  const toggleDropdown = (slug) => {
    setOpenDropdowns(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login/admin');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-[55] lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          h-screen flex flex-col border-r border-surface-200 dark:border-surface-800 
          bg-white dark:bg-surface-900 transition-all duration-300 ease-in-out
          fixed left-0 top-0 z-[60] w-64 lg:relative lg:translate-x-0 lg:left-auto lg:top-auto lg:z-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 h-24 flex-shrink-0">
          <div className={`flex items-center justify-center w-full transition-all duration-300 ${isCollapsed ? 'lg:scale-0 lg:opacity-0' : 'scale-100 opacity-100'}`}>
            <img src="/logo.png" alt="Logo" className="h-16 w-auto object-contain dark:brightness-0 dark:invert" />
          </div>

          {isCollapsed && (
            <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex w-10 h-10 items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain dark:brightness-0 dark:invert" />
            </div>
          )}

          {/* Mobile Close */}
          <button 
            onClick={closeSidebar}
            className="lg:hidden p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>

          {/* Desktop Collapse */}
          <button 
            onClick={toggleCollapse}
            className="hidden lg:flex absolute -right-4 top-24 w-8 h-8 bg-white dark:bg-surface-800 border-2 border-admin-primary-100 dark:border-admin-primary-900/30 rounded-xl items-center justify-center text-admin-primary-600 dark:text-admin-primary-400 hover:bg-admin-primary-600 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg z-50"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-5 overflow-y-auto mt-4">
          {sidebarSections.map((section) => (
            <div key={section.number} className="space-y-2">
              <div className={`px-2 transition-all duration-300 ${isCollapsed ? 'lg:opacity-0 lg:h-0 lg:overflow-hidden' : 'opacity-100'}`}>
                <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.35em]">
                  {section.title}
                </p>
              </div>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <div key={item.path}>
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => toggleDropdown(item.slug)}
                          className={`
                            flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all duration-200 group relative text-[13px]
                            ${isDropdownActive(item.submenu) || openDropdowns[item.slug]
                              ? 'bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 font-medium' 
                              : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'}
                          `}
                        >
                          <item.icon size={20} className="flex-shrink-0 transition-all duration-300" />
                          <span className={`flex-1 text-left transition-all duration-300 truncate ${isCollapsed ? 'lg:opacity-0 lg:translate-x-[-10px]' : 'opacity-100 translate-x-0'}`}>
                            {item.label}
                          </span>
                          <ChevronDown size={16} className={`flex-shrink-0 transition-all duration-300 ${openDropdowns[item.slug] ? 'rotate-180' : ''} ${isCollapsed ? 'lg:opacity-0' : 'opacity-100'}`} />

                          {isCollapsed && (
                            <div className="hidden lg:block absolute left-16 invisible group-hover:visible bg-surface-900 text-white text-xs px-2 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 z-[100]">
                              {item.label}
                            </div>
                          )}
                        </button>

                        {openDropdowns[item.slug] && !isCollapsed && (
                          <div className="mt-1 ml-2 space-y-1 border-l-2 border-admin-primary-200 dark:border-admin-primary-900/30 pl-2">
                            {item.submenu.map((subitem) => (
                              <NavLink
                                key={subitem.path}
                                to={subitem.path}
                                end
                                onClick={() => {
                                  if (window.innerWidth < 1024) closeSidebar();
                                }}
                                className={({ isActive }) => `
                                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-[12px] group relative
                                  ${isActive 
                                    ? 'bg-admin-primary-100 dark:bg-admin-primary-900/40 text-admin-primary-600 dark:text-admin-primary-400 font-medium' 
                                    : 'text-surface-500 dark:text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-800/50'}
                                `}
                              >
                                <subitem.icon size={16} className="flex-shrink-0" />
                                <span className="truncate">{subitem.label}</span>
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        to={item.path}
                        end={item.path === '/admin'}
                        onClick={() => {
                          if (window.innerWidth < 1024) closeSidebar();
                        }}
                        className={({ isActive }) => `
                          flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative text-[13px]
                          ${isActive 
                            ? 'bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 font-medium' 
                            : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'}
                        `}
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon size={20} className={`flex-shrink-0 transition-all duration-300 ${isActive ? 'text-admin-primary-600' : ''}`} />
                            <span className={`transition-all duration-300 truncate ${isCollapsed ? 'lg:opacity-0 lg:translate-x-[-10px]' : 'opacity-100 translate-x-0'}`}>
                              {item.label}
                            </span>

                            {isCollapsed && (
                              <div className="hidden lg:block absolute left-16 invisible group-hover:visible bg-surface-900 text-white text-xs px-2 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 z-[100]">
                                {item.label}
                              </div>
                            )}
                          </>
                        )}
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-800 flex-shrink-0">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-3 text-[13px] text-surface-600 dark:text-surface-400 hover:text-red-500 transition-colors group overflow-hidden">
            <LogOut size={20} className="flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
            <span className={`transition-all duration-300 ${isCollapsed ? 'lg:opacity-0 lg:translate-x-[-10px]' : 'opacity-100 translate-x-0'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
