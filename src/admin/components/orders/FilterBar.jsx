import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import Button from '../ui/Button';

const FilterBar = ({
  onSearch,
  onStatusFilter,
  onPaymentStatusFilter,
  onDateRange,
  onReset,
  statuses = [],
  paymentStatuses = ['All', 'Paid', 'Unpaid', 'Pending'],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = (value) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    onStatusFilter(status);
  };

  const handlePaymentStatusChange = (status) => {
    setSelectedPaymentStatus(status);
    onPaymentStatusFilter(status);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedPaymentStatus('All');
    onReset();
  };

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
          <input
            type="text"
            placeholder="Search by Order ID, Customer name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-admin-primary-500 dark:focus:ring-admin-primary-400 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Quick Filters */}
        <Button
          variant="outline"
          size="md"
          icon={Filter}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          Filters
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700 animate-fade-in">
          {/* Status Filter */}
          <div>
            <label className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-2 block uppercase tracking-wide">
              Order Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary-500 dark:focus:ring-admin-primary-400 text-surface-900 dark:text-white"
            >
              <option value="all">All Status</option>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-2 block uppercase tracking-wide">
              Payment Status
            </label>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => handlePaymentStatusChange(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary-500 dark:focus:ring-admin-primary-400 text-surface-900 dark:text-white"
            >
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-2 block uppercase tracking-wide">
              From Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary-500 dark:focus:ring-admin-primary-400 text-surface-900 dark:text-white"
              onChange={(e) => onDateRange?.({ from: e.target.value })}
            />
          </div>

          {/* Date To */}
          <div>
            <label className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-2 block uppercase tracking-wide">
              To Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary-500 dark:focus:ring-admin-primary-400 text-surface-900 dark:text-white"
              onChange={(e) => onDateRange?.({ to: e.target.value })}
            />
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              onClick={handleReset}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
