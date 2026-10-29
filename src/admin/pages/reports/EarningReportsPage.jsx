import React, { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Download, Filter, ShoppingCart, Store, Wallet } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const report = {
  label: 'Admin Earning',
  filters: ['This Year', 'This Month', 'Last 30 Days', 'Custom Range'],
  summary: {
    totalEarnings: '$148,620.00',
    commission: '$23,110.00',
    inHouse: '$91,250.00',
    shipping: '$34,260.00',
    products: '1,248',
    shops: '86',
    paymentsAmount: '$92,430.00',
    paymentBreakdown: [
      { label: 'Cash payments', value: '$34,000.00', tone: 'primary' },
      { label: 'Digital payments', value: '$41,800.00', tone: 'info' },
      { label: 'Wallet', value: '$13,900.00', tone: 'warning' },
      { label: 'Offline payments', value: '$2,730.00', tone: 'secondary' },
    ],
  },
  chart: [
    { month: 'Jan', earnings: 18000, payments: 13600 },
    { month: 'Feb', earnings: 19200, payments: 14500 },
    { month: 'Mar', earnings: 22100, payments: 17600 },
    { month: 'Apr', earnings: 20500, payments: 17300 },
    { month: 'May', earnings: 24800, payments: 19400 },
    { month: 'Jun', earnings: 24020, payments: 20030 },
  ],
  rows: [
    { duration: 'Jan', inHouse: '$15,400.00', commission: '$3,450.00', shipping: '$2,110.00', incentive: '$650.00', discount: '$1,000.00', vat: '$760.00', refund: '$210.00', total: '$20,600.00' },
    { duration: 'Feb', inHouse: '$16,800.00', commission: '$3,600.00', shipping: '$2,380.00', incentive: '$700.00', discount: '$1,110.00', vat: '$815.00', refund: '$180.00', total: '$22,115.00' },
    { duration: 'Mar', inHouse: '$18,250.00', commission: '$3,980.00', shipping: '$2,760.00', incentive: '$725.00', discount: '$1,180.00', vat: '$910.00', refund: '$240.00', total: '$23,805.00' },
    { duration: 'Apr', inHouse: '$17,900.00', commission: '$3,700.00', shipping: '$2,540.00', incentive: '$710.00', discount: '$1,040.00', vat: '$860.00', refund: '$190.00', total: '$23,480.00' },
  ],
};

const EarningReportsPage = () => {
  const [selectedRange, setSelectedRange] = useState('This Year');

  const tableTotals = useMemo(() => report.rows.length, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">14 Sales & Reports</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">Earning Reports</h1>
          <p className="text-sm sm:text-base text-surface-500 max-w-2xl">Track earnings, payment mix, and source breakdowns from one report workspace.</p>
        </div>

      </div>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 sm:p-6 shadow-card space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">Filter Data</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <select value={selectedRange} onChange={(event) => setSelectedRange(event.target.value)} className="min-w-[12rem] rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100">
                {report.filters.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <Button variant="primary" icon={Filter}>Filter</Button>
            </div>
          </div>
          <Button variant="secondary" icon={Download}>Export</Button>
        </div>

        <div className="grid gap-4 xl:grid-cols-[18rem_minmax(0,1fr)_18rem] items-start">
          <div className="space-y-4">
            <article className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700"><ShoppingCart size={18} className="text-admin-primary-600" /></div>
                <div>
                  <p className="text-sm text-surface-500">Total earnings</p>
                  <h3 className="text-3xl font-extrabold text-surface-900 dark:text-white">{report.summary.totalEarnings}</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div><p className="text-red-500 font-semibold">{report.summary.commission}</p><p className="text-surface-500">Commission</p></div>
                <div><p className="text-admin-primary-600 font-semibold">{report.summary.inHouse}</p><p className="text-surface-500">In House</p></div>
                <div><p className="text-emerald-600 font-semibold">{report.summary.shipping}</p><p className="text-surface-500">Shipping</p></div>
              </div>
            </article>

            <article className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card"><div className="flex items-center gap-3"><div className="p-2.5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700"><Store size={18} className="text-admin-primary-600" /></div><div><p className="text-sm text-surface-500">Total In House Products</p><h3 className="text-2xl font-extrabold text-surface-900 dark:text-white">{report.summary.products}</h3></div></div></article>
            <article className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card"><div className="flex items-center gap-3"><div className="p-2.5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700"><Wallet size={18} className="text-admin-primary-600" /></div><div><p className="text-sm text-surface-500">Total Shop</p><h3 className="text-2xl font-extrabold text-surface-900 dark:text-white">{report.summary.shops}</h3></div></div></article>
          </div>

          <div className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card h-full min-h-[24rem]">
            <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Earning Statistics</h3>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={report.chart}>
                <defs>
                  <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="paymentsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="earnings" stroke="#2563eb" fill="url(#earningsFill)" strokeWidth={3} />
                <Area type="monotone" dataKey="payments" stroke="#0f766e" fill="url(#paymentsFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card space-y-4">
            <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">Payment Statistics</p>
            <div className="text-center py-8">
              <p className="text-3xl font-extrabold text-surface-900 dark:text-white">{report.summary.paymentsAmount}</p>
              <p className="text-sm text-surface-500">Payments Amount</p>
            </div>
            <div className="space-y-2 text-sm">
              {report.summary.paymentBreakdown.map((item) => (
                <div key={item.label} className="inline-flex items-center gap-2 text-admin-primary-600">
                  <Badge variant={item.tone} size="sm">{item.label.replace(' payments', '')}</Badge>
                  <span>{item.label} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl shadow-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-surface-100 dark:border-surface-700 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Total Earnings</h2>
            <p className="text-sm text-surface-500">Current breakdown by duration and earnings sources for {report.label.toLowerCase()}.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="primary">{tableTotals} records</Badge>
            <Button variant="secondary" icon={Download}>Export</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-surface-900/60 border-b border-surface-200 dark:border-surface-700"><tr><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">SL</th><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Duration</th><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">In-House Earning</th><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Commission Earning</th><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Earn From Shipping</th><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Deliveryman Incentive</th><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Discount Given</th><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">VAT/TAX</th><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Refund Given</th><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Total Earning</th></tr></thead>
            <tbody>
              {report.rows.map((row, index) => (
                <tr key={row.duration} className="border-b border-surface-100 dark:border-surface-800">
                  <td className="px-5 py-4 text-surface-500">{index + 1}</td>
                  <td className="px-5 py-4 font-semibold text-surface-900 dark:text-white">{row.duration}</td>
                  <td className="px-5 py-4">{row.inHouse}</td>
                  <td className="px-5 py-4">{row.commission}</td>
                  <td className="px-5 py-4">{row.shipping}</td>
                  <td className="px-5 py-4">{row.incentive}</td>
                  <td className="px-5 py-4">{row.discount}</td>
                  <td className="px-5 py-4">{row.vat}</td>
                  <td className="px-5 py-4">{row.refund}</td>
                  <td className="px-5 py-4 font-semibold text-surface-900 dark:text-white">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default EarningReportsPage;
