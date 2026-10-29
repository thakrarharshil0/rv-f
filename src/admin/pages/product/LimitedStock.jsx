import React, { useMemo, useState, useEffect } from 'react';
import { AlertTriangle, Download, PackageSearch, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import api from '../../../lib/api';

const LimitedStock = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLimitedStock = async () => {
      try {
        const response = await api.products.list({ stock_limit: 20, perPage: 100 });
        setProducts(response.items || []);
      } catch (error) {
        console.error("Failed to fetch limited stock:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLimitedStock();
  }, []);

  const lowStockRows = useMemo(
    () => products.map((item, index) => ({ ...item, sl: index + 1 })),
    [products]
  );

  const columns = [
    { key: 'sl', label: 'SL', render: (row) => <span>{row.sl}</span> },
    {
      key: 'name',
      label: 'Product',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} alt="" className="w-10 h-10 object-cover rounded-lg border border-surface-200 dark:border-surface-700" />
          <div className="flex flex-col">
            <span className="font-semibold text-surface-900 dark:text-white">{row.name}</span>
            <span className="text-xs text-surface-500">{row.sku}</span>
          </div>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Current Stock', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={row.quantity === 0 ? 'danger' : 'warning'}>{row.quantity === 0 ? 'Out of Stock' : 'Low Stock'}</Badge>,
    },
    {
      key: 'restock',
      label: 'Suggestion',
      render: (row) => <span className="text-sm font-semibold text-admin-primary-600">Order {Math.max(20, 60 - row.quantity)} units</span>,
    },
  ];

  const handleExport = () => {
    const csv = [
      ['SKU', 'Product', 'Category', 'Stock'],
      ...lowStockRows.map((item) => [item.sku, item.name, item.category, item.quantity]),
    ]
      .map((line) => line.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'limited-stock-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-admin-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
            Limited <span className="text-admin-primary-600">Stock</span>
          </h1>
          <p className="text-sm text-surface-500 mt-1">Track low inventory and create smart restock plans.</p>
        </div>
        <Button variant="outline" icon={Download} onClick={handleExport} disabled={lowStockRows.length === 0}>Export Report</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <p className="text-xs uppercase font-bold text-surface-500">Low Stock Items</p>
          <p className="text-3xl font-extrabold mt-1 text-amber-600">{lowStockRows.filter((item) => item.quantity > 0).length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <p className="text-xs uppercase font-bold text-surface-500">Out Of Stock</p>
          <p className="text-3xl font-extrabold mt-1 text-red-600">{lowStockRows.filter((item) => item.quantity === 0).length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <p className="text-xs uppercase font-bold text-surface-500">Total Alerted</p>
          <p className="text-3xl font-extrabold mt-1 text-admin-primary-600">{lowStockRows.length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2 text-surface-700 dark:text-surface-300 font-semibold">
          <PackageSearch size={16} />
          Inventory Alerts
        </div>
        <Table columns={columns} data={lowStockRows} pageSize={8} emptyState={<p className="text-surface-500 p-10 text-center">No low stock alerts. All products are well stocked!</p>} />
      </div>

      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-2">
        <AlertTriangle size={16} className="text-amber-600 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-300">Critical products should be restocked before daily order cut-off to avoid order cancellations.</p>
      </div>
    </div>
  );
};

export default LimitedStock;
