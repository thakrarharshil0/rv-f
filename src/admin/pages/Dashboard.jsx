import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  ChevronRight,
  Calendar,
  Store,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import SalesAnalyticsChart from '../components/charts/SalesAnalyticsChart';

const data = [
  { name: 'Mon', sales: 4000, prevSales: 3200, revenue: 2400 },
  { name: 'Tue', sales: 3000, prevSales: 2800, revenue: 1398 },
  { name: 'Wed', sales: 2000, prevSales: 2400, revenue: 9800 },
  { name: 'Thu', sales: 2780, prevSales: 3100, revenue: 3908 },
  { name: 'Fri', sales: 1890, prevSales: 2200, revenue: 4800 },
  { name: 'Sat', sales: 2390, prevSales: 2100, revenue: 3800 },
  { name: 'Sun', sales: 3490, prevSales: 3800, revenue: 4300 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const currentValue = payload[0].value;
    const change = Math.round(((currentValue - 3200) / 3200) * 100);
    const isPositive = change >= 0;

    return (
      <div className="bg-white/95 dark:bg-surface-800/95 backdrop-blur-md border border-white/20 dark:border-surface-700/50 rounded-2xl shadow-2xl p-4 min-w-[220px]">
        <p className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-2">{label}</p>
        <p className="text-2xl font-black text-surface-900 dark:text-white mb-1">₹{currentValue.toLocaleString()}</p>
        <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{isPositive ? '+' : ''}{change}%</span>
        </div>
        <p className="text-[10px] text-surface-500 mt-2">vs previous period</p>
      </div>
    );
  }
  return null;
};

const KPICard = ({ title, value, change, isPositive, icon: Icon, color }) => (
  <div className={`p-4 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card hover:shadow-card-hover transition-all duration-300 group`}>
    <div className="flex items-center justify-between">
      <div className={`p-2 rounded-lg bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-700 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-6`}>
        <Icon className={`w-5 h-5 text-admin-primary-600`} />
      </div>
      <button className="p-1 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreVertical size={14} />
      </button>
    </div>
    <div className="mt-3">
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-xs font-medium text-surface-500">{title}</span>
        <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${isPositive ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
          {isPositive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
          {change}%
        </div>
      </div>
      <div className="text-lg font-bold text-surface-900 dark:text-white tracking-tight">
        {value}
      </div>
    </div>
  </div>
);

const AnalyticsCard = ({ title, value, icon: Icon, high, low, showHigh }) => (
  <div className="p-4 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card hover:shadow-card-hover transition-all duration-300 group">
    <div className="flex items-center justify-between">
      <div className="p-2 rounded-lg bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-700 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-6">
        <Icon className="w-5 h-5 text-admin-primary-600" />
      </div>
      <button className="p-1 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreVertical size={14} />
      </button>
    </div>
    <div className="mt-3">
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-xs font-medium text-surface-500">{title}</span>
        <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${showHigh ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
          {showHigh ? (
            <>
              <TrendingUp size={9} />
              {high}%
            </>
          ) : (
            <>
              <TrendingDown size={9} />
              {low}%
            </>
          )}
        </div>
      </div>
      <div className="text-lg font-bold text-surface-900 dark:text-white tracking-tight">
        {value}
      </div>
    </div>
  </div>
);

import { useState, useEffect } from 'react';
import api from '../../lib/api';
import AdminDateRangePicker from '../components/ui/AdminDateRangePicker';
import { toast } from 'sonner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    packagingOrders: 0,
    outForDeliveryOrders: 0,
    deliveredOrders: 0,
    canceledOrders: 0,
    returnedOrders: 0,
    failedOrders: 0,
    totalSales: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    const formatDate = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
      label: 'Last 7 Days',
    };
  });

  const fetchStats = async (range = dateRange) => {
    setIsLoading(true);
    try {
      const data = await api.admin.dashboardStats({
        startDate: range.startDate,
        endDate: range.endDate,
      });
      setStats(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(dateRange);
  }, [dateRange]);

  const handleDateChange = (newRange) => {
    setDateRange(newRange);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Metric,Value",
         `Total Sales,₹${stats.totalSales}`,
         `Total Orders,${stats.totalOrders}`,
         `Total Customers,${stats.totalCustomers}`,
         `Pending Orders,${stats.pendingOrders}`,
         `Confirmed Orders,${stats.confirmedOrders}`,
         `Packaging Orders,${stats.packagingOrders}`,
         `Out for Delivery,${stats.outForDeliveryOrders}`,
         `Delivered Orders,${stats.deliveredOrders}`,
         `Canceled Orders,${stats.canceledOrders}`,
         `Returned Orders,${stats.returnedOrders}`,
         `Failed to Deliver,${stats.failedOrders}`,
         `Date Range,"${dateRange.startDate} to ${dateRange.endDate}"`
        ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dashboard_report_${dateRange.startDate}_${dateRange.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Dashboard metrics exported successfully!");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 transition-all duration-300">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight animate-slide-in">
            Dashboard <span className="text-admin-primary-600">Overview</span>
          </h1>
          <p className="text-sm sm:text-base text-surface-500 max-w-md">
            Welcome back! Monitor your RoyalVirtus health at a glance.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto animate-fade-in group">
          <AdminDateRangePicker
            value={dateRange}
            onChange={handleDateChange}
          />
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-admin-primary-600 text-white rounded-xl shadow-lg shadow-admin-primary-500/30 hover:bg-admin-primary-700 hover:shadow-admin-primary-500/40 transition-all font-semibold active:scale-95 text-sm sm:text-base cursor-pointer"
          >
            Export Data
            <ArrowUpRight size={16} className="text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Business Analytics Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <BarChart3 size={24} className="text-admin-primary-600" />
          <h2 className="text-xl font-black text-surface-900 dark:text-white tracking-tight">Business Analytics</h2>
        </div>

        {/* Section: Overview */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider">Overview</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Total Sales" value={`₹${stats.totalSales.toLocaleString()}`} change="0" isPositive={true} icon={DollarSign} />
            <KPICard title="Total Orders" value={stats.totalOrders.toString()} change="0" isPositive={true} icon={ShoppingCart} />
            <KPICard title="Total Customers" value={stats.totalCustomers.toString()} change="0" isPositive={true} icon={Users} />
            <KPICard title="Pending Orders" value={stats.pendingOrders.toString()} change="0" isPositive={false} icon={BarChart3} />
          </div>
        </div>

        {/* Section: Order Flow */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider">Order Flow</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnalyticsCard title="Pending Orders" value={stats.pendingOrders.toString()} icon={Clock} high="0" low="0" showHigh={false} />
            <AnalyticsCard title="Confirmed Orders" value={stats.confirmedOrders.toString()} icon={CheckCircle} high="0" low="0" showHigh={true} />
            <AnalyticsCard title="Packaging" value={stats.packagingOrders.toString()} icon={Package} high="0" low="0" showHigh={true} />
            <AnalyticsCard title="Out for Delivery" value={stats.outForDeliveryOrders.toString()} icon={Truck} high="0" low="0" showHigh={true} />
            <AnalyticsCard title="Delivered Orders" value={stats.deliveredOrders.toString()} icon={CheckCircle} high="0" low="0" showHigh={true} />
            <AnalyticsCard title="Canceled Orders" value={stats.canceledOrders.toString()} icon={XCircle} high="0" low="0" showHigh={false} />
            <AnalyticsCard title="Returned Orders" value={stats.returnedOrders.toString()} icon={RotateCcw} high="0" low="0" showHigh={false} />
            <AnalyticsCard title="Failed to Deliver" value={stats.failedOrders.toString()} icon={AlertCircle} high="0" low="0" showHigh={false} />
          </div>
        </div>

        {/* Section: Revenue Insights */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider">Revenue Insights</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card hover:shadow-card-hover transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-700 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-6">
                  <DollarSign className="w-6 h-6 text-admin-primary-600" />
                </div>
                <button className="p-1 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-sm font-medium text-surface-500">Total Revenue</span>
                  <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-600">
                    <TrendingUp size={10} />
                    0%
                  </div>
                </div>
                <div className="text-3xl font-black text-surface-900 dark:text-white tracking-tight">₹{stats.totalSales.toLocaleString()}</div>
                <p className="text-xs text-surface-500 mt-3">Monthly revenue growth based on delivered orders.</p>
              </div>
            </div>

            <div className="space-y-4">
              <AnalyticsCard title="Total Stores" value="1" icon={Store} high="0" low="0" showHigh={true} />
              <AnalyticsCard title="Total Products" value={stats.totalProducts.toString()} icon={Package} high="0" low="0" showHigh={true} />
            </div>
          </div>
        </div>

        {/* Section: Activity */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider">Activity</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
            <AnalyticsCard title="Total Orders" value={stats.totalOrders.toString()} icon={ShoppingCart} high="0" low="0" showHigh={true} />
            <AnalyticsCard title="Total Customers" value={stats.totalCustomers.toString()} icon={Users} high="0" low="0" showHigh={true} />
          </div>
        </div>
      </div>

      {/* Analytics Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 transition-all duration-300 auto-rows-max lg:auto-rows-auto">
        {/* Sales Chart Container */}
        <div className="lg:col-span-2 w-full">
          <SalesAnalyticsChart />
        </div>

        {/* Activity Feed Container */}
        <div className="p-5 sm:p-7 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl shadow-card h-full">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-surface-900 dark:text-white">Recent Activity</h2>
              <button className="text-xs font-bold text-admin-primary-600 hover:text-admin-primary-700 uppercase tracking-wider">View All</button>
           </div>
           <div className="space-y-7 relative">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 relative group cursor-pointer">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-700 p-0.5 relative z-10 transition-transform group-hover:scale-110">
                      <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${i + 62}`} alt="Avatar" className="w-full h-full rounded-lg" />
                  </div>
                  {i !== 4 && <div className="absolute left-5 top-10 w-px h-[calc(100%+28px)] bg-surface-100 dark:bg-surface-700" />}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-surface-900 dark:text-white truncate">Order #{(45821 + i).toString()}</span>
                      <span className="text-[10px] text-surface-400 font-bold uppercase whitespace-nowrap">{i * 15}m ago</span>
                    </div>
                    <p className="text-xs text-surface-500 mt-1 line-clamp-2">New order placed by Alex Johnson for $129.00</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl shadow-card overflow-hidden transition-all duration-300">
        <div className="p-5 sm:p-7 border-b border-surface-100 dark:border-surface-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Recent Store Orders</h2>
            <p className="text-xs sm:text-sm text-surface-400">Real-time update of your latest customer transactions</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-xs font-bold text-surface-600 dark:text-surface-300 hover:text-admin-primary-600 transition-colors whitespace-nowrap">
            Detailed Overview <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="text-[10px] font-bold uppercase tracking-widest text-surface-400 border-b border-surface-50 dark:border-surface-700">
              <tr>
                <th className="py-4 px-6">Transaction ID</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Full Date</th>
                <th className="py-4 px-4 text-right">Price</th>
                <th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-surface-50 dark:divide-surface-700/50">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="group hover:bg-surface-25 dark:hover:bg-surface-900/30 transition-colors cursor-pointer">
                  <td className="py-4 px-6 font-mono font-bold text-surface-900 dark:text-white text-xs">#FT-82{i}954</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${i * 812}`} alt="Initials" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-surface-900 dark:text-white text-sm truncate">Jordan Vance</div>
                        <div className="text-[10px] text-surface-500 font-medium">j.vance@mail.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-surface-500 font-bold text-xs">0{i} Apr, 2026</td>
                  <td className="py-4 px-4 text-right font-black text-surface-900 dark:text-white">${(199.99 + (i * 20)).toFixed(2)}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${i % 3 === 0 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 'bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600'}`}>
                      {i % 3 === 0 ? 'PROCESSING' : 'COMPLETED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
