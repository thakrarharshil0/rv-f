import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Download,
  FolderTree,
  Layers,
  Search,
  TrendingUp,
  SlidersHorizontal,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
} from 'lucide-react';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import api from '../../../lib/api';
import { toast } from 'sonner';
import { getCurrentDateRange } from '../../utils/dateUtils';

const buildCategoryForm = (row) => ({
  id: row?.id || '',
  name: row?.name || '',
  priority: row?.priority ?? 1,
  visibility: row?.visibility || 'Active',
  updatedBy: row?.updatedBy || 'Admin Team',
  icon: row?.icon || '📦',
  totalProducts: row?.totalProducts ?? 0,
  subCategories: row?.subCategories ?? 0,
  inHomeCategory: row?.inHomeCategory ?? false,
});

const buildSubCategoryForm = (row, defaultParent = '') => ({
  id: row?.id || '',
  name: row?.name || '',
  parentCategory: row?.parentCategory || defaultParent,
  priority: row?.priority ?? 1,
  status: row?.status || 'Active',
  totalProducts: row?.totalProducts ?? 0,
  updatedBy: row?.updatedBy || 'Admin Team',
});

const categoryOptions = []; // Will be populated from API

const Kpi = ({ title, value, icon, trend }) => {
  const Icon = icon;

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card">
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-lg text-admin-primary-600 bg-admin-primary-50 dark:bg-admin-primary-900/20">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">{trend}</span>
      </div>
      <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mt-3">{title}</p>
      <p className="text-2xl font-extrabold text-surface-900 dark:text-white mt-1">{value}</p>
    </div>
  );
};

const CategoriesModulePage = ({ mode = 'categories' }) => {
  const [query, setQuery] = useState('');
  const isCategoryMode = mode === 'categories';
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [parentFilter, setParentFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [parentCategoryList, setParentCategoryList] = useState([]);
  const [categoryForm, setCategoryForm] = useState(buildCategoryForm());
  const [subCategoryForm, setSubCategoryForm] = useState(buildSubCategoryForm(null));

  const fetchData = async () => {
    setLoading(true);
    try {
      if (isCategoryMode) {
        const res = await api.categories.list();
        setRows(res.items || []);
      } else {
        const res = await api.subCategories.list();
        setRows(res.items || []);
        
        const catRes = await api.categories.list();
        setParentCategoryList(catRes.items || []);
      }
    } catch (error) {
      toast.error(`Failed to load ${isCategoryMode ? 'categories' : 'sub-categories'}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [mode]);

  const categoryOptions = useMemo(() => {
    return parentCategoryList.map(c => c.name);
  }, [parentCategoryList]);
  const title = isCategoryMode ? 'Categories' : 'Sub Categories';

  const parentCategories = useMemo(() => {
    if (isCategoryMode) return [];
    return ['All', ...new Set(rows.map((item) => item.parentCategory))];
  }, [isCategoryMode, rows]);

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      if (isCategoryMode) {
        const payload = {
          name: categoryForm.name,
          priority: Number(categoryForm.priority),
          icon: categoryForm.icon,
          is_active: categoryForm.visibility === 'Active',
          show_on_home: categoryForm.inHomeCategory,
        };

        if (editingId) {
          await api.categories.update(editingId, payload);
          toast.success("Category updated");
        } else {
          await api.categories.create(payload);
          toast.success("Category created");
        }
      } else {
        const parentCat = parentCategoryList.find(c => c.name === subCategoryForm.parentCategory);
        const payload = {
          name: subCategoryForm.name,
          category_id: parentCat?.id,
          priority: Number(subCategoryForm.priority),
          is_active: subCategoryForm.status === 'Active',
        };

        if (editingId) {
          await api.subCategories.update(editingId, payload);
          toast.success("Sub category updated");
        } else {
          await api.subCategories.create(payload);
          toast.success("Sub category created");
        }
      }
      fetchData();
      closeForm();
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  const handleDelete = async (row) => {
    const confirmed = window.confirm(`Delete ${isCategoryMode ? 'category' : 'sub category'} "${row.name}"?`);
    if (!confirmed) return;

    try {
      if (isCategoryMode) {
        await api.categories.delete(row.id);
      } else {
        await api.subCategories.delete(row.id);
      }
      toast.success("Deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const toggleHomeCategoryStatus = async (row) => {
    try {
      await api.categories.update(row.id, { show_on_home: !row.inHomeCategory });
      toast.success("Status updated");
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setCategoryForm(buildCategoryForm());
    setSubCategoryForm(buildSubCategoryForm());
  };

  const openCreateForm = () => {
    setEditingId(null);
    setCategoryForm(buildCategoryForm());
    setSubCategoryForm(buildSubCategoryForm(null, parentCategoryList[0]?.name || ''));
    setIsFormOpen(true);
  };

  const openEditForm = (row) => {
    setEditingId(row.id);
    if (isCategoryMode) {
      setCategoryForm(buildCategoryForm(row));
    } else {
      setSubCategoryForm(buildSubCategoryForm(row));
    }
    setIsFormOpen(true);
  };

  const filteredRows = useMemo(() => {
    const q = query.toLowerCase().trim();

    return rows
      .filter((row) => {
        if (isCategoryMode) {
          if (statusFilter === 'All') return true;
          return row.visibility === statusFilter;
        }

        const statusOk = statusFilter === 'All' || row.status === statusFilter;
        const parentOk = parentFilter === 'All' || row.parentCategory === parentFilter;
        return statusOk && parentOk;
      })
      .filter((row) => {
        if (!q) return true;
        return Object.values(row).some((value) => String(value).toLowerCase().includes(q));
      });
  }, [isCategoryMode, parentFilter, query, rows, statusFilter]);

  const rowsWithSerial = useMemo(
    () => filteredRows.map((row, index) => ({ ...row, sl: index + 1 })),
    [filteredRows]
  );

  const columns = isCategoryMode
    ? [
        {
          key: 'sl',
          label: 'SL',
          render: (row) => <span>{row.sl}</span>,
        },
        {
          key: 'name',
          label: 'Category Name',
          sortable: true,
          render: (row) => (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-admin-primary-100 dark:bg-admin-primary-900/30 flex items-center justify-center text-base">
                {row.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-surface-900 dark:text-white">{row.name}</span>
                <span className="text-xs text-surface-500 dark:text-surface-400">ID {row.id}</span>
              </div>
            </div>
          ),
        },
        { key: 'priority', label: 'Priority', sortable: true },
        {
          key: 'inHomeCategory',
          label: 'Home Category Status',
          render: (row) => (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleHomeCategoryStatus(row);
              }}
              className={`relative w-24 h-8 rounded-full border transition-all duration-200 flex items-center px-1 ${
                row.inHomeCategory
                  ? 'bg-admin-primary-500/10 border-admin-primary-500 text-admin-primary-600 dark:text-admin-primary-400'
                  : 'bg-surface-100 dark:bg-surface-800 border-surface-300 dark:border-surface-700 text-surface-500'
              }`}
              aria-label={`Toggle home status for ${row.name}`}
            >
              <span
                className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                  row.inHomeCategory ? 'translate-x-16' : 'translate-x-0'
                }`}
              />
              <span className="w-full text-[11px] font-semibold text-center select-none">
                {row.inHomeCategory ? 'Enabled' : 'Disabled'}
              </span>
            </button>
          ),
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
                  openEditForm(row);
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
      ]
    : [
        {
          key: 'sl',
          label: 'SL',
          render: (row) => <span>{row.sl}</span>,
        },
        {
          key: 'name',
          label: 'Sub Category Name',
          sortable: true,
          render: (row) => (
            <div className="flex flex-col">
              <span className="font-semibold text-surface-900 dark:text-white">{row.name}</span>
              <span className="text-xs text-surface-500 dark:text-surface-400">ID {row.id}</span>
            </div>
          ),
        },
        { key: 'parentCategory', label: 'Parent Category', sortable: true },
        { key: 'priority', label: 'Priority', sortable: true },
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
                  openEditForm(row);
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

  const handleExport = () => {
    const csv = [
      columns.map((column) => column.label),
      ...filteredRows.map((row) => columns.map((column) => row[column.key] ?? '')),
    ]
      .map((line) => line.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${isCategoryMode ? 'categories' : 'sub-categories'}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
                {title} <span className="text-admin-primary-600">Management</span>
              </h1>
              <span className="px-3 py-1 bg-admin-primary-100 dark:bg-admin-primary-900/30 text-admin-primary-600 dark:text-admin-primary-400 rounded-full text-sm font-semibold">
                {filteredRows.length}
              </span>
            </div>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              {isCategoryMode ? 'Category List' : 'Sub Category List'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-sm text-sm font-medium text-surface-600 dark:text-surface-300">
              <Calendar size={16} className="text-admin-primary-500" />
              <span className="whitespace-nowrap">{getCurrentDateRange(7)}</span>
            </div>

            {!isCategoryMode && (
              <Button
                variant="outline"
                size="md"
                icon={SlidersHorizontal}
                onClick={() => setShowFilters((prev) => !prev)}
              >
                Filter
              </Button>
            )}

            <Button variant="outline" size="md" onClick={handleExport} icon={Download}>
              Export
            </Button>

            <Button variant="primary" size="md" icon={Plus} onClick={openCreateForm}>
              {isCategoryMode ? 'Add Category' : 'Add Sub Category'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Kpi
            title={isCategoryMode ? 'Total Categories' : 'Total Sub Categories'}
            value={rows.length}
            icon={isCategoryMode ? FolderTree : Layers}
            trend="+8.4%"
          />
          <Kpi
            title="Active"
            value={rows.filter((row) => (row.visibility || row.status) === 'Active').length}
            icon={TrendingUp}
            trend="+4.2%"
          />
          <Kpi
            title="Products Mapped"
            value={rows.reduce((sum, row) => sum + Number(row.totalProducts || 0), 0)}
            icon={FolderTree}
            trend="+5.6%"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 shadow-card">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
            <input
              type="text"
              placeholder={isCategoryMode ? 'Search by category' : 'Search by sub category name'}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-admin-primary-500 text-surface-900 dark:text-white"
            />
          </div>

          {showFilters && !isCategoryMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="px-3 py-2.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-admin-primary-500 text-surface-900 dark:text-white"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>

              <select
                value={parentFilter}
                onChange={(event) => setParentFilter(event.target.value)}
                className="px-3 py-2.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-admin-primary-500 text-surface-900 dark:text-white"
              >
                {parentCategories.map((parentCategory) => (
                  <option key={parentCategory} value={parentCategory}>
                    {parentCategory === 'All' ? 'All Parent Categories' : parentCategory}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card overflow-hidden">
        <Table columns={columns} data={rowsWithSerial} pageSize={8} isLoading={loading} />
      </div>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={closeForm}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">
                {editingId
                  ? `Edit ${isCategoryMode ? 'Category' : 'Sub Category'}`
                  : `Add ${isCategoryMode ? 'Category' : 'Sub Category'}`}
              </h3>
              <button
                type="button"
                onClick={closeForm}
                className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
                aria-label="Close form"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isCategoryMode ? (
                <>
                  <label className="space-y-1 sm:col-span-2">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Category Name</span>
                    <input
                      required
                      value={categoryForm.name}
                      onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Priority</span>
                    <input
                      type="number"
                      min="1"
                      value={categoryForm.priority}
                      onChange={(event) => setCategoryForm((prev) => ({ ...prev, priority: event.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Visibility</span>
                    <select
                      value={categoryForm.visibility}
                      onChange={(event) => setCategoryForm((prev) => ({ ...prev, visibility: event.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Icon</span>
                    <input
                      value={categoryForm.icon}
                      onChange={(event) => setCategoryForm((prev) => ({ ...prev, icon: event.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Updated By</span>
                    <input
                      value={categoryForm.updatedBy}
                      onChange={(event) => setCategoryForm((prev) => ({ ...prev, updatedBy: event.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Products</span>
                    <input
                      type="number"
                      min="0"
                      value={categoryForm.totalProducts}
                      onChange={(event) => setCategoryForm((prev) => ({ ...prev, totalProducts: event.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Sub Categories</span>
                    <input
                      type="number"
                      min="0"
                      value={categoryForm.subCategories}
                      onChange={(event) => setCategoryForm((prev) => ({ ...prev, subCategories: event.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                    />
                  </label>

                  <label className="flex items-center gap-2 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={categoryForm.inHomeCategory}
                      onChange={(event) =>
                        setCategoryForm((prev) => ({ ...prev, inHomeCategory: event.target.checked }))
                      }
                    />
                    <span className="text-sm text-surface-700 dark:text-surface-300">Show on Home Category section</span>
                  </label>
                </>
              ) : (
                <>
                  <label className="space-y-1 sm:col-span-2">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Sub Category Name</span>
                    <input
                      required
                      value={subCategoryForm.name}
                      onChange={(event) =>
                        setSubCategoryForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Parent Category</span>
                    <select
                      value={subCategoryForm.parentCategory}
                      onChange={(event) =>
                        setSubCategoryForm((prev) => ({ ...prev, parentCategory: event.target.value }))
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-admin-primary-500 outline-none"
                    >
                      <option value="" disabled>Select Category</option>
                      {parentCategoryList.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Priority</span>
                    <input
                      type="number"
                      min="1"
                      value={subCategoryForm.priority}
                      onChange={(event) =>
                        setSubCategoryForm((prev) => ({ ...prev, priority: event.target.value }))
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Status</span>
                    <select
                      value={subCategoryForm.status}
                      onChange={(event) =>
                        setSubCategoryForm((prev) => ({ ...prev, status: event.target.value }))
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Products</span>
                    <input
                      type="number"
                      min="0"
                      value={subCategoryForm.totalProducts}
                      onChange={(event) =>
                        setSubCategoryForm((prev) => ({ ...prev, totalProducts: event.target.value }))
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                    />
                  </label>

                  <label className="space-y-1 sm:col-span-2">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Updated By</span>
                    <input
                      value={subCategoryForm.updatedBy}
                      onChange={(event) =>
                        setSubCategoryForm((prev) => ({ ...prev, updatedBy: event.target.value }))
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                    />
                  </label>
                </>
              )}

              <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-1">
                <Button type="button" variant="secondary" onClick={closeForm}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" icon={Save}>
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesModulePage;
