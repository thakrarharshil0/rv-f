import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar,
  Download,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  Wallet,
  XCircle,
  Clock3,
  Search,
  Eye,
  Check,
  Ban,
  X,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import api from '../../../lib/api';
import { toast } from 'sonner';
import { getCurrentDateRange } from '../../utils/dateUtils';

const statusBadgeVariant = {
  Pending: 'pending',
  Approved: 'primary',
  Refunded: 'success',
  Rejected: 'danger',
};

const priorityBadgeVariant = {
  High: 'danger',
  Medium: 'warning',
  Low: 'info',
};

const cardTones = {
  primary: 'text-admin-primary-600 bg-admin-primary-50 dark:bg-admin-primary-900/20',
  success: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  warning: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  danger: 'text-red-600 bg-red-50 dark:bg-red-900/20',
};

const KpiCard = ({ title, value, icon, trend, tone }) => {
  const Icon = icon;

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${cardTones[tone]}`}>
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

const RefundModulePage = ({ title: propTitle, status: propStatus }) => {
  const { status: paramStatus } = useParams();
  const status = paramStatus || propStatus || 'all';

  const title = useMemo(() => {
    if (propTitle) return propTitle;
    const statusName = status.charAt(0).toUpperCase() + status.slice(1);
    return status === 'all' ? 'Refund Requests' : `${statusName} Refunds`;
  }, [propTitle, status]);

  const [refundRows, setRefundRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [actionNote, setActionNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const data = await api.refunds.list({ status });
      setRefundRows(data.items || []);
    } catch (error) {
      console.error("Failed to fetch refunds:", error);
      toast.error("Failed to load refund requests");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRefunds();
  }, [status]);

  const filteredRefunds = useMemo(() => {
    let data = refundRows;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(r =>
        r.refundId.toLowerCase().includes(q) ||
        r.orderId.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q)
      );
    }

    if (priorityFilter !== 'All') {
      data = data.filter((refund) => refund.priority === priorityFilter);
    }

    if (paymentFilter !== 'All') {
      data = data.filter((refund) => refund.paymentMethod === paymentFilter);
    }

    return data;
  }, [paymentFilter, priorityFilter, searchQuery, refundRows]);

  const stats = useMemo(() => {
    const source = refundRows;
    return {
      totalRequests: source.length,
      pending: source.filter((item) => item.status === 'Pending').length,
      approved: source.filter((item) => item.status === 'Approved').length,
      refundedAmount: source
        .filter((item) => item.status === 'Refunded')
        .reduce((sum, item) => sum + item.amount, 0),
      rejected: source.filter((item) => item.status === 'Rejected').length,
    };
  }, [refundRows, status]);

  const paymentMethods = useMemo(() => {
    const unique = new Set(refundRows.map((item) => item.paymentMethod));
    return ['All', ...Array.from(unique)];
  }, [refundRows]);

  const updateRefundStatus = (refundId, nextStatus) => {
    setRefundRows((previousRows) =>
      previousRows.map((row) => (row.refundId === refundId ? { ...row, status: nextStatus } : row))
    );
  };

  const handleApprove = async (refund) => {
    if (refund.status !== 'Pending') return;
    try {
      await api.refunds.update(refund.id, { status: 'approved' });
      toast.success("Refund approved");
      fetchRefunds();
    } catch (error) {
      toast.error("Failed to approve refund");
    }
  };

  const handleReject = async (refund) => {
    if (refund.status !== 'Pending') return;
    try {
      await api.refunds.update(refund.id, { status: 'rejected' });
      toast.success("Refund rejected");
      fetchRefunds();
    } catch (error) {
      toast.error("Failed to reject refund");
    }
  };

  const columns = [
    {
      key: 'refundId',
      label: 'Refund ID',
      sortable: true,
      render: (row) => <span className="font-semibold text-surface-900 dark:text-white">{row.refundId}</span>,
    },
    {
      key: 'orderId',
      label: 'Order ID',
      sortable: true,
      render: (row) => <span className="text-surface-700 dark:text-surface-300">{row.orderId}</span>,
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-surface-900 dark:text-white">{row.customer}</span>
          <span className="text-xs text-surface-500 dark:text-surface-400">{row.email}</span>
        </div>
      ),
    },
    {
      key: 'requestedOn',
      label: 'Requested On',
      sortable: true,
      render: (row) => (
        <span className="text-surface-600 dark:text-surface-400">
          {new Date(row.requestedOn).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => <span className="font-semibold">₹{row.amount.toLocaleString('en-IN')}</span>,
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (row) => <Badge variant={priorityBadgeVariant[row.priority]}>{row.priority}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={statusBadgeVariant[row.status]} dot>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'assignee',
      label: 'Assignee',
      render: (row) => <span className="text-surface-700 dark:text-surface-300">{row.assignee}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => {
        const canReview = row.status === 'Pending';

        return (
          <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
            <Button
              variant="success"
              size="sm"
              icon={Check}
              disabled={!canReview}
              onClick={() => handleApprove(row)}
              className="!px-2.5 !py-1.5 !text-xs"
            >
              Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Ban}
              disabled={!canReview}
              onClick={() => handleReject(row)}
              className="!px-2.5 !py-1.5 !text-xs"
            >
              Reject
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={Eye}
              onClick={() => setSelectedRefund(row)}
              className="!px-2.5 !py-1.5 !text-xs"
            >
              View
            </Button>
          </div>
        );
      },
    },
  ];

  const handleExport = () => {
    const csv = [
      ['Refund ID', 'Order ID', 'Customer', 'Requested On', 'Amount', 'Priority', 'Status', 'Assignee', 'Reason'],
      ...filteredRefunds.map((row) => [
        row.refundId,
        row.orderId,
        row.customer,
        row.requestedOn,
        row.amount,
        row.priority,
        row.status,
        row.assignee,
        row.reason,
      ]),
    ]
      .map((line) => line.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `refunds-${status}-${new Date().toISOString().split('T')[0]}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
                {title} <span className="text-admin-primary-600">Overview</span>
              </h1>
              <span className="px-3 py-1 bg-admin-primary-100 dark:bg-admin-primary-900/30 text-admin-primary-600 dark:text-admin-primary-400 rounded-full text-sm font-semibold">
                {filteredRefunds.length}
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

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard title="Total Requests" value={stats.totalRequests} icon={RotateCcw} tone="primary" />
          <KpiCard title="Pending" value={stats.pending} icon={Clock3} tone="warning" />
          <KpiCard title="Approved" value={stats.approved} icon={CheckCircle2} tone="primary" />
          <KpiCard title="Refunded Amt" value={`₹${stats.refundedAmount.toLocaleString('en-IN')}`} icon={Wallet} tone="success" />
          <KpiCard title="Rejected" value={stats.rejected} icon={XCircle} tone="danger" />
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 shadow-card space-y-4">
        {actionNote && (
          <div className="px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-700 dark:text-green-300 flex items-center justify-between">
            <span>{actionNote}</span>
            <button
              type="button"
              onClick={() => setActionNote('')}
              className="text-green-700 dark:text-green-300 hover:opacity-80"
              aria-label="Dismiss action message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
            <input
              type="text"
              placeholder="Search refund, order, customer..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-admin-primary-500 text-surface-900 dark:text-white"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className="px-3 py-2.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-admin-primary-500 text-surface-900 dark:text-white"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(event) => setPaymentFilter(event.target.value)}
            className="px-3 py-2.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-admin-primary-500 text-surface-900 dark:text-white"
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method === 'All' ? 'All Payment Methods' : method}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card overflow-hidden">
        <Table
          columns={columns}
          data={filteredRefunds}
          isLoading={loading}
          emptyState={<p className="text-surface-500 dark:text-surface-400">No refund requests found for the selected filters.</p>}
          pageSize={8}
        />
      </div>

      {selectedRefund && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
          onClick={() => setSelectedRefund(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-5 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-surface-900 dark:text-white">Refund Request Details</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">{selectedRefund.refundId}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedRefund(null)} icon={X} />
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-surface-500 dark:text-surface-400">Order ID</p>
                <p className="font-semibold text-surface-900 dark:text-white">{selectedRefund.orderId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-surface-500 dark:text-surface-400">Customer</p>
                <p className="font-semibold text-surface-900 dark:text-white">{selectedRefund.customer}</p>
              </div>
              <div className="space-y-1">
                <p className="text-surface-500 dark:text-surface-400">Requested On</p>
                <p className="font-semibold text-surface-900 dark:text-white">{selectedRefund.requestedOn}</p>
              </div>
              <div className="space-y-1">
                <p className="text-surface-500 dark:text-surface-400">Amount</p>
                <p className="font-semibold text-surface-900 dark:text-white">₹{selectedRefund.amount.toLocaleString('en-IN')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-surface-500 dark:text-surface-400">Payment Method</p>
                <p className="font-semibold text-surface-900 dark:text-white">{selectedRefund.paymentMethod}</p>
              </div>
              <div className="space-y-1">
                <p className="text-surface-500 dark:text-surface-400">Assignee</p>
                <p className="font-semibold text-surface-900 dark:text-white">{selectedRefund.assignee}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-surface-500 dark:text-surface-400">Reason</p>
                <p className="font-medium text-surface-800 dark:text-surface-100">{selectedRefund.reason}</p>
              </div>
              <div className="space-y-1">
                <p className="text-surface-500 dark:text-surface-400">Priority</p>
                <Badge variant={priorityBadgeVariant[selectedRefund.priority]}>{selectedRefund.priority}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-surface-500 dark:text-surface-400">Status</p>
                <Badge variant={statusBadgeVariant[selectedRefund.status]}>{selectedRefund.status}</Badge>
              </div>
            </div>

            <div className="p-5 border-t border-surface-200 dark:border-surface-700 flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => setSelectedRefund(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundModulePage;
