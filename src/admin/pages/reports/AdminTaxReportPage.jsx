import React, { useMemo, useState } from 'react';
import { Calculator, Download, FileSearch, RefreshCw, ReceiptText } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const dateRangeOptions = ['This Fiscal Year', 'Last Fiscal Year', 'This Quarter', 'This Month'];
const calcMethodOptions = ['Same Tax for All Income Source', 'By Income Source Slab', 'Progressive Tax Brackets'];
const taxRateOptions = [
  { label: 'Standard VAT 10%', value: 10 },
  { label: 'Reduced VAT 5%', value: 5 },
  { label: 'Service Tax 12%', value: 12 },
  { label: 'Composite Tax 8%', value: 8 },
];

const incomeSources = [
  { source: 'In-House Product Sales', income: 38250 },
  { source: 'Vendor Commission', income: 12400 },
  { source: 'Shipping Earnings', income: 6850 },
  { source: 'Platform Subscription', income: 3200 },
];

const formatCurrency = (value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const AdminTaxReportPage = () => {
  const [dateRangeType, setDateRangeType] = useState('This Fiscal Year');
  const [calcMethod, setCalcMethod] = useState('Same Tax for All Income Source');
  const [taxRateLabel, setTaxRateLabel] = useState('Standard VAT 10%');
  const [reportRows, setReportRows] = useState([]);
  const [generatedAt, setGeneratedAt] = useState('Not generated yet');

  const selectedTaxRate = useMemo(() => {
    return taxRateOptions.find((item) => item.label === taxRateLabel) || taxRateOptions[0];
  }, [taxRateLabel]);

  const totalIncome = useMemo(() => reportRows.reduce((sum, row) => sum + row.totalIncome, 0), [reportRows]);
  const totalTax = useMemo(() => reportRows.reduce((sum, row) => sum + row.taxAmount, 0), [reportRows]);

  const handleGenerate = () => {
    const rows = incomeSources.map((item, index) => {
      const multiplier = calcMethod === 'By Income Source Slab' ? (index % 2 === 0 ? 1 : 0.8) : calcMethod === 'Progressive Tax Brackets' ? 1 + (index * 0.05) : 1;
      const adjustedRate = selectedTaxRate.value * multiplier;
      const taxAmount = Number(((item.income * adjustedRate) / 100).toFixed(2));
      return {
        id: `TAX-${index + 1}`,
        source: item.source,
        totalIncome: item.income,
        taxAmount,
      };
    });

    setReportRows(rows);
    setGeneratedAt(new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()));
  };

  const handleReset = () => {
    setDateRangeType('This Fiscal Year');
    setCalcMethod('Same Tax for All Income Source');
    setTaxRateLabel('Standard VAT 10%');
    setReportRows([]);
    setGeneratedAt('Not generated yet');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">17 Sales & Reports</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">Admin Tax Report</h1>
        <p className="text-sm sm:text-base text-surface-500 max-w-2xl">Generate tax reports by date range, tax model, and rate selection with instant summary totals.</p>
      </div>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 sm:p-6 shadow-card space-y-6">
        <div>
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">Generate Tax Report</h2>
          <p className="text-sm text-surface-500 mt-1">Select report conditions and generate a tax breakdown across income sources.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Date Range Type</span>
            <select value={dateRangeType} onChange={(event) => setDateRangeType(event.target.value)} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100">
              {dateRangeOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Select How To Calculate Tax</span>
            <select value={calcMethod} onChange={(event) => setCalcMethod(event.target.value)} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100">
              {calcMethodOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Select Tax Rate</span>
            <select value={taxRateLabel} onChange={(event) => setTaxRateLabel(event.target.value)} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100">
              {taxRateOptions.map((option) => <option key={option.label}>{option.label}</option>)}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="secondary" icon={RefreshCw} onClick={handleReset}>Reset</Button>
          <Button type="button" variant="primary" icon={Calculator} onClick={handleGenerate}>Generate</Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="bg-blue-50/70 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-3xl p-5">
          <div className="flex items-center gap-3">
            <ReceiptText size={18} className="text-blue-600" />
            <div>
              <p className="text-sm text-surface-500">Total Income</p>
              <h3 className="text-2xl font-extrabold text-blue-700 dark:text-blue-300">{formatCurrency(totalIncome)}</h3>
            </div>
          </div>
          <p className="mt-2 text-xs text-surface-500">Generated: {generatedAt}</p>
        </article>

        <article className="bg-amber-50/70 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 rounded-3xl p-5">
          <div className="flex items-center gap-3">
            <FileSearch size={18} className="text-amber-600" />
            <div>
              <p className="text-sm text-surface-500">Total Tax</p>
              <h3 className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">{formatCurrency(totalTax)}</h3>
            </div>
          </div>
          <p className="mt-2 text-xs text-surface-500">Rate profile: {taxRateLabel}</p>
        </article>
      </section>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl shadow-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-surface-100 dark:border-surface-700 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Tax Report List</h2>
            <p className="text-sm text-surface-500">{reportRows.length} row{reportRows.length === 1 ? '' : 's'} generated for current filters.</p>
          </div>
          <Button variant="secondary" icon={Download}>Export</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-surface-50 dark:bg-surface-900/60 border-b border-surface-200 dark:border-surface-700">
              <tr>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">SL</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Income Source</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Total Income</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Tax Amount</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map((row, index) => (
                <tr key={row.id} className="border-b border-surface-100 dark:border-surface-800">
                  <td className="px-5 py-4 text-surface-500">{index + 1}</td>
                  <td className="px-5 py-4 font-semibold text-surface-900 dark:text-white">{row.source}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{formatCurrency(row.totalIncome)}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{formatCurrency(row.taxAmount)}</td>
                  <td className="px-5 py-4"><Badge variant="info" size="sm">Preview</Badge></td>
                </tr>
              ))}
              {reportRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="inline-flex flex-col items-center gap-2 text-surface-500 dark:text-surface-400">
                      <FileSearch size={34} className="text-surface-300" />
                      <p className="font-semibold text-surface-700 dark:text-surface-300">No tax report generated</p>
                      <p className="text-sm">Choose filters and press Generate to build a report.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminTaxReportPage;
