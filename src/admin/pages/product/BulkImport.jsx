import React, { useState } from 'react';
import { FileUp, UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import { toast } from 'sonner';
import api from '../../../lib/api';

const BulkImport = () => {
  const [history, setHistory] = useState([
    { id: 'IMP-301', fileName: 'products-apr-01.csv', imported: 215, failed: 3, status: 'Completed' },
  ]);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a valid CSV file");
      return;
    }

    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.request('/products/bulk-import', {
        method: 'POST',
        body: formData,
        auth: true
      });

      const newRun = {
        id: `IMP-${Math.floor(400 + Math.random() * 200)}`,
        fileName: file.name,
        imported: response.imported,
        failed: response.failed,
        status: 'Completed',
      };

      setHistory((prev) => [newRun, ...prev]);
      toast.success(`Import completed! ${response.imported} products added.`);
    } catch (error) {
      console.error("Bulk import failed:", error);
      toast.error("Bulk import failed. Please check your CSV format.");
    } finally {
      setIsImporting(false);
      // Reset input
      event.target.value = '';
    }
  };

  const downloadTemplate = () => {
    const headers = ['name', 'sku', 'category', 'price', 'original_price', 'quantity', 'description', 'image_url'];
    const sampleData = ['Royal Classic T-Shirt', 'RCT-001', 'Apparel', '1299', '1999', '100', 'Premium cotton t-shirt with modern fit.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000'];
    
    const csvContent = [headers, sampleData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'royal-virtus-product-template.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.info("Template downloaded!");
  };

  const columns = [
    { key: 'id', label: 'Import ID' },
    { key: 'fileName', label: 'File Name' },
    { key: 'imported', label: 'Imported Rows' },
    { key: 'failed', label: 'Failed Rows' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
          row.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
        }`}>
          {row.status === 'Completed' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
          Bulk <span className="text-admin-primary-600">Import</span>
        </h1>
        <p className="text-sm text-surface-500 mt-1">Upload CSV files to create or update products in batch.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 shadow-card space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-surface-500">Upload File</h2>
          <label className={`border-2 border-dashed border-surface-300 dark:border-surface-700 rounded-2xl p-10 min-h-[220px] flex flex-col items-center justify-center text-center cursor-pointer hover:border-admin-primary-500 transition-colors ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
            {isImporting ? (
              <Loader2 size={40} className="text-admin-primary-600 animate-spin mb-2" />
            ) : (
              <UploadCloud size={30} className="text-admin-primary-500 mb-2" />
            )}
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
              {isImporting ? 'Importing products...' : 'Click to upload CSV file'}
            </span>
            <span className="text-xs text-surface-500 mt-1">Only .csv files, max 10MB</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} disabled={isImporting} />
          </label>
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={FileUp} type="button" onClick={downloadTemplate}>Download Template</Button>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 shadow-card space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-surface-500">Import Notes</h2>
          <ul className="text-sm text-surface-600 dark:text-surface-300 space-y-2 list-disc pl-5">
            <li>Keep SKU unique in each row.</li>
            <li>Use valid category names.</li>
            <li>Use numeric values for price and stock.</li>
            <li><strong>Images:</strong> Provide direct image URLs in 'image_url' column.</li>
            <li>UTF-8 CSV recommended.</li>
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-200 dark:border-surface-700 font-semibold text-surface-700 dark:text-surface-300">Import History</div>
        <Table columns={columns} data={history} pageSize={5} />
      </div>
    </div>
  );
};

export default BulkImport;
