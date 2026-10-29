import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Calendar, 
  Download, 
  BarChart3,
  RefreshCw,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import api from '../../../lib/api';
import AdminDateRangePicker from '../../components/ui/AdminDateRangePicker';
import { toast } from 'sonner';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const current = payload.find(p => p.dataKey === 'sales')?.value || 0;
    const prev = payload.find(p => p.dataKey === 'prev')?.value || 0;
    const orders = payload[0]?.payload?.orders || 0;

    return (
      <div className="bg-white/95 dark:bg-surface-800/95 backdrop-blur-md border border-surface-200 dark:border-surface-700 rounded-xl shadow-xl p-3 min-w-[200px]">
        <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">{payload[0]?.payload?.date || label}</p>
        <div className="space-y-1">
          <div className="flex justify-between items-center gap-3">
            <span className="text-xs font-semibold text-admin-primary-600">Sales:</span>
            <span className="text-sm font-black text-surface-900 dark:text-white">₹{Number(current).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center gap-3">
            <span className="text-xs text-surface-400">Previous:</span>
            <span className="text-xs font-bold text-surface-500">₹{Number(prev).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center gap-3 pt-1 border-t border-surface-100 dark:border-surface-700">
            <span className="text-[11px] text-surface-400">Total Orders:</span>
            <span className="text-xs font-bold text-admin-primary-600">{orders}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const SalesAnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState('7D');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
    label: 'Last 7 Days',
  });

  const fetchAnalytics = async (tf = timeframe) => {
    setIsLoading(true);
    try {
      const res = await api.admin.salesAnalytics({ timeframe: tf });
      setAnalyticsData(res);
    } catch (err) {
      console.error('Failed to load sales analytics:', err);
      toast.error('Failed to load real-time analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(timeframe);
  }, [timeframe]);

  const summary = analyticsData?.summary || {
    totalSales: 0,
    totalOrders: 0,
    deliveredOrders: 0,
    avgOrderValue: 0,
  };

  const chart = analyticsData?.chart || [];
  const recentOrders = analyticsData?.recent || [];

  const handleExport = () => {
    if (!chart.length) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Period/Day,Sales (INR),Orders",
         ...chart.map(c => `"${c.date || c.name}",${c.sales},${c.orders}`)
        ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_analytics_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Sales Analytics report exported!");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/30 text-admin-primary-600 text-xs font-bold uppercase tracking-wider">
            Real-Time Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">
            Sales <span className="text-admin-primary-600">Analytics</span>
          </h1>
          <p className="text-sm sm:text-base text-surface-500 max-w-xl">
            Live revenue metrics, order velocity, and performance breakdowns directly synced with your store database.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Timeframe switch */}
          <div className="flex items-center gap-1 bg-surface-100 dark:bg-surface-800 p-1.5 rounded-xl border border-surface-200 dark:border-surface-700">
            {['7D', '30D', '6M', '1Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-admin-primary-600 text-white shadow-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchAnalytics(timeframe)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-admin-primary-500 rounded-xl text-sm font-medium text-surface-700 dark:text-surface-200 transition-colors shadow-sm"
          >
            <RefreshCw size={15} className={`text-admin-primary-600 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-admin-primary-600 text-white rounded-xl shadow-lg shadow-admin-primary-500/30 hover:bg-admin-primary-700 transition-all font-semibold active:scale-95 text-sm"
          >
            <Download size={15} />
            Export Data
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-surface-500 uppercase tracking-wide">Gross Delivered Sales</span>
            <div className="p-2 rounded-xl bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-surface-900 dark:text-white tracking-tight">
            ₹{Number(summary.totalSales).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-green-600">
            <TrendingUp size={13} />
            Delivered revenue
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-surface-500 uppercase tracking-wide">Total Store Orders</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
              <ShoppingCart size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-surface-900 dark:text-white tracking-tight">
            {summary.totalOrders}
          </div>
          <div className="text-xs text-surface-500 mt-2">
            All registered orders
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-surface-500 uppercase tracking-wide">Fulfilled & Delivered</span>
            <div className="p-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-surface-900 dark:text-white tracking-tight">
            {summary.deliveredOrders}
          </div>
          <div className="text-xs text-surface-500 mt-2">
            Completed order cycles
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-surface-500 uppercase tracking-wide">Avg. Order Value (AOV)</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600">
              <BarChart3 size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-surface-900 dark:text-white tracking-tight">
            ₹{Number(summary.avgOrderValue).toLocaleString()}
          </div>
          <div className="text-xs text-surface-500 mt-2">
            Per delivered customer cart
          </div>
        </div>
      </div>

      {/* Main Interactive Chart Section */}
      <div className="p-6 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-surface-900 dark:text-white">Revenue Velocity ({timeframe})</h3>
            <p className="text-xs text-surface-400 mt-0.5">Calculated from dynamic live database order totals</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-2 text-admin-primary-600">
              <span className="w-3 h-3 rounded-full bg-admin-primary-600" /> Current Period
            </div>
            <div className="flex items-center gap-2 text-surface-400">
              <span className="w-3 h-3 rounded-full bg-surface-300 dark:bg-surface-600" /> Comparison Period
            </div>
          </div>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-surface-200 dark:stroke-surface-700" />
              <XAxis dataKey="name" tickLine={false} className="text-xs text-surface-400" />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                className="text-xs text-surface-400" 
                tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} fill="url(#salesGrad)" />
              <Area type="monotone" dataKey="prev" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Volume Bar Chart & Recent Delivered Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl shadow-card space-y-4">
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">Order Volume Breakdown</h3>
          <p className="text-xs text-surface-400">Number of orders created over the active timeframe</p>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-surface-200 dark:stroke-surface-700" />
                <XAxis dataKey="name" tickLine={false} className="text-xs text-surface-400" />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} className="text-xs text-surface-400" />
                <Tooltip 
                  cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }} 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-2.5 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow text-xs">
                          <p className="font-bold">{payload[0]?.payload?.date || payload[0]?.payload?.name}</p>
                          <p className="text-admin-primary-600 font-extrabold mt-1">{payload[0]?.value} Orders</p>
                        </div>
                      );
                    }
                    return null;
                  }} 
                />
                <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Delivered Stream */}
        <div className="p-6 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">Recent Delivered</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600">
                Live DB
              </span>
            </div>

            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-surface-400 text-xs">
                  No delivered orders recorded yet
                </div>
              ) : (
                recentOrders.slice(0, 5).map((o) => (
                  <div key={o.id} className="p-3 rounded-xl bg-surface-50 dark:bg-surface-900/50 border border-surface-100 dark:border-surface-700/50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-surface-900 dark:text-white">#{o.order_number || o.id}</p>
                      <p className="text-[10px] text-surface-400">{new Date(o.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-admin-primary-600">₹{Number(o.total).toLocaleString()}</p>
                      <span className="text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                        Delivered
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <p className="text-[11px] text-surface-400 text-center pt-3 border-t border-surface-100 dark:border-surface-700">
            Analytics automatically sync with customer checkout events.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalyticsPage;
