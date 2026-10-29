import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut } from "lucide-react";

const StatusBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const usps = [
    "EXTRA 10% OFF ON NEW ARRIVALS NEW10",
    "FREE SHIPPING ON ALL ORDERS ABOVE ₹4999",
    "EASY 15-DAY RETURNS"
  ];
  const { user, logout } = useAuth();

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % usps.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + usps.length) % usps.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 py-2 px-4 flex items-center justify-between text-[11px] font-bold tracking-wider">
      <div className="flex-1 flex items-center justify-center">
        <button onClick={prevSlide} className="p-1">
          <ChevronLeft className="w-3 h-3" />
        </button>
        <div className="mx-4 overflow-hidden h-4 flex items-center justify-center min-w-[250px]">
          <p key={currentIndex} className="animate-in fade-in slide-in-from-right-4 duration-500">
            {usps[currentIndex]}
          </p>
        </div>
        <button onClick={nextSlide} className="p-1">
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center gap-4 group relative">
            <Link to="/profile" className="flex items-center gap-2 hover:text-[#C41230] transition-colors">
              <User className="w-3.5 h-3.5" />
              <span className="uppercase">{user.name?.split(' ')[0] || 'Account'}</span>
            </Link>
            <button 
              onClick={logout}
              className="text-gray-400 hover:text-black transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="hover:underline uppercase">Sign In</Link>
        )}
        <div className="flex items-center space-x-1 cursor-pointer">
          <img src="https://flagcdn.com/in.svg" alt="India" className="w-4 h-3 object-cover border border-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;

