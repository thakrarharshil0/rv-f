import { ArrowRight, X, Heart, User, LogOut, Grip, Search, ShoppingBag as ShoppingBagIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import ShoppingBag from "./ShoppingBag";
import jeansBlackSkinny from "@/assets/jeans-black-skinny.jpg";
import jeansBlueDark from "@/assets/jeans-blue-dark.jpg";
import jeansBlueRipped from "@/assets/jeans-blue-ripped.jpg";
import shortsBeigeCargo from "@/assets/shorts-beige-cargo.jpg";
const Navigation = () => {
  const { cartItems, updateQuantity, totalItems } = useCart();
  const { favorites, removeFromFavorites } = useFavorites();
  const { user, logout } = useAuth();
  console.log("Current user:", user);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [offCanvasType, setOffCanvasType] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShoppingBagOpen, setIsShoppingBagOpen] = useState(false);
  const navRef = useRef(null);
  useEffect(() => {
    const imagesToPreload = [
      "/src/assets/jeans-black-skinny.jpg",
      "/src/assets/jeans-blue-dark.jpg",
      "/src/assets/shorts-black-athletic.jpg",
      "/src/assets/shorts-beige-cargo.jpg",
      "/founders.png"
    ];
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);
  const popularSearches = [
    "Slim Fit Jeans",
    "Cargo Shorts",
    "Denim Jackets",
    "Black Jeans",
    "Summer Collection",
    "Relaxed Fit"
  ];
  const navItems = [
    {
      name: "Shop",
      href: "/category/shop",
      submenuItems: [
        "Jeans",
        "Trousers",
        "Cargos",
        "Formal Trouser",
        "Shorts",
        "Joggers"
      ],
      images: [
        { src: jeansBlackSkinny, alt: "Jeans Collection", label: "Jeans" },
        { src: shortsBeigeCargo, alt: "Shorts Collection", label: "Shorts" }
      ]
    },
    {
      name: "New in",
      href: "/category/new-in",
      submenuItems: [
        "This Week's Arrivals",
        "Best Sellers",
        "Limited Edition"
      ],
      images: [
        { src: jeansBlueDark, alt: "New Arrivals", label: "New Arrivals" },
        { src: jeansBlueRipped, alt: "Trending Now", label: "Trending Now" }
      ]
    },
    {
      name: "About",
      href: "/about/our-story",
      submenuItems: [
        "Our Story",
        "Sustainability",
        "Size Guide",
        "Customer Care",
        "Store Locator"
      ],
      images: [
        { src: "/founders.png", alt: "Company Founders", label: "Read our story" }
      ]
    }
  ];
  return <nav
    ref={navRef}
    className="relative border-b border-border"
    style={{
      backgroundColor: "#ffffff"
    }}
  >
      <div className="flex items-center justify-between h-16 px-6">
        {
    /* Mobile hamburger button */
  }
        <button
    className="lg:hidden p-2 mt-0.5 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    aria-label="Toggle menu"
  >
          <div className="w-5 h-5 relative">
            <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 top-2.5" : "top-1.5"}`} />
            <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 top-2.5 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 top-2.5" : "top-3.5"}`} />
          </div>
        </button>

        {
    /* Left navigation - Hidden on tablets and mobile */
  }
        <div className="hidden lg:flex space-x-8">
          {navItems.map((item) => <div key={item.name} className="relative">
              <button
    type="button"
    aria-expanded={activeDropdown === item.name}
    aria-haspopup="menu"
    onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
    className={`transition-colors duration-200 text-sm font-light py-6 block ${activeDropdown === item.name ? "text-nav-hover" : "text-nav-foreground hover:text-nav-hover"}`}
  >
                {item.name}
              </button>
            </div>)}
        </div>

        {
    /* Center logo */
  }
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link to="/" className="block">
            <span className="font-display text-2xl tracking-wider">FITFLOOR</span>
          </Link>
        </div>

        {
    /* Right icons */
  }
        <div className="flex items-center space-x-2">
          {
    /* Desktop View: Regular Icons */
  }
          <div className="hidden md:flex items-center space-x-2">
            {
    /* User / Login / Logout */
  }
            {user ? <div className="flex items-center gap-1 sm:gap-2 border border-border rounded-full px-2 py-1 bg-secondary/50">
                <Link to="/" className="flex items-center gap-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
                </Link>
                <div className="w-px h-4 bg-border mx-1" />
                <button
    onClick={logout}
    className="text-nav-foreground hover:text-red-500 transition-colors duration-200"
    aria-label="Log out"
    title="Log out"
  >
                  <LogOut className="w-4 h-4" />
                </button>
              </div> : <Link
    to="/login"
    className="flex items-center gap-2 p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
    aria-label="Login"
  >
                <User className="w-5 h-5" />
              </Link>}
            <button
    className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
    aria-label="Search"
    onClick={() => setIsSearchOpen(!isSearchOpen)}
  >
              <Search className="w-5 h-5" />
            </button>
            <button
    className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
    aria-label="Favorites"
    onClick={() => setOffCanvasType("favorites")}
  >
              <Heart className="w-5 h-5" />
            </button>
            <button
    className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200 relative"
    aria-label="Shopping bag"
    onClick={() => setIsShoppingBagOpen(true)}
  >
              <ShoppingBagIcon className="w-5 h-5" />
              {totalItems > 0 && <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[30%] text-[0.5rem] font-semibold text-black pointer-events-none">
                  {totalItems}
                </span>}
            </button>
          </div>

          {
    /* Mobile View: Dropdown Menu */
  }
          <div className="md:hidden">
            <DropdownMenu onOpenChange={(open) => setActiveDropdown(open ? "mobile" : null)}>
              <DropdownMenuTrigger asChild>
                <motion.button
    className="flex items-center justify-center h-10 w-10 rounded-full bg-white border border-border shadow-sm active:scale-95 transition-all text-nav-foreground"
    whileTap={{ scale: 0.9 }}
    whileHover={{ scale: 1.05, backgroundColor: "#f5f5f5" }}
  >
                  <motion.div
    animate={{ rotate: activeDropdown === "mobile" ? 90 : 0 }}
    transition={{ duration: 0.2 }}
  >
                    <Grip className="h-5 w-5" />
                  </motion.div>
                  {totalItems > 0 && <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border border-white" />}
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-zinc-950 border-border p-2 shadow-xl rounded-2xl mt-2 backdrop-blur-none">
                <DropdownMenuItem onClick={() => setIsSearchOpen(true)} className="cursor-pointer group p-3 rounded-xl hover:bg-secondary focus:bg-secondary transition-colors">
                  <div className="bg-secondary p-2 rounded-lg group-hover:bg-secondary transition-colors mr-3 text-nav-foreground">
                    <Search className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Search</span>
                  <ArrowRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                </DropdownMenuItem>

                {user ? <>
                    <DropdownMenuItem asChild className="cursor-pointer group p-3 rounded-xl hover:bg-secondary focus:bg-secondary transition-colors">
                      <Link to="/profile" className="w-full flex items-center">
                        <div className="bg-secondary p-2 rounded-lg group-hover:bg-secondary transition-colors mr-3 text-nav-foreground">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Profile ({user.name.split(" ")[0]})</span>
                        <ArrowRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="cursor-pointer group p-3 rounded-xl hover:bg-red-50 focus:bg-red-50 transition-colors text-red-500 focus:text-red-500">
                      <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-50 transition-colors mr-3">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Log out</span>
                    </DropdownMenuItem>
                  </> : <DropdownMenuItem asChild className="cursor-pointer group p-3 rounded-xl hover:bg-secondary focus:bg-secondary transition-colors">
                    <Link to="/login" className="w-full flex items-center">
                      <div className="bg-secondary p-2 rounded-lg group-hover:bg-secondary transition-colors mr-3 text-nav-foreground">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Login</span>
                      <ArrowRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </Link>
                  </DropdownMenuItem>}

                <DropdownMenuItem onClick={() => setOffCanvasType("favorites")} className="cursor-pointer group p-3 rounded-xl hover:bg-secondary focus:bg-secondary transition-colors">
                  <div className="bg-secondary p-2 rounded-lg group-hover:bg-secondary transition-colors mr-3 text-nav-foreground">
                    <Heart className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Favorites</span>
                  <ArrowRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setIsShoppingBagOpen(true)} className="cursor-pointer group p-3 rounded-xl hover:bg-secondary focus:bg-secondary transition-colors">
                  <div className="bg-secondary p-2 rounded-lg group-hover:bg-secondary transition-colors mr-3 text-nav-foreground">
                    <ShoppingBagIcon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Cart ({totalItems})</span>
                  <div className="ml-auto">
                    {totalItems > 0 && <Badge variant="secondary" className="bg-black text-white">{totalItems}</Badge>}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {
    /* Full width dropdown */
  }
      <AnimatePresence>
        {activeDropdown && <motion.div
    initial={{ y: -10 }}
    animate={{ y: 0 }}
    exit={{ y: -10 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-950 border-b border-border z-50 backdrop-blur-none"
  >
            <div className="px-6 py-8">
              <div className="flex justify-between w-full">
                {
    /* Left side - Menu items */
  }
                <div className="flex-1">
                  <ul className="space-y-2">
                    {navItems.find((item) => item.name === activeDropdown)?.submenuItems.map((subItem, index) => <motion.li
    key={index}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 + 0.1 }}
  >
                          <Link
    to={activeDropdown === "About" ? `/about/${subItem.toLowerCase().replace(/\s+/g, "-")}` : `/category/${subItem.toLowerCase()}`}
    className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light block py-2"
    onClick={() => setActiveDropdown(null)}
  >
                            {subItem}
                          </Link>
                        </motion.li>)}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>

      {
    /* Search overlay */
  }
      <AnimatePresence>
        {isSearchOpen && <motion.div
    initial={{ y: -20 }}
    animate={{ y: 0 }}
    exit={{ y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-950 border-b border-border z-50 backdrop-blur-none"
  >
              <div className="px-6 py-8">
                <div className="max-w-2xl mx-auto">
                  {
    /* Search input */
  }
                  <div className="relative mb-8">
                    <div className="flex items-center border-b border-border pb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-nav-foreground mr-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                      <input
    type="text"
    width="100%"
    placeholder="Search for clothes..."
    className="flex-1 bg-white dark:bg-zinc-950 text-nav-foreground placeholder:text-nav-foreground/60 outline-none text-lg"
    autoFocus
  />
                    </div>
                  </div>

                  {
    /* Popular searches */
  }
                  <div>
                    <h3 className="text-nav-foreground text-sm font-light mb-4">Popular Searches</h3>
                    <div className="flex flex-wrap gap-3">
                      {popularSearches.map((search, index) => <button
    key={index}
    className="text-nav-foreground hover:text-nav-hover text-sm font-light py-2 px-4 border border-border rounded-full transition-colors duration-200 hover:border-nav-hover"
  >
                          {search}
                        </button>)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>}
      </AnimatePresence>

      {
    /* Mobile navigation menu */
  }
      <AnimatePresence>
        {isMobileMenuOpen && <motion.div
    initial={{ x: "-100%" }}
    animate={{ x: 0 }}
    exit={{ x: "-100%" }}
    transition={{ type: "tween", duration: 0.3 }}
    className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border z-50 h-[calc(100vh-64px)] overflow-y-auto"
  >
              <div className="px-6 py-8">
                <div className="space-y-6">
                  {navItems.map((item, index) => <motion.div
    key={item.name}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 + 0.2 }}
  >
                      <Link
    to={item.href}
    className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-lg font-light block py-2"
    onClick={() => setIsMobileMenuOpen(false)}
  >
                        {item.name}
                      </Link>
                      <div className="mt-3 pl-4 space-y-2">
                        {item.submenuItems.map((subItem, subIndex) => <Link
    key={subIndex}
    to={item.name === "About" ? `/about/${subItem.toLowerCase().replace(/\s+/g, "-")}` : `/category/${subItem.toLowerCase()}`}
    className="text-nav-foreground/70 hover:text-nav-hover text-sm font-light block py-1"
    onClick={() => setIsMobileMenuOpen(false)}
  >
                            {subItem}
                          </Link>)}
                      </div>
                    </motion.div>)}
                </div>
              </div>
            </motion.div>}
      </AnimatePresence>

      {
    /* Shopping Bag Component */
  }
      <ShoppingBag
    isOpen={isShoppingBagOpen}
    onClose={() => setIsShoppingBagOpen(false)}
    cartItems={cartItems}
    updateQuantity={updateQuantity}
    onViewFavorites={() => {
      setIsShoppingBagOpen(false);
      setOffCanvasType("favorites");
    }}
  />

      {
    /* Favorites Off-canvas overlay */
  }
      {offCanvasType === "favorites" && <div className="fixed inset-0 z-50 h-screen">
            {
    /* Backdrop */
  }
            <div
    className="absolute inset-0 bg-black/50 h-screen"
    onClick={() => setOffCanvasType(null)}
  />

            {
    /* Off-canvas panel */
  }
            <div className="absolute right-0 top-0 h-screen w-96 bg-background border-l border-border animate-slide-in-right flex flex-col">
              {
    /* Header */
  }
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-lg font-light text-foreground">Your Favorites</h2>
                <button
    onClick={() => setOffCanvasType(null)}
    className="p-2 text-foreground hover:text-muted-foreground transition-colors"
    aria-label="Close"
  >
                  <X size={20} />
                </button>
              </div>

              {
    /* Content */
  }
              <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto">
                {favorites.length === 0 ? <p className="text-muted-foreground text-sm mb-6">
                    You haven't added any favorites yet. Browse our collection and click the heart icon to save items you love.
                  </p> : <div className="space-y-6">
                    {favorites.map((item) => <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-20 bg-muted/10 rounded-md overflow-hidden flex-shrink-0">
                          <img
    src={item.image}
    alt={item.name}
    className="w-full h-full object-cover"
  />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                            </div>
                            <button
    onClick={() => removeFromFavorites(item.id)}
    className="text-muted-foreground hover:text-foreground transition-colors"
    aria-label="Remove"
  >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="text-sm font-light">{item.price}</p>
                            <Link
    to={`/product/${item.id}`}
    className="text-xs underline hover:no-underline"
    onClick={() => setOffCanvasType(null)}
  >
                              View Product
                            </Link>
                          </div>
                        </div>
                      </div>)}
                  </div>}
              </div>
            </div>
          </div>}
    </nav>;
};
var stdin_default = Navigation;
export {
  stdin_default as default
};
