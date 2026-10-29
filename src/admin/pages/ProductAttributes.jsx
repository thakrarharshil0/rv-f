import React, { useMemo, useState } from 'react';
import { Calendar, Download, Plus, Search, SlidersHorizontal, Pencil, Trash2, X, Save } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import api from '../../lib/api';
import { toast } from 'sonner';
import { getCurrentDateRange } from '../utils/dateUtils';

const initialAttributes = []; // Will be populated from API

const ProductAttributes = () => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    inputType: 'Dropdown',
    values: 0,
    usage: 0,
    status: 'Active',
    updatedBy: 'Admin Team',
  });

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const res = await api.productAttributes.list();
      setAttributes(res.items || []);
    } catch (error) {
      toast.error("Failed to load attributes");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAttributes();
  }, []);

  const filteredAttributes = useMemo(() => {
    const q = query.toLowerCase().trim();

    return attributes
      .filter((item) => {
        if (statusFilter === 'All') return true;
        return item.status === statusFilter;
      })
      .filter((item) => {
        if (!q) return true;
        return Object.values(item).some((value) => String(value).toLowerCase().includes(q));
      });
  }, [attributes, query, statusFilter]);

  const rows = useMemo(
    () => filteredAttributes.map((item, index) => ({ ...item, sl: index + 1 })),
    [filteredAttributes]
  );

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      id: '',
      name: '',
      inputType: 'Dropdown',
      values: 1,
      usage: 0,
      status: 'Active',
      updatedBy: 'Admin Team',
    });
    setIsFormOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setFormData({ ...row });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const payload = {
      name: formData.name,
      input_type: formData.inputType,
      status: formData.status,
      values: Number(formData.values),
      usage: Number(formData.usage),
    };

    try {
      if (editingId) {
        await api.productAttributes.update(editingId, payload);
        toast.success("Attribute updated");
      } else {
        await api.productAttributes.create(payload);
        toast.success("Attribute created");
      }
      fetchAttributes();
      closeForm();
    } catch (error) {
      toast.error("Failed to save attribute");
    }
  };

  const handleDelete = async (row) => {
    const ok = window.confirm(`Delete product attribute "${row.name}"?`);
    if (!ok) return;
    try {
      await api.productAttributes.delete(row.id);
      toast.success("Deleted successfully");
      fetchAttributes();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleExport = () => {
    const csv = [
      ['ID', 'Name', 'Input Type', 'Values', 'Usage', 'Status', 'Updated By'],
      ...filteredAttributes.map((row) => [
        row.id,
        row.name,
        row.inputType,
        row.values,
        row.usage,
        row.status,
        row.updatedBy,
      ]),
    ]
      .map((line) => line.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `product-attributes-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'sl', label: 'SL', render: (row) => <span>{row.sl}</span> },
    {
      key: 'name',
      label: 'Attribute Name',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-surface-900 dark:text-white">{row.name}</span>
          <span className="text-xs text-surface-500 dark:text-surface-400">{row.id}</span>
        </div>
      ),
    },
    { key: 'inputType', label: 'Input Type', sortable: true },
    { key: 'values', label: 'Values', sortable: true },
    { key: 'usage', label: 'Products Using', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={row.status === 'Active' ? 'success' : 'warning'}>{row.status}</Badge>,
    },
    {
      key: 'actions',
      label: 'Action',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            title="Edit"
            onClick={(event) => {
              event.stopPropagation();
              openEdit(row);
            }}
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete"
            onClick={(event) => {
              event.stopPropagation();
              handleDelete(row);
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
                Product <span className="text-admin-primary-600">Attributes</span>
              </h1>
              <span className="px-3 py-1 bg-admin-primary-100 dark:bg-admin-primary-900/30 text-admin-primary-600 dark:text-admin-primary-400 rounded-full text-sm font-semibold">
                {rows.length}
              </span>
            </div>
            <p className="text-sm text-surface-500 dark:text-surface-400">Manage reusable attribute sets for product variants and filters.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-sm text-sm font-medium text-surface-600 dark:text-surface-300">
              <Calendar size={16} className="text-admin-primary-500" />
              <span className="whitespace-nowrap">{getCurrentDateRange(7)}</span>
            </div>
            <Button variant="outline" size="md" onClick={handleExport} icon={Download}>Export</Button>
            <Button variant="primary" size="md" onClick={openCreate} icon={Plus}>Add Attribute</Button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 shadow-card">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by attribute name or id"
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-admin-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="px-3 py-2.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-admin-primary-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card overflow-hidden">
        <Table columns={columns} data={rows} pageSize={8} isLoading={loading} />
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeForm}>
          <div className="w-full max-w-xl bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">{editingId ? 'Edit Attribute' : 'Add Attribute'}</h3>
              <button type="button" onClick={closeForm} className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Attribute Name</span>
                <input
                  required
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-admin-primary-500"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Input Type</span>
                <select
                  value={formData.inputType}
                  onChange={(event) => setFormData((prev) => ({ ...prev, inputType: event.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-admin-primary-500"
                >
                  <option value="Dropdown">Dropdown</option>
                  <option value="Swatch">Swatch</option>
                  <option value="Radio">Radio</option>
                  <option value="Text">Text</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Status</span>
                <select
                  value={formData.status}
                  onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-admin-primary-500"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">No. of Values</span>
                <input
                  type="number"
                  min="1"
                  value={formData.values}
                  onChange={(event) => setFormData((prev) => ({ ...prev, values: event.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-admin-primary-500"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Products Using</span>
                <input
                  type="number"
                  min="0"
                  value={formData.usage}
                  onChange={(event) => setFormData((prev) => ({ ...prev, usage: event.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-admin-primary-500"
                />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Updated By</span>
                <input
                  value={formData.updatedBy}
                  onChange={(event) => setFormData((prev) => ({ ...prev, updatedBy: event.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-admin-primary-500"
                />
              </label>

              <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                <Button type="button" variant="secondary" onClick={closeForm}>Cancel</Button>
                <Button type="submit" variant="primary" icon={Save}>{editingId ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAttributes;
