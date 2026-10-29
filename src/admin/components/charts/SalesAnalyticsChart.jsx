import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const chartData = {
  '7D': [
    { name: 'Mon', sales: 4200, prev: 3800 },
    { name: 'Tue', sales: 3800, prev: 3600 },
    { name: 'Wed', sales: 2800, prev: 3400 },
    { name: 'Thu', sales: 3200, prev: 3200 },
    { name: 'Fri', sales: 2500, prev: 2900 },
    { name: 'Sat', sales: 4100, prev: 3700 },
    { name: 'Sun', sales: 4800, prev: 4100 },
  ],
  '30D': [
    { name: 'D1', sales: 12200, prev: 11600 },
    { name: 'D2', sales: 11850, prev: 11400 },
    { name: 'D3', sales: 12540, prev: 11780 },
    { name: 'D4', sales: 13120, prev: 12100 },
    { name: 'D5', sales: 12840, prev: 11960 },
    { name: 'D6', sales: 13600, prev: 12450 },
    { name: 'D7', sales: 14200, prev: 12900 },
    { name: 'D8', sales: 13820, prev: 12740 },
    { name: 'D9', sales: 14560, prev: 13280 },
    { name: 'D10', sales: 15240, prev: 13620 },
    { name: 'D11', sales: 14980, prev: 13400 },
    { name: 'D12', sales: 15600, prev: 13940 },
    { name: 'D13', sales: 16250, prev: 14400 },
    { name: 'D14', sales: 16800, prev: 14850 },
    { name: 'D15', sales: 16420, prev: 14620 },
    { name: 'D16', sales: 17100, prev: 15100 },
    { name: 'D17', sales: 17640, prev: 15600 },
    { name: 'D18', sales: 17280, prev: 15340 },
    { name: 'D19', sales: 18020, prev: 15880 },
    { name: 'D20', sales: 18600, prev: 16240 },
    { name: 'D21', sales: 18250, prev: 16020 },
    { name: 'D22', sales: 18980, prev: 16640 },
    { name: 'D23', sales: 19520, prev: 17080 },
    { name: 'D24', sales: 19140, prev: 16860 },
    { name: 'D25', sales: 19800, prev: 17320 },
    { name: 'D26', sales: 20450, prev: 17840 },
    { name: 'D27', sales: 20080, prev: 17520 },
    { name: 'D28', sales: 20720, prev: 18100 },
    { name: 'D29', sales: 21340, prev: 18580 },
    { name: 'D30', sales: 21900, prev: 18940 },
  ],
  '6M': [
    { name: 'Jan', sales: 42000, prev: 38000 },
    { name: 'Feb', sales: 38000, prev: 32000 },
    { name: 'Mar', sales: 45000, prev: 40000 },
    { name: 'Apr', sales: 48000, prev: 42000 },
    { name: 'May', sales: 52000, prev: 46000 },
    { name: 'Jun', sales: 58000, prev: 51000 },
  ],
  '1Y': [
    { name: 'Jan', sales: 98000, prev: 87000 },
    { name: 'Feb', sales: 104000, prev: 91000 },
    { name: 'Mar', sales: 112000, prev: 98000 },
    { name: 'Apr', sales: 118000, prev: 103000 },
    { name: 'May', sales: 124000, prev: 109000 },
    { name: 'Jun', sales: 131000, prev: 114000 },
    { name: 'Jul', sales: 138000, prev: 121000 },
    { name: 'Aug', sales: 145000, prev: 127000 },
    { name: 'Sep', sales: 153000, prev: 134000 },
    { name: 'Oct', sales: 162000, prev: 142000 },
    { name: 'Nov', sales: 171000, prev: 150000 },
    { name: 'Dec', sales: 182000, prev: 160000 },
  ],
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const salesPoint = payload.find((item) => item.dataKey === 'sales');
    const prevPoint = payload.find((item) => item.dataKey === 'prev');

    return (
      <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg p-3 shadow-lg min-w-[170px]">
        <p className="text-xs font-bold text-surface-600 dark:text-surface-300 mb-2">{data.name}</p>
        {salesPoint && (
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="text-xs font-semibold text-admin-primary-600">Current</span>
            <span className="text-sm font-black text-admin-primary-600">₹{(salesPoint.value / 1000).toFixed(1)}K</span>
          </div>
        )}
        {prevPoint && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-surface-500 dark:text-surface-400">Previous</span>
            <span className="text-sm font-black text-surface-700 dark:text-surface-200">₹{(prevPoint.value / 1000).toFixed(1)}K</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const SalesAnalyticsChart = () => {
  const [period, setPeriod] = useState('7D');
  const data = chartData[period];
  const maxValue = Math.max(...data.map(d => d.sales)) * 1.15;
  const totalRevenue = data.reduce((sum, d) => sum + d.sales, 0);
  const maxSales = Math.max(...data.map(d => d.sales));
  const peakDay = data.find(d => d.sales === maxSales)?.name;

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-surface-900 dark:text-white">Sales Analytics</h2>
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Total revenue: <span className="font-bold text-surface-900 dark:text-white">₹{(totalRevenue / 1000).toFixed(2)}K</span>
            <span className="ml-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold">
              <TrendingUp size={12} /> +12.5%
            </span>
          </p>
        </div>

        {/* Period Buttons */}
        <div className="flex items-center gap-2 bg-surface-100 dark:bg-surface-900/40 p-1.5 rounded-xl border border-surface-200 dark:border-surface-700">
          {['7D', '30D', '6M', '1Y'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                period === p
                  ? 'bg-admin-primary-100 dark:bg-admin-primary-900/40 text-admin-primary-600 dark:text-admin-primary-400 shadow-md'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-6 sm:p-8 shadow-lg overflow-hidden">
        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: -15, bottom: 20 }}>
              <defs>
                {/* Sales gradient */}
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                {/* Previous gradient */}
                <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9CA3AF" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#9CA3AF" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Grid */}
              <CartesianGrid
                strokeDasharray="0"
                vertical={false}
                stroke="#E5E7EB"
                opacity={0.2}
              />

              {/* Axes */}
              <XAxis
                dataKey="name"
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                interval={0}
                tickFormatter={(value, index) => {
                  if (period === '30D') {
                    return index % 5 === 0 ? value : '';
                  }
                  if (period === '1Y') {
                    return index % 2 === 0 ? value : '';
                  }
                  return value;
                }}
                tick={{ dy: 8, fill: '#9CA3AF' }}
              />

              <YAxis
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                domain={[0, maxValue]}
                tick={{ dx: -10, fill: '#9CA3AF' }}
                formatter={(value) => `${(value / 1000).toFixed(0)}`}
              />

              {/* Tooltip */}
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#94A3B8', strokeDasharray: '4 4', opacity: 0.45 }}
              />

              {/* Previous period line - dashed */}
              <Line
                type="monotone"
                dataKey="prev"
                stroke="#D1D5DB"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: '#9CA3AF',
                  stroke: '#FFFFFF',
                  strokeWidth: 2,
                }}
                isAnimationActive={false}
              />

              {/* Sales area - main */}
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#4F46E5"
                strokeWidth={3}
                fill="url(#colorSales)"
                dot={{
                  fill: '#4F46E5',
                  stroke: '#FFFFFF',
                  strokeWidth: 2,
                  r: 5,
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                }}
                animationDuration={800}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Peak Revenue */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-50/40 dark:from-blue-900/15 dark:to-transparent border border-blue-200 dark:border-blue-900/30">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Peak Revenue</p>
          <p className="text-3xl font-black text-blue-900 dark:text-blue-100 mb-1">₹{(maxSales / 1000).toFixed(1)}K</p>
          <p className="text-sm text-blue-700 dark:text-blue-400">{peakDay} was the strongest day</p>
        </div>

        {/* Performance */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-green-50/40 dark:from-green-900/15 dark:to-transparent border border-green-200 dark:border-green-900/30">
          <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-2">Performance</p>
          <p className="text-3xl font-black text-green-900 dark:text-green-100 mb-1">+12.5%</p>
          <p className="text-sm text-green-700 dark:text-green-400">vs previous week</p>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalyticsChart;
