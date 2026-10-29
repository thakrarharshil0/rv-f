import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProfileLayout from "./ProfileLayout";
import { Package, ChevronLeft, Loader2, Calendar, CreditCard, Truck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import api, { getImageUrl } from "@/lib/api";

const ProfileOrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.orders.getById(orderId);
        setOrder(response.item);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <ProfileLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-denim" />
        </div>
      </ProfileLayout>
    );
  }

  if (!order) {
    return (
      <ProfileLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-display mb-4">Order Not Found</h2>
          <p className="text-muted-foreground mb-8">We couldn't find the order you're looking for.</p>
          <Button asChild variant="outline">
            <Link to="/profile/orders">Back to Orders</Link>
          </Button>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Orders
            </button>
            <h1 className="text-3xl font-display">Order #{order.order_number || order.id}</h1>
            <p className="text-sm text-muted-foreground font-light">
              Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' }) : 'N/A'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 rounded-full text-xs font-medium border ${
              order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
              order.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 
              'bg-blue-50 text-blue-600 border-blue-100'
            }`}>
              {order.status || 'Pending'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Items */}
            <div className="bg-white rounded-2xl border border-border/50 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border/50 bg-secondary/10">
                <h3 className="text-sm font-medium">Order Items</h3>
              </div>
              <div className="divide-y divide-border/30">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="p-6 flex gap-6">
                    <div className="w-20 h-24 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={getImageUrl(item.image) || '/placeholder.png'} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-medium hover:text-denim transition-colors">
                          <Link to={`/product/${item.product_id}`}>{item.product?.name || 'Product Name'}</Link>
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                        {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                      </div>
                      <p className="text-sm font-semibold">₹{parseFloat(item.price).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline/History - Simple for now */}
            <div className="bg-white rounded-2xl border border-border/50 p-8 shadow-sm">
              <h3 className="text-sm font-medium mb-6">Order Timeline</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-denim mt-1.5" />
                    <div className="absolute top-3.5 left-0.5 w-px h-full bg-border" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Order Placed</p>
                    <p className="text-xs text-muted-foreground">{order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : 'N/A'}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-border mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Processing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Summary */}
            <div className="bg-white rounded-2xl border border-border/50 p-8 shadow-sm space-y-6">
              <h3 className="text-sm font-medium pb-4 border-b border-border/50">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{parseFloat(order.total_amount || order.total).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-display pt-4 border-t border-border/50">
                  <span>Total</span>
                  <span>₹{parseFloat(order.total_amount || order.total).toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="pt-4 flex items-center gap-3 text-xs text-muted-foreground bg-secondary/20 p-4 rounded-xl">
                <CreditCard className="w-4 h-4" />
                <span>Payment: {order.paymentMethod?.toUpperCase() === 'COD' ? 'Cash on Delivery' : (order.paymentMethod?.toUpperCase() || 'CARD')}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-border/50 p-8 shadow-sm">
              <h3 className="text-sm font-medium mb-6 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-denim" />
                Shipping Address
              </h3>
              <div className="text-sm font-light space-y-1 text-muted-foreground">
                <p className="font-medium text-foreground">
                  {order.customerDetails?.firstName} {order.customerDetails?.lastName}
                </p>
                {order.shippingAddress ? (
                  <>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </>
                ) : (
                  <p>Address not available</p>
                )}
              </div>
            </div>

            {/* Help */}
            <div className="bg-denim/5 rounded-2xl p-8 border border-denim/10">
              <h4 className="text-sm font-medium text-denim mb-2">Need help with your order?</h4>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                If you have any issues with your order, please contact our support team.
              </p>
              <Button className="w-full bg-denim hover:bg-denim/90 rounded-full h-10 text-xs" asChild>
                <Link to="/about/customer-care">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default ProfileOrderDetail;
