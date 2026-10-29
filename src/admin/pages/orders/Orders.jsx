import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  Filter,
  TrendingUp,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  Calendar,
  Loader2,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import FilterBar from '../../components/orders/FilterBar';
import OrderDetailsDrawer from '../../components/orders/OrderDetailsDrawer';
import { toast } from 'sonner';
import api from '../../../lib/api';

const getStatusVariant = (status) => {
  if (!status) return 'pending';
  const normalized = String(status).toLowerCase().replace(/\s+/g, '-');
  if (normalized === 'out-for-delivery') return 'delivery';
  if (normalized === 'failed-to-deliver') return 'failed';
  if (normalized === 'cancelled') return 'canceled';
  return normalized;
};

const KpiCard = ({ title, value, icon: Icon, trend = '+8.2%', tone = 'primary' }) => {
  const toneClasses = {
    primary: 'text-admin-primary-600 bg-admin-primary-50 dark:bg-admin-primary-900/20',
    success: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    warning: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
    danger: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  };

  return (
    <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card hover:shadow-card-hover transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className={`p-1.5 rounded-md ${toneClasses[tone]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-green-100 dark:bg-green-900/30 text-green-600">
          <TrendingUp size={8} />
          {trend}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-[11px] font-semibold text-surface-500 uppercase tracking-wide">{title}</p>
        <p className="text-lg sm:text-xl font-extrabold text-surface-900 dark:text-white tracking-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
};

const statusLabels = {
  pending: 'Pending Orders',
  confirmed: 'Confirmed Orders',
  processing: 'Processing Orders',
  packaging: 'Packaging Orders',
  shipped: 'Shipped Orders',
  delivery: 'Out for Delivery',
  delivered: 'Delivered Orders',
  returned: 'Returned Orders',
  failed: 'Failed to Deliver',
  canceled: 'Canceled Orders',
};

const Orders = ({ status: propStatus }) => {
  const { status: urlStatus } = useParams();
  const activeStatus = propStatus || urlStatus || 'all';
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(activeStatus);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
  const [selectedRows, setSelectedRows] = useState([]);

  // Sync state if URL changes
  useEffect(() => {
    setSelectedStatus(activeStatus);
  }, [activeStatus]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.orders.list({ status: selectedStatus });
      setOrders(data.items || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (selectedPaymentStatus !== 'All') {
      filtered = filtered.filter(o => o.paymentStatus === selectedPaymentStatus);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.orderId.toLowerCase().includes(query) || 
        o.customer.toLowerCase().includes(query) || 
        o.email.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [orders, searchQuery, selectedPaymentStatus]);

  const handleRowClick = async (order) => {
    try {
      const data = await api.orders.getById(order.id);
      const item = data.item || {};
      const fullOrder = {
        ...order,
        ...item,
        // Map everything explicitly to avoid camelCase vs snake_case issues
        address: item.shippingAddress?.address || item.shipping_address?.address || order.address,
        city: item.shippingAddress?.city || item.shipping_address?.city || order.city,
        zip: item.shippingAddress?.postalCode || item.shipping_address?.postalCode || order.zip,
        phone: item.customerDetails?.phone || item.customer_details?.phone || order.phone,
        items: item.items || order.items || [],
        subtotal: item.subtotal || order.subtotal || 0,
        shipping: item.shippingCost || item.shipping_cost || order.shipping || 0,
        tax: item.tax || 0,
      };
      setSelectedOrder(fullOrder);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      setSelectedOrder(order);
      setIsDrawerOpen(true);
    }
  };

  const handleDelete = async (e, order) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete order #${order.orderId}?`)) {
      try {
        await api.orders.delete(order.id);
        toast.success("Order deleted successfully");
        fetchOrders();
      } catch (error) {
        toast.error("Failed to delete order");
      }
    }
  };

  const handleExport = () => {
    const csv = [
      ['Order ID', 'Customer', 'Date', 'Amount', 'Payment Status', 'Order Status'],
      ...filteredOrders.map(order => [
        order.orderId,
        order.customer,
        order.date,
        `₹${order.amount}`,
        order.paymentStatus,
        order.status,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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

  const getCount = (status) => orders.filter(o => o.status.toLowerCase() === status.toLowerCase()).length;

  const statusStats = [
    { label: 'Pending', value: getCount('Pending'), icon: Filter, trend: '+2.1%', tone: 'warning' },
    { label: 'Confirmed', value: getCount('Confirmed'), icon: CheckCircle, trend: '+4.4%', tone: 'primary' },
    { label: 'Packaging', value: getCount('Packaging'), icon: ShoppingCart, trend: '+3.2%', tone: 'primary' },
    { label: 'Out for Delivery', value: getCount('Out for Delivery'), icon: ShoppingCart, trend: '+3.8%', tone: 'primary' },
    { label: 'Delivered', value: getCount('Delivered'), icon: CheckCircle, trend: '+6.8%', tone: 'success' },
    { label: 'Canceled', value: getCount('Canceled'), icon: AlertCircle, trend: '+1.9%', tone: 'danger' },
  ];

  const tableColumns = [
    { key: 'orderId', label: 'Order ID', sortable: true, render: (row) => <code className="text-xs font-mono bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded">{row.orderId}</code> },
    { key: 'customer', label: 'Customer', sortable: true, render: (row) => (
      <div className="flex flex-col">
        <span className="font-medium text-surface-900 dark:text-white">{row.customer}</span>
        <span className="text-xs text-surface-500 dark:text-surface-400">{row.email}</span>
      </div>
    )},
    { key: 'date', label: 'Date', sortable: true, render: (row) => (
      <span className="text-surface-600 dark:text-surface-300">
        {new Date(row.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
      </span>
    )},
    { key: 'amount', label: 'Amount', sortable: true, render: (row) => <span className="font-semibold text-surface-900 dark:text-white">₹{row.amount.toLocaleString('en-IN')}</span> },
    { key: 'paymentStatus', label: 'Payment', sortable: true, render: (row) => <Badge variant={row.paymentStatus === 'Paid' ? 'paid' : row.paymentStatus === 'Unpaid' ? 'unpaid' : 'pending_payment'} dot>{row.paymentStatus}</Badge> },
    { key: 'status', label: 'Order Status', sortable: true, render: (row) => <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge> },
    { key: 'actions', label: 'Actions', sortable: false, render: (row) => (
      <div className="flex items-center gap-2">
        <button onClick={() => handleRowClick(row)} className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-surface-600 dark:text-surface-400 hover:text-admin-primary-600" title="View Details"><Eye size={18} /></button>
        <button onClick={() => handleRowClick(row)} className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-surface-600 dark:text-surface-400 hover:text-admin-primary-600" title="Edit"><Edit size={18} /></button>
        <button onClick={(e) => handleDelete(e, row)} className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-surface-600 dark:text-surface-400 hover:text-red-600" title="Delete"><Trash2 size={18} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
          {statusLabels[selectedStatus] || 'Orders'} <span className="text-admin-primary-600">Overview</span>
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <Button variant="primary" size="md" icon={Download} onClick={handleExport}>Export Data</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard title="Total Orders" value={orders.length} icon={ShoppingCart} trend="+12.5%" tone="primary" />
        {statusStats.slice(0, 3).map((stat) => (
          <KpiCard key={stat.label} title={stat.label} value={stat.value} icon={stat.icon} trend={stat.trend} tone={stat.tone} />
        ))}
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-card">
        <FilterBar 
          onSearch={setSearchQuery} 
          onStatusFilter={setSelectedStatus} 
          onPaymentStatusFilter={setSelectedPaymentStatus} 
          statuses={statusOptions} 
          onReset={() => {
            setSearchQuery('');
            setSelectedStatus('all');
            setSelectedPaymentStatus('All');
          }}
        />
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-admin-primary-600 mb-4" /><p className="text-surface-500 font-medium">Fetching orders...</p></div>
        ) : (
          <Table columns={tableColumns} data={filteredOrders} onRowClick={handleRowClick} pageSize={10} selectable={true} onSelectRows={setSelectedRows} />
        )}
      </div>

      <OrderDetailsDrawer order={selectedOrder} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onUpdate={fetchOrders} />
    </div>
  );
};

export default Orders;
