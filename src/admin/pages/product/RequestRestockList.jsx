import React, { useMemo, useState, useEffect } from 'react';
import { CheckCircle2, Clock3, XCircle, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import api from '../../../lib/api';
import { toast } from 'sonner';

const RequestRestockList = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOutOfStock = async () => {
      try {
        // Logic: Fetching items with stock_limit 0 means only Out of Stock items
        const response = await api.products.list({ stock_limit: 0, perPage: 100 });
        const items = response.items || [];
        
        // Mapping products to restock request format
        const mappedRequests = items.map(p => ({
          id: p.id,
          productName: p.name,
          sku: p.sku,
          requestedQty: 50, // Default suggestion
          currentStock: p.quantity,
          supplier: 'Default Supplier',
          status: 'Pending',
          image: p.image
        }));
        
        setRequests(mappedRequests);
      } catch (error) {
        console.error("Failed to fetch restock requests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOutOfStock();
  }, []);

  const rows = useMemo(() => requests.map((item, index) => ({ ...item, sl: index + 1 })), [requests]);

  const updateStatus = (id, status) => {
    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    if (status === 'Approved') {
      toast.success("Restock request approved and sent to procurement.");
    } else {
      toast.info("Restock request rejected.");
    }
  };

  const columns = [
    { key: 'sl', label: 'SL', render: (row) => <span>{row.sl}</span> },
    {
      key: 'productName',
      label: 'Product',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} alt="" className="w-10 h-10 object-cover rounded-lg border border-surface-200 dark:border-surface-700" />
          <div className="flex flex-col">
            <span className="font-semibold text-surface-900 dark:text-white">{row.productName}</span>
            <span className="text-xs text-surface-500">{row.sku}</span>
          </div>
        </div>
      ),
    },
    { key: 'requestedQty', label: 'Requested Qty' },
    { key: 'currentStock', label: 'Current Stock' },
    { key: 'supplier', label: 'Supplier' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
          row.status === 'Approved'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            : row.status === 'Rejected'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
        }`}>
          {row.status === 'Approved' ? <CheckCircle2 size={12} /> : row.status === 'Rejected' ? <XCircle size={12} /> : <Clock3 size={12} />}
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      sortable: false,
      render: (row) => (
        <div className="flex gap-2" onClick={(event) => event.stopPropagation()}>
          <Button size="sm" variant="success" disabled={row.status !== 'Pending'} onClick={() => updateStatus(row.id, 'Approved')}>
            Approve
          </Button>
          <Button size="sm" variant="danger" disabled={row.status !== 'Pending'} onClick={() => updateStatus(row.id, 'Rejected')}>
            Reject
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-admin-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
          Request <span className="text-admin-primary-600">Restock List</span>
        </h1>
        <p className="text-sm text-surface-500 mt-1">Review and approve procurement requests generated from out-of-stock items.</p>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card overflow-hidden">
        <Table columns={columns} data={rows} pageSize={8} emptyState={<p className="text-surface-500 p-10 text-center">Great! No products are currently out of stock.</p>} />
      </div>
    </div>
  );
};

export default RequestRestockList;
