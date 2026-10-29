import React from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import StatusTracker from './StatusTracker';
import api from '../../../lib/api';
import { toast } from 'sonner';

const OrderDetailsDrawer = ({ order, isOpen, onClose, onUpdate }) => {
  const [copied, setCopied] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'packaging', label: 'Packaging' },
    { value: 'delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'returned', label: 'Returned' },
    { value: 'failed', label: 'Failed to Deliver' },
    { value: 'canceled', label: 'Canceled' },
  ];

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    try {
      await api.orders.update(order.id, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  React.useEffect(() => {
    if (!isOpen || !order) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const drawerUI = (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`
          fixed inset-y-0 right-0 h-screen max-h-screen w-full max-w-2xl bg-white dark:bg-surface-900 shadow-2xl z-[121]
          flex flex-col overflow-hidden animate-slide-in
        `}
      >
        {/* Header */}
        <div className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 px-5 sm:px-6 py-4 flex items-center justify-between z-20 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">Order Details</h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Order ID: {order.orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
          >
            <X size={24} className="text-surface-600 dark:text-surface-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-6 py-5 sm:py-6 space-y-6">
          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wide">
              Order Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Order ID</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-surface-100 dark:bg-surface-800 px-3 py-2 rounded-lg text-surface-900 dark:text-white">
                    {order.orderId}
                  </code>
                  <button
                    onClick={() => copyToClipboard(order.orderId)}
                    className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
                  >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-surface-500" />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Order Date</p>
                <p className="text-sm font-medium text-surface-900 dark:text-white">{order.date}</p>
              </div>
              <div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Order Status</p>
                <Badge variant={(order.status || 'pending').toLowerCase()}>{order.status || 'Pending'}</Badge>
              </div>
              <div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Payment Status</p>
                <Badge variant={order.paymentStatus === 'Paid' ? 'paid' : 'unpaid'}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>

          {/* Status Tracker */}
          <div className="border-t border-surface-200 dark:border-surface-800 pt-6">
            <StatusTracker currentStatus={(order.status || 'pending').toLowerCase()} order={order} />
          </div>

          {/* Customer Information */}
          <div className="space-y-4 border-t border-surface-200 dark:border-surface-800 pt-6">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wide">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Customer Name</p>
                <p className="text-sm font-medium text-surface-900 dark:text-white">{order.customer}</p>
              </div>
              <div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Email</p>
                <p className="text-sm font-medium text-surface-900 dark:text-white">{order.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Phone</p>
                <p className="text-sm font-medium text-surface-900 dark:text-white">{order.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-4 border-t border-surface-200 dark:border-surface-800 pt-6">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wide">
              Delivery Address
            </h3>
            <div className="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-lg border border-surface-200 dark:border-surface-700">
              <p className="text-sm text-surface-900 dark:text-white mb-2">{order.address || 'Not provided'}</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">{order.city || ''} {order.zip || ''}</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4 border-t border-surface-200 dark:border-surface-800 pt-6">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wide">
              Order Items
            </h3>
            <div className="space-y-3">
              {Array.isArray(order.items) ? order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{item.name || 'Unknown Item'}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">Qty: {item.quantity || 0}</p>
                  </div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">₹{item.price || 0}</p>
                </div>
              )) : (
                <p className="text-sm text-surface-500 dark:text-surface-400 italic">No items found or loading...</p>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4 border-t border-surface-200 dark:border-surface-800 pt-6">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wide">
              Payment Details
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600 dark:text-surface-400">Subtotal</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">₹{Number(order.subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600 dark:text-surface-400">Shipping</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">₹{Number(order.shipping || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600 dark:text-surface-400">Tax</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">₹{Number(order.tax || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-surface-200 dark:border-surface-700 pt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-surface-900 dark:text-white">Total Amount</span>
                <span className="text-lg font-bold text-admin-primary-600">₹{Number(order.amount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sticky Action Buttons */}
        <div className="border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 px-5 sm:px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col gap-4 flex-shrink-0">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Update Status</label>
            <div className="grid grid-cols-2 gap-2">
              <select 
                value={(order.status || 'pending').toLowerCase()}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                disabled={isUpdating}
                className="w-full bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-admin-primary-500 outline-none disabled:opacity-50"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => handleStatusUpdate('confirmed')}
                disabled={isUpdating || (order.status || '').toLowerCase() === 'confirmed'}
              >
                Confirm Order
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="w-full">
              Print Invoice
            </Button>
            <Button variant="danger" className="w-full" onClick={() => handleStatusUpdate('canceled')} disabled={isUpdating}>
              Cancel Order
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(drawerUI, document.body);
};

export default OrderDetailsDrawer;
