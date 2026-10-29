import React, { useMemo, useState, useEffect } from 'react';
import { Download, Filter, Search, WalletCards, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { loyalty as loyaltyApi, customers as customerApi } from '../../../lib/api';
import { toast } from 'sonner';

const transactionTypes = ['All', 'Order', 'Refund', 'Adjustment', 'Bonus'];

const formatMoney = (value) => `₹${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const LoyaltyPointsPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [customerFilter, setCustomerFilter] = useState('All');
  const [customerList, setCustomerList] = useState([]);
  const [search, setSearch] = useState('');
  const [transactionsList, setTransactionsList] = useState([]);
  const [stats, setStats] = useState({ credit: 0, debit: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [transData, statsData, custData] = await Promise.all([
        loyaltyApi.transactions({ 
          search, 
          type: typeFilter, 
          customer_id: customerFilter,
          start_date: startDate,
          end_date: endDate
        }),
        loyaltyApi.stats(),
        customerApi.list()
      ]);
      setTransactionsList(Array.isArray(transData) ? transData : []);
      setStats({
        credit: statsData.total_credit || 0,
        debit: statsData.total_debit || 0,
        balance: statsData.total_balance || 0
      });
      setCustomerList(Array.isArray(custData) ? custData : []);
    } catch (error) {
      console.error('Fetch Loyalty Error:', error);
      toast.error('Failed to fetch loyalty data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, typeFilter, customerFilter, search]);

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setTypeFilter('All');
    setCustomerFilter('All');
    setSearch('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-admin-primary-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-admin-primary-600 dark:bg-admin-primary-900/20">
          20 People & Content
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-surface-900 dark:text-white">Loyalty Point Report</h1>
        <p className="max-w-2xl text-sm sm:text-base text-surface-500">Track loyalty balance flow by customer and transaction type with an export-ready ledger.</p>
      </div>

      <section className="space-y-6 rounded-3xl border border-surface-200 bg-white p-5 shadow-card dark:border-surface-700 dark:bg-surface-800 sm:p-6">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto_auto]">
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100"
            />
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100"
          >
            {transactionTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={customerFilter}
            onChange={(event) => setCustomerFilter(event.target.value)}
            className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100"
          >
            <option value="All">All Customers</option>
            {customerList.map((customer) => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>

          <Button type="button" variant="secondary" onClick={resetFilters}>Reset</Button>
          <Button type="button" variant="primary" icon={Filter} onClick={fetchData}>Filter</Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-surface-200 bg-white p-5 shadow-card dark:border-surface-700 dark:bg-surface-800">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-surface-200 bg-surface-50 p-2.5 dark:border-surface-700 dark:bg-surface-900">
              <WalletCards size={18} className="text-admin-primary-600" />
            </div>
            <div>
              <p className="text-sm text-surface-500">Balance</p>
              <h3 className="text-3xl font-extrabold text-surface-900 dark:text-white">{formatMoney(stats.balance)}</h3>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5 shadow-card dark:border-emerald-900/40 dark:bg-emerald-900/20">
          <p className="text-sm text-surface-500">Credit</p>
          <h3 className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300">{formatMoney(stats.credit)}</h3>
        </article>

        <article className="rounded-3xl border border-rose-100 bg-rose-50/60 p-5 shadow-card dark:border-rose-900/40 dark:bg-rose-900/20">
          <p className="text-sm text-surface-500">Debit</p>
          <h3 className="text-3xl font-extrabold text-rose-700 dark:text-rose-300">{formatMoney(stats.debit)}</h3>
        </article>
      </section>

      <section className="overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-card dark:border-surface-700 dark:bg-surface-800">
        <div className="flex flex-col gap-3 border-b border-surface-100 p-5 dark:border-surface-700 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Transactions</h2>
            <p className="text-sm text-surface-500">{transactionsList.length} matching entries.</p>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative w-full lg:w-[20rem]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by transaction id or customer"
                className="w-full rounded-xl border border-surface-200 bg-surface-50 py-2.5 pl-10 pr-4 text-sm text-surface-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100"
              />
            </div>
            <Button variant="secondary" icon={Download}>Export</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="border-b border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-900/60">
              <tr>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">SL</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Transaction ID</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Created At</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Customer Name</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Credit ($)</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Debit ($)</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Balance ($)</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Transaction Type</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 text-admin-primary-600 animate-spin" />
                      <p className="text-sm font-bold text-surface-500 uppercase tracking-widest">Loading Transactions...</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {transactionsList.map((row, index) => (
                    <tr key={row.id} className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-900/40 transition-colors">
                      <td className="px-5 py-4 text-surface-500">{index + 1}</td>
                      <td className="px-5 py-4 font-bold text-xs text-surface-700 dark:text-surface-200 uppercase tracking-tighter truncate max-w-[120px]">{row.id}</td>
                      <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.createdAt}</td>
                      <td className="px-5 py-4 font-bold text-surface-900 dark:text-white uppercase tracking-wider">{row.customer}</td>
                      <td className="px-5 py-4 text-emerald-700 dark:text-emerald-300 font-bold">{formatMoney(row.credit)}</td>
                      <td className="px-5 py-4 text-rose-700 dark:text-rose-300 font-bold">{formatMoney(row.debit)}</td>
                      <td className="px-5 py-4 text-surface-900 dark:text-white font-black">{formatMoney(row.balance)}</td>
                      <td className="px-5 py-4">
                        <Badge 
                          variant={row.type === 'Bonus' ? 'success' : row.type === 'Refund' ? 'warning' : 'info'} 
                          size="sm"
                        >
                          {row.type}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {transactionsList.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-16 text-center text-surface-500 dark:text-surface-400 font-bold uppercase tracking-widest text-xs">No loyalty transactions match the current filters.</td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default LoyaltyPointsPage;
