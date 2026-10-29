import React, { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Download, Filter, Search, ShoppingCart, Wallet } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const sellerOptions = ['All', 'In House', 'Vendor A', 'Vendor B'];
const dateOptions = ['This Year', 'This Month', 'Last 30 Days', 'Last 7 Days'];

const chartData = [
  { month: 'Jan', total: 1200 },
  { month: 'Feb', total: 1500 },
  { month: 'Mar', total: 2300 },
  { month: 'Apr', total: 2944 },
  { month: 'May', total: 1800 },
  { month: 'Jun', total: 1700 },
  { month: 'Jul', total: 2000 },
  { month: 'Aug', total: 2100 },
  { month: 'Sep', total: 1950 },
  { month: 'Oct', total: 2400 },
  { month: 'Nov', total: 2600 },
  { month: 'Dec', total: 2800 },
];

const orderRows = [
  {
    id: 'ORD-1001',
    totalAmount: '$1,250.00',
    dueAmount: '$0.00',
    returnAmount: '$0.00',
    productDiscount: '$25.00',
    couponDiscount: '$0.00',
    referralDiscount: '$0.00',
    shippingCharge: '$12.00',
    vatTax: '$61.25',
    commission: '$18.00',
    delivery: '$6.00',
    seller: 'In House',
    status: 'Completed',
  },
  {
    id: 'ORD-1002',
    totalAmount: '$944.00',
    dueAmount: '$0.00',
    returnAmount: '$0.00',
    productDiscount: '$18.00',
    couponDiscount: '$10.00',
    referralDiscount: '$0.00',
    shippingCharge: '$8.00',
    vatTax: '$47.20',
    commission: '$12.00',
    delivery: '$5.00',
    seller: 'Vendor A',
    status: 'Ongoing',
  },
  {
    id: 'ORD-1003',
    totalAmount: '$750.00',
    dueAmount: '$120.00',
    returnAmount: '$30.00',
    productDiscount: '$12.00',
    couponDiscount: '$8.00',
    referralDiscount: '$4.00',
    shippingCharge: '$7.00',
    vatTax: '$36.50',
    commission: '$10.00',
    delivery: '$4.00',
    seller: 'Vendor B',
    status: 'Canceled',
  },
];

const statusTone = {
  Completed: 'success',
  Ongoing: 'info',
  Canceled: 'danger',
};

const toNumber = (value) => Number(value.replace(/[$,]/g, ''));

const OrderReportPage = () => {
  const [sellerFilter, setSellerFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('This Year');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const search = query.trim().toLowerCase();
    return orderRows.filter((row) => {
      const matchesSeller = sellerFilter === 'All' || row.seller === sellerFilter;
      const matchesSearch = !search || row.id.toLowerCase().includes(search);
      return matchesSeller && matchesSearch;
    });
  }, [query, sellerFilter]);

  const totals = useMemo(() => {
    return {
      totalOrders: rows.length,
      canceled: rows.filter((row) => row.status === 'Canceled').length,
      ongoing: rows.filter((row) => row.status === 'Ongoing').length,
      completed: rows.filter((row) => row.status === 'Completed').length,
      totalOrderAmount: rows.reduce((sum, row) => sum + toNumber(row.totalAmount), 0),
      dueAmount: rows.reduce((sum, row) => sum + toNumber(row.dueAmount), 0),
    };
  }, [rows]);

  const alreadySettled = totals.totalOrderAmount - totals.dueAmount;

  const resetFilters = () => {
    setSellerFilter('All');
    setDateFilter('This Year');
    setQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">16 Sales & Reports</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">Order Report</h1>
        <p className="text-sm sm:text-base text-surface-500 max-w-2xl">Analyze orders with seller filters, settlement view, and payment-side breakdowns.</p>
      </div>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 sm:p-6 shadow-card space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">Filter Data</p>
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto]">
            <select value={sellerFilter} onChange={(event) => setSellerFilter(event.target.value)} className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100">
              {sellerOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100">
              {dateOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <Button type="button" variant="secondary" onClick={resetFilters}>Reset</Button>
            <Button type="button" variant="primary" icon={Filter}>Filter</Button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[17rem_minmax(0,1fr)_17rem] items-start">
          <div className="space-y-4">
            <article className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-3xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700"><ShoppingCart size={18} className="text-admin-primary-600" /></div>
                <div>
                  <p className="text-sm text-surface-500">Total Orders</p>
                  <h3 className="text-3xl font-extrabold text-surface-900 dark:text-white">{totals.totalOrders}</h3>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div><p className="font-semibold text-red-500">{totals.canceled}</p><p className="text-surface-500">Canceled</p></div>
                <div><p className="font-semibold text-blue-500">{totals.ongoing}</p><p className="text-surface-500">Ongoing</p></div>
                <div><p className="font-semibold text-emerald-600">{totals.completed}</p><p className="text-surface-500">Completed</p></div>
              </div>
            </article>

            <article className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-3xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700"><Wallet size={18} className="text-admin-primary-600" /></div>
                <div>
                  <p className="text-sm text-surface-500">Total Order Amount</p>
                  <h3 className="text-3xl font-extrabold text-surface-900 dark:text-white">${totals.totalOrderAmount.toFixed(2)}</h3>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><p className="font-semibold text-red-500">${totals.dueAmount.toFixed(2)}</p><p className="text-surface-500">Due Amount</p></div>
                <div><p className="font-semibold text-emerald-600">${alreadySettled.toFixed(2)}</p><p className="text-surface-500">Already Settled</p></div>
              </div>
            </article>
          </div>

          <article className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 min-h-[22rem]">
            <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Order Statistics</h3>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="orderFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#2563eb" fill="url(#orderFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </article>

          <article className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 space-y-4 min-h-[22rem]">
            <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">Payment Statistics</p>
            <div className="text-center py-8">
              <p className="text-3xl font-extrabold text-surface-900 dark:text-white">$0.00</p>
              <p className="text-sm text-surface-500">Completed Payments</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="inline-flex items-center gap-2 text-admin-primary-600"><Badge variant="primary" size="sm">Cash</Badge><span>Cash Payments ($0.00)</span></div>
              <div className="inline-flex items-center gap-2 text-admin-primary-600"><Badge variant="info" size="sm">Digital</Badge><span>Digital Payments ($0.00)</span></div>
              <div className="inline-flex items-center gap-2 text-admin-primary-600"><Badge variant="warning" size="sm">Wallet</Badge><span>Wallet ($0.00)</span></div>
              <div className="inline-flex items-center gap-2 text-admin-primary-600"><Badge variant="secondary" size="sm">Offline</Badge><span>Offline Payments ($0.00)</span></div>
              <div className="inline-flex items-center gap-2 text-admin-primary-600"><Badge variant="danger" size="sm">Returned</Badge><span>Returned Amount ($0.00)</span></div>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl shadow-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-surface-100 dark:border-surface-700 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Total Orders</h2>
            <p className="text-sm text-surface-500">{rows.length} records in current filter view.</p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative w-full lg:w-[18rem]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by order id" className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 pl-10 pr-4 py-2.5 text-sm text-surface-700 dark:text-surface-100 placeholder:text-surface-400" />
            </div>
            <Button variant="secondary" icon={Download}>Export</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px] text-sm">
            <thead className="bg-surface-50 dark:bg-surface-900/60 border-b border-surface-200 dark:border-surface-700">
              <tr>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">SL</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Order ID</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Total Amount</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Due Amount</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Return Amount</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Product Discount</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Coupon Discount</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Referral Discount</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Shipping Charge</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">VAT/TAX</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Commission</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Delivery</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="border-b border-surface-100 dark:border-surface-800">
                  <td className="px-5 py-4 text-surface-500">{index + 1}</td>
                  <td className="px-5 py-4 font-semibold text-surface-900 dark:text-white">{row.id}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.totalAmount}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.dueAmount}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.returnAmount}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.productDiscount}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.couponDiscount}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.referralDiscount}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.shippingCharge}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.vatTax}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.commission}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.delivery}</td>
                  <td className="px-5 py-4"><Badge variant={statusTone[row.status] || 'info'} size="sm">{row.status}</Badge></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={13} className="px-6 py-16 text-center text-surface-500 dark:text-surface-400">No order found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default OrderReportPage;
