import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Search,
  Download,
  Menu,
  ChevronRight,
  Filter,
  Calendar,
  TrendingUp,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import { getOrdersByStatus, searchOrders } from '../../constants/ordersMockData';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import FilterBar from '../../components/orders/FilterBar';
import OrderDetailsDrawer from '../../components/orders/OrderDetailsDrawer';
import { getCurrentDateRange } from '../../utils/dateUtils';

const statusLabels = {
  pending: 'Pending Orders',
  confirmed: 'Confirmed Orders',
  packaging: 'Packaging Orders',
  delivery: 'Out for Delivery',
  delivered: 'Delivered Orders',
  returned: 'Returned Orders',
  failed: 'Failed to Deliver',
  canceled: 'Canceled Orders',
};

const getStatusVariant = (status = '') => {
  const normalized = status.toLowerCase().replace(/\s+/g, '-');
  if (normalized === 'out-for-delivery') return 'delivery';
  if (normalized === 'failed-to-deliver') return 'failed';
  if (normalized === 'cancelled') return 'canceled';
  return normalized;
};

const KpiCard = ({ title, value, icon: Icon, trend = '+5.2%', tone = 'primary' }) => {
  const toneClasses = {
    primary: 'text-admin-primary-600 bg-admin-primary-50 dark:bg-admin-primary-900/20',
    success: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    warning: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
    danger: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  };

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card hover:shadow-card-hover transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${toneClasses[tone]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-600">
          <TrendingUp size={10} />
          {trend}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-extrabold text-surface-900 dark:text-white tracking-tight mt-1">{value}</p>
      </div>
    </div>
  );
};

const OrderByStatus = () => {
  const { status } = useParams();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Get orders filtered by status
  const statusOrders = useMemo(() => {
    const filtered = getOrdersByStatus(status);
    
    // Apply payment filter
    if (paymentFilter !== 'All') {
      return filtered.filter((order) => order.paymentStatus === paymentFilter);
    }
    return filtered;
  }, [status, paymentFilter]);

  // Apply search and sorting
  const displayedOrders = useMemo(() => {
    let result = [...statusOrders];

    // Search filter
    if (searchQuery) {
      result = searchOrders(searchQuery, result);
    }

    // Sort
    result.sort((a, b) => {
      const key = sortConfig.key;
      let aVal = a[key];
      let bVal = b[key];

      if (key === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (key === 'amount') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [statusOrders, searchQuery, sortConfig]);

  // Calculate statistics
  const stats = useMemo(() => {
    const paidCount = displayedOrders.filter(o => o.paymentStatus === 'Paid').length;
    const pendingPaymentCount = displayedOrders.filter(o => o.paymentStatus === 'Pending').length;
    const totalAmount = displayedOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);

    return {
      total: displayedOrders.length,
      paid: paidCount,
      pending: pendingPaymentCount,
      totalAmount,
    };
  }, [displayedOrders]);

  const pageTitle = statusLabels[status] || 'Orders';

  const columns = [
    {
      key: 'orderId',
      label: 'Order ID',
      width: '12%',
      render: (row) => <span className="font-semibold text-surface-900 dark:text-surface-100">{row.orderId}</span>,
      sortable: true,
    },
    {
      key: 'customer',
      label: 'Customer',
      width: '15%',
      render: (row) => <span className="text-surface-700 dark:text-surface-300">{row.customer}</span>,
      sortable: true,
    },
    {
      key: 'date',
      label: 'Order Date',
      width: '12%',
      render: (row) => <span className="text-surface-600 dark:text-surface-400">{new Date(row.date).toLocaleDateString()}</span>,
      sortable: true,
    },
    {
      key: 'amount',
      label: 'Amount',
      width: '10%',
      render: (row) => <span className="font-semibold text-surface-900 dark:text-surface-100">${Number(row.amount).toLocaleString()}</span>,
      sortable: true,
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      width: '12%',
      render: (row) => <Badge variant={row.paymentStatus === 'Paid' ? 'paid' : 'pending_payment'}>{row.paymentStatus}</Badge>,
    },
    {
      key: 'status',
      label: 'Order Status',
      width: '12%',
      render: (row) => <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '10%',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedOrder(row);
            setIsDrawerOpen(true);
          }}
          className="hover:bg-surface-100 dark:hover:bg-surface-800"
        >
          View
        </Button>
      ),
    },
  ];

  const handleExport = () => {
    if (displayedOrders.length === 0) {
      alert('No orders to export');
      return;
    }

    const csv = [
      ['Order ID', 'Customer', 'Email', 'Date', 'Amount', 'Payment Status', 'Order Status'],
      ...displayedOrders.map(order => [
        order.orderId,
        order.customer,
        order.email,
        new Date(order.date).toLocaleDateString(),
        order.amount,
        order.paymentStatus,
        order.status,
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders-${status}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleReset = () => {
    setSearchQuery('');
    setPaymentFilter('All');
    setSortConfig({ key: 'date', direction: 'desc' });
  };

  const handleRowClick = (row) => {
    setSelectedOrder(row);
    setIsDrawerOpen(true);
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
                {pageTitle} <span className="text-admin-primary-600">Overview</span>
              </h1>
              <span className="px-3 py-1 bg-admin-primary-100 dark:bg-admin-primary-900/30 text-admin-primary-600 dark:text-admin-primary-400 rounded-full text-sm font-semibold">
                {displayedOrders.length}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-sm text-sm font-medium text-surface-600 dark:text-surface-300">
              <Calendar size={16} className="text-admin-primary-500" />
              <span className="whitespace-nowrap">{getCurrentDateRange(7)}</span>
            </div>
            <Button variant="primary" size="md" onClick={handleExport} icon={Download}>
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-admin-primary-600" />
            <h2 className="text-sm font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider">Status Intelligence</h2>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Total Orders" value={stats.total} icon={ShoppingCart} trend="+9.4%" tone="primary" />
            <KpiCard title="Paid Orders" value={stats.paid} icon={CheckCircle} trend="+5.7%" tone="success" />
            <KpiCard title="Pending Payment" value={stats.pending} icon={CreditCard} trend="+2.3%" tone="warning" />
            <KpiCard title="Status Alerts" value={Math.max(0, stats.total - stats.paid)} icon={AlertCircle} trend="+1.1%" tone="danger" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-card">
        <FilterBar
          onSearch={setSearchQuery}
          onStatusFilter={() => {}}
          onPaymentStatusFilter={setPaymentFilter}
          onReset={handleReset}
          statuses={statusOptions}
          paymentStatuses={['All', 'Paid', 'Unpaid', 'Pending']}
        />
      </div>

      {/* Bulk Actions */}
      {displayedOrders.length > 0 && (
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 border border-surface-200 dark:border-surface-700 flex items-center gap-3 shadow-card">
          <Menu className="w-5 h-5 text-surface-400" />
          <span className="text-sm text-surface-600 dark:text-surface-400">
            {displayedOrders.length} {displayedOrders.length === 1 ? 'order' : 'orders'} found
          </span>
        </div>
      )}

      {/* Orders Table */}
      {displayedOrders.length > 0 ? (
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card overflow-hidden">
          <Table
            columns={columns}
            data={displayedOrders}
            onRowClick={handleRowClick}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-12 text-center shadow-card">
          <Filter className="w-12 h-12 mx-auto text-surface-300 dark:text-surface-700 mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">No orders found</h3>
          <p className="text-surface-600 dark:text-surface-400">
            {searchQuery ? 'Try adjusting your search filters' : `No ${status} orders available`}
          </p>
        </div>
      )}

      {/* Order Details Drawer */}
      {selectedOrder && (
        <OrderDetailsDrawer
          isOpen={isDrawerOpen}
          order={selectedOrder}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderByStatus;
