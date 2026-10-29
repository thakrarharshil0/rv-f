import { useState, useEffect } from "react";
import ProfileLayout from "./ProfileLayout";
import { Package, ChevronRight, Loader2, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import api from "@/lib/api";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    confirmed: "bg-blue-50 text-blue-600 border-blue-100",
    shipped: "bg-indigo-50 text-indigo-600 border-indigo-100",
    delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
  };

  const icons = {
    pending: <Clock className="w-3 h-3 mr-1" />,
    confirmed: <CheckCircle2 className="w-3 h-3 mr-1" />,
    shipped: <Truck className="w-3 h-3 mr-1" />,
    delivered: <CheckCircle2 className="w-3 h-3 mr-1" />,
    cancelled: <XCircle className="w-3 h-3 mr-1" />,
  };

  const style = styles[status?.toLowerCase()] || styles.pending;
  const icon = icons[status?.toLowerCase()] || icons.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {icon}
      {status || 'Pending'}
    </span>
  );
};

const ProfileOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.orders.list();
        setOrders(response.items || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <ProfileLayout>
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-display mb-2">My Orders</h1>
          <p className="text-muted-foreground font-light">Track and manage your recent purchases.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-denim" />
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-border/50 rounded-2xl overflow-hidden bg-white hover:border-border transition-colors">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary/50 rounded-xl flex items-center justify-center text-denim">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Order #{order.order_number || order.id}</p>
                        <p className="text-xs text-muted-foreground">Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                      <div className="text-right">
                        <p className="text-sm font-semibold">₹{parseFloat(order.total_amount || order.total).toLocaleString("en-IN")}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{order.payment_status}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-t border-border/30">
                    <div className="space-y-4">
                      <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Items</h4>
                      <div className="flex -space-x-3 overflow-hidden">
                        {(order.items || []).slice(0, 4).map((item, i) => (
                          <div key={i} className="relative inline-block w-12 h-12 rounded-lg border-2 border-white bg-muted overflow-hidden">
                            <img src={item.product?.image || '/placeholder.png'} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {(order.items || []).length > 4 && (
                          <div className="relative inline-block w-12 h-12 rounded-lg border-2 border-white bg-secondary flex items-center justify-center text-[10px] font-bold">
                            +{(order.items || []).length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-end justify-end">
                      <Button variant="outline" className="rounded-full text-xs font-medium h-10 px-6 group" asChild>
                        <Link to={`/profile/orders/${order.id}`}>
                          View Details
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-display mb-2">No orders yet</h3>
            <p className="text-muted-foreground font-light mb-8 max-w-xs">
              When you place an order, it will appear here for you to track and manage.
            </p>
            <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs px-8 h-12" asChild>
              <Link to="/">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
};

export default ProfileOrders;
