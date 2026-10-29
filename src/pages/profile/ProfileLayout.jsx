import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User, Package, Heart, Settings, LogOut, ChevronRight, Loader2 } from "lucide-react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const ProfileLayout = ({ children }) => {
  const { user, logout, isAuthLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/login");
    }
  }, [user, isAuthLoading, navigate]);

  const menuItems = [
    { label: "Dashboard", path: "/profile", icon: User },
    { label: "My Orders", path: "/profile/orders", icon: Package },
    { label: "Wishlist", path: "/profile/favorites", icon: Heart },
    { label: "Settings", path: "/profile/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-denim" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-32 h-fit">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-display mb-1">Hello, {(user?.name || "User").split(" ")[0]}</h2>
                <p className="text-sm text-muted-foreground font-light">{user.email}</p>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center justify-between p-3 text-sm tracking-wider uppercase transition-all duration-200 group rounded-lg",
                        isActive 
                          ? "bg-secondary text-foreground font-medium" 
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn("w-4 h-4", isActive ? "text-foreground" : "text-muted-foreground")} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={cn("w-4 h-4 opacity-0 transition-all", isActive ? "opacity-100 translate-x-0" : "group-hover:opacity-50 group-hover:translate-x-1")} />
                    </Link>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 text-sm tracking-wider uppercase text-red-500/70 hover:text-red-500 hover:bg-red-50/50 transition-all duration-200 rounded-lg mt-4"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <section className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-border/50 shadow-sm min-h-[500px]">
              {children}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfileLayout;
