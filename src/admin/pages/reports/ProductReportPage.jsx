import React, { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Download, Filter, Package, Search, ShoppingBag, Tag, Undo2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const reportTabs = [
  { id: 'all', label: 'All Products' },
  { id: 'stock', label: 'Product Stock' },
  { id: 'wishlist', label: 'Wish Listed Products' },
];

const vendorOptions = ['All', 'In House', 'Vendor A', 'Vendor B'];
const dateOptions = ['This Year', 'This Month', 'Last 30 Days', 'Last 7 Days'];

const chartData = {
  all: [
    { month: 'Jan', total: 120 },
    { month: 'Feb', total: 145 },
    { month: 'Mar', total: 170 },
    { month: 'Apr', total: 165 },
    { month: 'May', total: 190 },
    { month: 'Jun', total: 220 },
  ],
  stock: [
    { month: 'Jan', total: 98 },
    { month: 'Feb', total: 102 },
    { month: 'Mar', total: 95 },
    { month: 'Apr', total: 88 },
    { month: 'May', total: 91 },
    { month: 'Jun', total: 85 },
  ],
  wishlist: [
    { month: 'Jan', total: 210 },
    { month: 'Feb', total: 230 },
    { month: 'Mar', total: 260 },
    { month: 'Apr', total: 245 },
    { month: 'May', total: 280 },
    { month: 'Jun', total: 300 },
  ],
};

const productData = {
  all: [
    { id: 'PRD-1001', name: 'Pro Yoga Mat', unitPrice: '$49.00', soldAmount: '$8,820.00', qtySold: 180, avgValue: '$49.00', stock: 92, rating: 4.7, vendor: 'In House', status: 'Active' },
    { id: 'PRD-1002', name: 'Smart Jump Rope', unitPrice: '$35.00', soldAmount: '$4,900.00', qtySold: 140, avgValue: '$35.00', stock: 58, rating: 4.5, vendor: 'Vendor A', status: 'Pending' },
    { id: 'PRD-1003', name: 'Balance Board', unitPrice: '$89.00', soldAmount: '$7,565.00', qtySold: 85, avgValue: '$89.00', stock: 20, rating: 4.6, vendor: 'Vendor B', status: 'Rejected' },
  ],
  stock: [
    { id: 'PRD-2001', name: 'Resistance Band Set', unitPrice: '$29.00', soldAmount: '$3,770.00', qtySold: 130, avgValue: '$29.00', stock: 14, rating: 4.4, vendor: 'In House', status: 'Active' },
    { id: 'PRD-2002', name: 'Fitness Gloves', unitPrice: '$22.00', soldAmount: '$2,420.00', qtySold: 110, avgValue: '$22.00', stock: 7, rating: 4.3, vendor: 'Vendor A', status: 'Pending' },
  ],
  wishlist: [
    { id: 'PRD-3001', name: 'Smart Kettlebell', unitPrice: '$129.00', soldAmount: '$2,580.00', qtySold: 20, avgValue: '$129.00', stock: 32, rating: 4.9, vendor: 'Vendor B', status: 'Active' },
    { id: 'PRD-3002', name: 'Recovery Massage Gun', unitPrice: '$159.00', soldAmount: '$4,611.00', qtySold: 29, avgValue: '$159.00', stock: 18, rating: 4.8, vendor: 'In House', status: 'Active' },
  ],
};

const toneByStatus = {
  Active: 'success',
  Pending: 'warning',
  Rejected: 'danger',
};

const ProductReportPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [vendor, setVendor] = useState('All');
  const [dateRange, setDateRange] = useState('This Year');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const search = query.trim().toLowerCase();
    return productData[activeTab].filter((item) => {
      const matchesVendor = vendor === 'All' || item.vendor === vendor;
      const matchesSearch = !search || item.name.toLowerCase().includes(search) || item.id.toLowerCase().includes(search);
      return matchesVendor && matchesSearch;
    });
  }, [activeTab, query, vendor]);

  const totals = useMemo(() => {
    const list = productData[activeTab];
    return {
      totalProducts: list.length,
      rejected: list.filter((item) => item.status === 'Rejected').length,
      pending: list.filter((item) => item.status === 'Pending').length,
      active: list.filter((item) => item.status === 'Active').length,
      productSale: list.reduce((sum, item) => sum + Number(item.soldAmount.replace(/[$,]/g, '')), 0),
      discountGiven: list.reduce((sum, item) => sum + (Number(item.qtySold) * 0.8), 0),
    };
  }, [activeTab]);

  const resetFilters = () => {
    setVendor('All');
    setDateRange('This Year');
    setQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">15 Sales & Reports</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">Product Report</h1>
        <p className="text-sm sm:text-base text-surface-500 max-w-2xl">Track product performance, stock behavior, and wishlist trends from one report workspace.</p>
      </div>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 sm:p-6 shadow-card space-y-6">
        <div className="flex flex-wrap gap-2 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-1 w-fit">
          {reportTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${activeTab === tab.id ? 'bg-admin-primary-600 text-white shadow-md shadow-admin-primary-500/20' : 'text-surface-500 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">Filter Data</p>
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto]">
            <select value={vendor} onChange={(event) => setVendor(event.target.value)} className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100">
              {vendorOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100">
              {dateOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <Button type="button" variant="secondary" icon={Undo2} onClick={resetFilters}>Reset</Button>
            <Button type="button" variant="primary" icon={Filter}>Filter</Button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-4">
            <article className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-3xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700"><Package size={18} className="text-admin-primary-600" /></div>
                <div>
                  <p className="text-sm text-surface-500">Total Product</p>
                  <h3 className="text-3xl font-extrabold text-surface-900 dark:text-white">{totals.totalProducts}</h3>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div><p className="font-semibold text-red-500">{totals.rejected}</p><p className="text-surface-500">Rejected</p></div>
                <div><p className="font-semibold text-amber-500">{totals.pending}</p><p className="text-surface-500">Pending</p></div>
                <div><p className="font-semibold text-emerald-600">{totals.active}</p><p className="text-surface-500">Active</p></div>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="bg-emerald-50/70 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40 rounded-3xl p-5">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={18} className="text-emerald-600" />
                  <div>
                    <p className="text-sm text-surface-500">Total Product Sale</p>
                    <h3 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">${totals.productSale.toLocaleString()}</h3>
                  </div>
                </div>
              </article>
              <article className="bg-amber-50/70 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 rounded-3xl p-5">
                <div className="flex items-center gap-3">
                  <Tag size={18} className="text-amber-600" />
                  <div>
                    <p className="text-sm text-surface-500">Total Discount Given</p>
                    <h3 className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">${totals.discountGiven.toFixed(2)}</h3>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <article className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 min-h-[13rem]">
            <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Product Statistics</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData[activeTab]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </article>
        </div>
      </section>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl shadow-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-surface-100 dark:border-surface-700 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-[22rem]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product name" className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 pl-10 pr-4 py-2.5 text-sm text-surface-700 dark:text-surface-100 placeholder:text-surface-400" />
          </div>
          <Button variant="secondary" icon={Download}>Export</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-surface-50 dark:bg-surface-900/60 border-b border-surface-200 dark:border-surface-700">
              <tr>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">SL</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Product Name</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Product Unit Price</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Total Amount Sold</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Total Quantity Sold</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Average Product Value</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Current Stock Amount</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Average Ratings</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="border-b border-surface-100 dark:border-surface-800">
                  <td className="px-5 py-4 text-surface-500">{index + 1}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-surface-900 dark:text-white">{row.name}</p>
                    <p className="text-xs text-surface-500">{row.id}</p>
                  </td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.unitPrice}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.soldAmount}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.qtySold}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.avgValue}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.stock}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.rating.toFixed(1)}</td>
                  <td className="px-5 py-4"><Badge variant={toneByStatus[row.status] || 'info'} size="sm">{row.status}</Badge></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-surface-500 dark:text-surface-400">No product found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ProductReportPage;
