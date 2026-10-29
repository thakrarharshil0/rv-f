import React, { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownRight, ArrowUpRight, CreditCard, Download, Eye, Filter, MoreHorizontal, Plus, Search, Store, Wallet } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const transactionTabs = [
  { id: 'orders', label: 'Order Transactions' },
  { id: 'expenses', label: 'Expense Transactions' },
  { id: 'refunds', label: 'Refund Transactions' },
];

const transactionSets = {
  orders: {
    statusOptions: ['All status', 'Completed', 'Pending', 'Failed'],
    sellerOptions: ['All', 'In House', 'Vendor'],
    customerOptions: ['All Customer', 'Alice Cooper', 'Emma Wilson', 'Michael Chen'],
    dateOptions: ['This Year', 'This Month', 'Last 30 Days'],
    summary: [
      { label: 'Total Orders', value: '1', sub: '1 In House Orders / 0 Vendor Orders', icon: Store, tone: 'primary' },
      { label: 'Total Products', value: '0', sub: '0 In House Products / 0 Vendor Products', icon: Wallet, tone: 'info' },
      { label: 'Total Stores', value: '0', sub: 'All sales channels', icon: CreditCard, tone: 'warning' },
    ],
    chart: [
      { month: 'Jan', total: 0 },
      { month: 'Feb', total: 0 },
      { month: 'Mar', total: 0 },
      { month: 'Apr', total: 2800 },
      { month: 'May', total: 0 },
      { month: 'Jun', total: 0 },
    ],
    payments: [
      { label: 'Cash payments', value: '$0.00', tone: 'primary' },
      { label: 'Digital payments', value: '$0.00', tone: 'info' },
      { label: 'Wallet', value: '$0.00', tone: 'warning' },
      { label: 'Offline payments', value: '$0.00', tone: 'secondary' },
      { label: 'Returned Amount', value: '$0.00', tone: 'danger' },
    ],
    rows: [
      { id: '#TRX-9482', orderId: 'ORD-1001', shopName: 'RoyalVirtus HQ', customerName: 'Alice Cooper', totalProductAmount: '$1,250.00', productDiscount: '$25.00', couponDiscount: '$0.00', referralDiscount: '$0.00', discountedAmount: '$1,225.00', vatTax: '$61.25', shippingCharge: '$12.00', paymentMethod: 'Visa', paymentStatus: 'Completed', netAmount: '$1,225.00' },
      { id: '#TRX-9481', orderId: 'ORD-1002', shopName: 'RoyalVirtus Outlet', customerName: 'Emma Wilson', totalProductAmount: '$85.00', productDiscount: '$5.00', couponDiscount: '$10.00', referralDiscount: '$0.00', discountedAmount: '$70.00', vatTax: '$3.50', shippingCharge: '$4.00', paymentMethod: 'Apple Pay', paymentStatus: 'Pending', netAmount: '$70.00' },
      { id: '#TRX-9479', orderId: 'ORD-1003', shopName: 'RoyalVirtus HQ', customerName: 'Michael Chen', totalProductAmount: '$450.00', productDiscount: '$0.00', couponDiscount: '$0.00', referralDiscount: '$0.00', discountedAmount: '$450.00', vatTax: '$22.50', shippingCharge: '$10.00', paymentMethod: 'Mastercard', paymentStatus: 'Completed', netAmount: '$450.00' },
    ],
  },
  expenses: {
    statusOptions: ['All status', 'Paid', 'Due', 'Pending'],
    sellerOptions: ['All', 'Internal', 'External'],
    customerOptions: ['All Customer', 'Admin', 'Vendor'],
    dateOptions: ['This Year', 'This Month', 'Last 30 Days'],
    summary: [
      { label: 'Total Expenses', value: '24', sub: '14 Paid / 10 Pending', icon: Wallet, tone: 'primary' },
      { label: 'Approved', value: '18', sub: 'Expense approvals completed', icon: Store, tone: 'success' },
      { label: 'Pending Bills', value: '6', sub: 'Awaiting settlement', icon: CreditCard, tone: 'warning' },
    ],
    chart: [
      { month: 'Jan', total: 4200 },
      { month: 'Feb', total: 3600 },
      { month: 'Mar', total: 5100 },
      { month: 'Apr', total: 4300 },
      { month: 'May', total: 6500 },
      { month: 'Jun', total: 5400 },
    ],
    payments: [
      { label: 'Cash payments', value: '$2,400.00', tone: 'primary' },
      { label: 'Digital payments', value: '$4,800.00', tone: 'info' },
      { label: 'Wallet', value: '$1,200.00', tone: 'warning' },
      { label: 'Offline payments', value: '$300.00', tone: 'secondary' },
      { label: 'Returned Amount', value: '$0.00', tone: 'danger' },
    ],
    rows: [
      { id: '#EXP-301', orderId: 'BILL-81', shopName: 'Operations', customerName: 'Admin', totalProductAmount: '$540.00', productDiscount: '$0.00', couponDiscount: '$0.00', referralDiscount: '$0.00', discountedAmount: '$540.00', vatTax: '$27.00', shippingCharge: '$0.00', paymentMethod: 'Bank', paymentStatus: 'Paid', netAmount: '$540.00' },
      { id: '#EXP-302', orderId: 'BILL-82', shopName: 'Logistics', customerName: 'Admin', totalProductAmount: '$1,200.00', productDiscount: '$0.00', couponDiscount: '$0.00', referralDiscount: '$0.00', discountedAmount: '$1,200.00', vatTax: '$60.00', shippingCharge: '$0.00', paymentMethod: 'Cash', paymentStatus: 'Pending', netAmount: '$1,200.00' },
    ],
  },
  refunds: {
    statusOptions: ['All status', 'Completed', 'Pending', 'Rejected'],
    sellerOptions: ['All', 'In House', 'Vendor'],
    customerOptions: ['All Customer', 'Sarah Jenkins', 'James Rodriguez'],
    dateOptions: ['This Year', 'This Month', 'Last 30 Days'],
    summary: [
      { label: 'Refund Requests', value: '9', sub: '3 completed / 6 pending', icon: Wallet, tone: 'primary' },
      { label: 'Processed', value: '3', sub: 'Refund queue closed', icon: Store, tone: 'success' },
      { label: 'Pending Review', value: '6', sub: 'Needs action', icon: CreditCard, tone: 'warning' },
    ],
    chart: [
      { month: 'Jan', total: 900 },
      { month: 'Feb', total: 1200 },
      { month: 'Mar', total: 800 },
      { month: 'Apr', total: 1800 },
      { month: 'May', total: 1100 },
      { month: 'Jun', total: 1500 },
    ],
    payments: [
      { label: 'Cash payments', value: '$0.00', tone: 'primary' },
      { label: 'Digital payments', value: '$0.00', tone: 'info' },
      { label: 'Wallet', value: '$0.00', tone: 'warning' },
      { label: 'Offline payments', value: '$0.00', tone: 'secondary' },
      { label: 'Returned Amount', value: '$3,250.00', tone: 'danger' },
    ],
    rows: [
      { id: '#RF-901', orderId: 'ORD-1004', shopName: 'RoyalVirtus HQ', customerName: 'Sarah Jenkins', totalProductAmount: '$129.50', productDiscount: '$0.00', couponDiscount: '$0.00', referralDiscount: '$0.00', discountedAmount: '$129.50', vatTax: '$6.47', shippingCharge: '$0.00', paymentMethod: 'PayPal', paymentStatus: 'Completed', netAmount: '$129.50' },
      { id: '#RF-902', orderId: 'ORD-1005', shopName: 'RoyalVirtus Outlet', customerName: 'James Rodriguez', totalProductAmount: '$210.25', productDiscount: '$0.00', couponDiscount: '$0.00', referralDiscount: '$0.00', discountedAmount: '$210.25', vatTax: '$10.51', shippingCharge: '$0.00', paymentMethod: 'Card', paymentStatus: 'Pending', netAmount: '$210.25' },
    ],
  },
};

const statusTone = (status) => {
  if (status === 'Completed' || status === 'Paid') return 'success';
  if (status === 'Pending' || status === 'Due') return 'warning';
  if (status === 'Refunded' || status === 'Rejected') return 'danger';
  return 'info';
};

const Transactions = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [statusFilter, setStatusFilter] = useState('All status');
  const [sellerFilter, setSellerFilter] = useState('All');
  const [customerFilter, setCustomerFilter] = useState('All Customer');
  const [dateFilter, setDateFilter] = useState('This Year');
  const [searchTerm, setSearchTerm] = useState('');

  const activeSet = transactionSets[activeTab];

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return activeSet.rows.filter((row) => {
      const matchesQuery = !query || Object.values(row).some((value) => String(value).toLowerCase().includes(query));
      const matchesStatus = statusFilter === 'All status' || row.paymentStatus === statusFilter;
      const matchesSeller = sellerFilter === 'All' || row.shopName.includes(sellerFilter) || sellerFilter === 'All Customer';
      const matchesCustomer = customerFilter === 'All Customer' || row.customerName === customerFilter;
      const matchesDate = !dateFilter || dateFilter === 'This Year';
      return matchesQuery && matchesStatus && matchesSeller && matchesCustomer && matchesDate;
    });
  }, [activeSet.rows, customerFilter, dateFilter, searchTerm, sellerFilter, statusFilter]);

  const summaryCards = activeSet.summary;

  return (
    <div className="space-y-8 max-w-7xl mx-auto transition-all duration-300">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">Sales & Transaction Report</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">Transaction Report</h1>
          <p className="text-sm sm:text-base text-surface-500 max-w-2xl">Review transaction flow, expense records, and refund processing from a single workspace.</p>
        </div>

        <div className="flex flex-wrap gap-2 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-1 shadow-sm w-fit">
          {transactionTabs.map((tab) => (
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
      </div>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 sm:p-6 shadow-card space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2 w-full">
            <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">Filter Data</p>
            <div className="grid gap-3 xl:grid-cols-[1.5fr_1fr_1fr_1fr]">
              <label className="block">
                <span className="sr-only">Search transactions</span>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by order, customer, shop, or amount" className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 pl-10 pr-4 py-3 text-sm text-surface-700 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20" />
                </div>
              </label>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100">
                {activeSet.statusOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
              <select value={sellerFilter} onChange={(event) => setSellerFilter(event.target.value)} className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100">
                {activeSet.sellerOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
              <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100">
                {activeSet.dateOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button variant="primary" icon={Filter} className="whitespace-nowrap">Filter</Button>
            <Button variant="secondary" icon={Download} className="whitespace-nowrap">Download PDF</Button>
            <Button variant="secondary" icon={Download} className="whitespace-nowrap">Export</Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-3">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.label} className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                    <Icon size={18} className="text-admin-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-surface-500">{card.label}</p>
                    <h3 className="text-3xl font-extrabold text-surface-900 dark:text-white">{card.value}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm text-surface-500">{card.sub}</p>
              </article>
            );
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem] items-start">
          <div className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card h-full min-h-[24rem]">
            <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Order Statistics</h3>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={activeSet.chart}>
                <defs>
                  <linearGradient id="transactionFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#2563eb" fill="url(#transactionFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card space-y-4">
            <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">Payment Statistics</p>
            <div className="text-center py-8">
              <p className="text-3xl font-extrabold text-surface-900 dark:text-white">$0.00</p>
              <p className="text-sm text-surface-500">Completed payments</p>
            </div>
            <div className="space-y-2 text-sm">
              {activeSet.payments.map((item) => (
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
        <div className="p-5 sm:p-6 border-b border-surface-100 dark:border-surface-700 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Total Transactions</h2>
            <p className="text-sm text-surface-500">Showing {filteredRows.length} records for the active report tab.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="primary">{activeTab === 'orders' ? 'Order' : activeTab === 'expenses' ? 'Expense' : 'Refund'} View</Badge>
            <Button variant="secondary" icon={Download}>Export</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left">
            <thead className="bg-surface-50 dark:bg-surface-900/60 border-b border-surface-200 dark:border-surface-700 text-[10px] uppercase font-black tracking-widest text-surface-400">
              <tr>
                <th className="py-5 px-6">SL</th>
                <th className="py-5 px-4">Order ID</th>
                <th className="py-5 px-4">Shop Name</th>
                <th className="py-5 px-4">Customer Name</th>
                <th className="py-5 px-4 text-right">Total Product Amount</th>
                <th className="py-5 px-4 text-right">Product Discount</th>
                <th className="py-5 px-4 text-right">Coupon Discount</th>
                <th className="py-5 px-4 text-right">Referral Discount</th>
                <th className="py-5 px-4 text-right">Discounted Amount</th>
                <th className="py-5 px-4 text-right">VAT/TAX</th>
                <th className="py-5 px-4 text-right">Shipping Charge</th>
                <th className="py-5 px-4">Payment Method</th>
                <th className="py-5 px-4 text-center">Status</th>
                <th className="py-5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-700/50">
              {filteredRows.map((row, index) => (
                <tr key={row.id} className="group hover:bg-surface-25 dark:hover:bg-surface-900/40 transition-all">
                  <td className="py-5 px-6 text-sm text-surface-500">{index + 1}</td>
                  <td className="py-5 px-4">
                    <div className="space-y-1">
                      <p className="font-extrabold text-surface-900 dark:text-white text-sm">{row.id}</p>
                      <p className="text-[10px] text-surface-400 font-black uppercase tracking-widest">{row.paymentStatus} Flow</p>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-sm font-semibold text-surface-700 dark:text-surface-200">{row.shopName}</td>
                  <td className="py-5 px-4 text-sm font-semibold text-surface-700 dark:text-surface-200">{row.customerName}</td>
                  <td className="py-5 px-4 text-right text-sm text-surface-700 dark:text-surface-200">{row.totalProductAmount}</td>
                  <td className="py-5 px-4 text-right text-sm text-surface-700 dark:text-surface-200">{row.productDiscount}</td>
                  <td className="py-5 px-4 text-right text-sm text-surface-700 dark:text-surface-200">{row.couponDiscount}</td>
                  <td className="py-5 px-4 text-right text-sm text-surface-700 dark:text-surface-200">{row.referralDiscount}</td>
                  <td className="py-5 px-4 text-right text-sm font-semibold text-surface-900 dark:text-white">{row.discountedAmount}</td>
                  <td className="py-5 px-4 text-right text-sm text-surface-700 dark:text-surface-200">{row.vatTax}</td>
                  <td className="py-5 px-4 text-right text-sm text-surface-700 dark:text-surface-200">{row.shippingCharge}</td>
                  <td className="py-5 px-4 text-sm text-surface-600 dark:text-surface-300">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-admin-primary-500" />
                      <span>{row.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <Badge variant={statusTone(row.paymentStatus)} size="sm">{row.paymentStatus}</Badge>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button className="inline-flex items-center justify-center rounded-xl border border-surface-200 dark:border-surface-700 p-2 text-surface-500 hover:text-admin-primary-600 hover:border-admin-primary-200 transition-colors" aria-label={`View ${row.id}`}>
                        <Eye size={16} />
                      </button>
                      <button className="inline-flex items-center justify-center rounded-xl border border-surface-200 dark:border-surface-700 p-2 text-surface-500 hover:text-admin-primary-600 hover:border-admin-primary-200 transition-colors" aria-label={`More actions for ${row.id}`}>
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Transactions;
