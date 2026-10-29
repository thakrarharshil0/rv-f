import { useState, useEffect } from "react";
import ProfileLayout from "./ProfileLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Package, Heart, MapPin, Bell, Loader2 } from "lucide-react";
import api from "@/lib/api";

const ProfileIndex = () => {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const [stats, setStats] = useState([
    { label: "Total Orders", value: "0", icon: Package, color: "text-blue-500" },
    { label: "Wishlist Items", value: favorites.length.toString(), icon: Heart, color: "text-pink-500" },
    { label: "Saved Addresses", value: "0", icon: MapPin, color: "text-emerald-500" },
    { label: "Notifications", value: "0", icon: Bell, color: "text-amber-500" },
  ]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.orders.list({ perPage: 3 });
        const orders = response.items || [];
        setRecentOrders(orders);
        
        setStats([
          { label: "Total Orders", value: (response.total || orders.length).toString(), icon: Package, color: "text-blue-500" },
          { label: "Wishlist Items", value: favorites.length.toString(), icon: Heart, color: "text-pink-500" },
          { label: "Saved Addresses", value: "0", icon: MapPin, color: "text-emerald-500" },
          { label: "Notifications", value: "0", icon: Bell, color: "text-amber-500" },
        ]);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [favorites.length]);

  return (
    <ProfileLayout>
      <div className="space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display mb-2">Account Overview</h1>
          <p className="text-muted-foreground font-light">Manage your profile, orders and preferences.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-secondary/30 border border-border/50 flex flex-col items-center text-center">
              <stat.icon className={`w-6 h-6 mb-3 ${stat.color}`} />
              <span className="text-2xl font-display">{stat.value}</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-display">Recent Orders</h2>
            <button className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4" onClick={() => window.location.href = '/profile/orders'}>View All</button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-denim" />
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-4 rounded-xl border border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-denim" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Order #{order.order_number || order.id}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">₹{parseFloat(order.total_amount || order.total).toLocaleString("en-IN")}</p>
                    <p className="text-[10px] uppercase tracking-widest text-denim">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border rounded-2xl p-12 text-center">
              <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-light italic">You haven't placed any orders yet.</p>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-border/30">
          <div>
            <h2 className="text-xl font-display mb-6">Personal Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Full Name</label>
                <p className="font-light">{user?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Email Address</label>
                <p className="font-light">{user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-display mb-6">Security</h2>
            <p className="text-sm text-muted-foreground font-light leading-relaxed mb-4">
              Your account is secured with password protection. We recommend updating your password periodically for enhanced security.
            </p>
            <button className="text-xs uppercase tracking-widest font-bold text-denim hover:underline">Change Password</button>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default ProfileIndex;
