import React, { useMemo, useRef, useState, useEffect } from 'react';
import { coupons as couponApi, flashDeals as flashDealsApi } from '../../../lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Filter,
  LayoutGrid,
  Megaphone,
  Pencil,
  Plus,
  Package,
  Search,
  Sparkles,
  TrendingUp,
  Trash2,
  X,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import { getOffersDealsPreset, offersDealsStatusVariant } from './offersDealsData';

const emptyForm = {
  id: '',
  name: '',
  scope: '',
  status: 'Draft',
  window: '',
  owner: 'Campaign Ops',
  updated: '',
  impact: '20% lift',
  note: '',
};

const emptyCouponForm = {
  couponType: 'Discount on Purchase',
  couponTitle: '',
  couponCode: '',
  couponBearer: 'Admin',
  vendor: 'All Vendors',
  customer: 'All Customers',
  limitPerUser: '10',
  discountType: 'Amount',
  discountAmount: '500',
  minimumPurchase: '1000',
  startDate: '',
  endDate: '',
};

const emptyFlashForm = {
  title: '',
  startDate: '',
  endDate: '',
  status: 'Active',
  activeProducts: '0',
  publish: true,
};

const randomCouponCode = () => Math.random().toString(36).slice(2, 10).toUpperCase();

const OffersDealsModulePage = ({ moduleKey }) => {
  const preset = useMemo(() => getOffersDealsPreset(moduleKey), [moduleKey]);
  const [rows, setRows] = useState(preset.rows);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRow, setSelectedRow] = useState(rows[0] || null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const isCouponPage = moduleKey === 'coupon';
  const isFlashDealsPage = moduleKey === 'flash-deals';
  const [loading, setLoading] = useState(false);
  const [couponForm, setCouponForm] = useState(() => ({ ...emptyCouponForm, couponCode: randomCouponCode() }));
  const [couponRows, setCouponRows] = useState([]);

  const fetchCoupons = async () => {
    if (!isCouponPage) return;
    setLoading(true);
    try {
      const data = await couponApi.list();
      setCouponRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch Coupons Error:', error);
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [moduleKey]);

  const [couponSearch, setCouponSearch] = useState('');
  const [editingCouponId, setEditingCouponId] = useState(null);
  const couponSetupRef = useRef(null);
  const couponTitleInputRef = useRef(null);
  const [flashRows, setFlashRows] = useState([]);

  const fetchFlashDeals = async () => {
    if (!isFlashDealsPage) return;
    setLoading(true);
    try {
      const data = await flashDealsApi.list();
      setFlashRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch Flash Deals Error:', error);
      toast.error('Failed to fetch flash deals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isCouponPage) fetchCoupons();
    if (isFlashDealsPage) fetchFlashDeals();
  }, [moduleKey]);

  const [flashSearch, setFlashSearch] = useState('');
  const [flashForm, setFlashForm] = useState(emptyFlashForm);
  const [editingFlashId, setEditingFlashId] = useState(null);
  const [isFlashFormOpen, setIsFlashFormOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [productAddForm, setProductAddForm] = useState({ productId: '', discountAmount: '0', discountType: 'fixed' });
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await api.products.list();
      setAllProducts(data.items || []);
    } catch (error) {
      console.error('Fetch products error:', error);
    }
  };

  useEffect(() => {
    if (isFlashDealsPage) fetchProducts();
  }, [isFlashDealsPage]);

  const actionLabel = preset.title;
  const makeLabel = `Make ${actionLabel}`;
  const newLabel = `New ${actionLabel}`;

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesQuery =
        !query ||
        row.name.toLowerCase().includes(query) ||
        row.scope.toLowerCase().includes(query) ||
        row.owner.toLowerCase().includes(query) ||
        row.note.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All' || row.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [rows, searchQuery, statusFilter]);

  const filteredCouponRows = useMemo(() => {
    const q = couponSearch.trim().toLowerCase();

    return couponRows.filter((row) => {
      if (!q) return true;
      return (
        row.coupon.toLowerCase().includes(q) ||
        row.couponType.toLowerCase().includes(q) ||
        row.code.toLowerCase().includes(q)
      );
    });
  }, [couponRows, couponSearch]);

  const filteredFlashRows = useMemo(() => {
    const q = flashSearch.trim().toLowerCase();

    return flashRows.filter((row) => {
      if (!q) return true;
      return row.title.toLowerCase().includes(q);
    });
  }, [flashRows, flashSearch]);

  const stats = useMemo(() => {
    const targetRows = isCouponPage ? couponRows : isFlashDealsPage ? flashRows : rows;
    return {
      total: targetRows.length,
      active: targetRows.filter((row) => isCouponPage ? row.status : row.status === 'Active').length,
      scheduled: targetRows.filter((row) => row.status === 'Scheduled').length,
      paused: targetRows.filter((row) => row.status === 'Paused').length,
    };
  }, [rows, couponRows, flashRows, isCouponPage, isFlashDealsPage]);

  const statusBadge = (status) => offersDealsStatusVariant[status] || 'primary';

  const setRowStatus = (name, nextStatus) => {
    setRows((previousRows) => previousRows.map((row) => (row.name === name ? { ...row, status: nextStatus } : row)));
  };

  const onCouponForm = (key, value) => setCouponForm((previous) => ({ ...previous, [key]: value }));

  const resetCouponForm = () => {
    setCouponForm({ ...emptyCouponForm, couponCode: randomCouponCode() });
    setEditingCouponId(null);
  };

  const generateCouponCode = () => onCouponForm('couponCode', randomCouponCode());

  const submitCoupon = async (event) => {
    event.preventDefault();
    try {
      if (editingCouponId) {
        await couponApi.update(editingCouponId, couponForm);
        toast.success('Coupon updated successfully');
      } else {
        await couponApi.create(couponForm);
        toast.success('Coupon created successfully');
      }
      resetCouponForm();
      fetchCoupons();
    } catch (error) {
      toast.error(error.message || 'Failed to save coupon');
    }
  };

  const editCoupon = (row) => {
    setEditingCouponId(row.id);
    setCouponForm({
      couponType: row.couponType,
      couponTitle: row.coupon,
      couponCode: row.code,
      couponBearer: row.discountBearer,
      vendor: 'All Vendors',
      customer: 'All Customers',
      limitPerUser: String(row.limit),
      discountType: row.discountType,
      discountAmount: String(row.discountAmount),
      minimumPurchase: String(row.minimumPurchase),
      startDate: row.startDate || '',
      endDate: row.endDate || '',
    });

    requestAnimationFrame(() => {
      couponSetupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        couponTitleInputRef.current?.focus();
      }, 300);
    });
  };

  const deleteCoupon = async (row) => {
    const ok = window.confirm(`Delete coupon "${row.coupon}"?`);
    if (!ok) return;
    try {
      await couponApi.delete(row.id);
      toast.success('Coupon deleted');
      fetchCoupons();
      if (editingCouponId === row.id) {
        resetCouponForm();
      }
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  const toggleCouponStatus = async (row) => {
    try {
      await couponApi.toggleStatus(row.id);
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openCreateFlashDeal = () => {
    setEditingFlashId(null);
    setFlashForm({
      ...emptyFlashForm,
      title: `Flash Deal ${flashRows.length + 1}`,
      startDate: '2026-04-15',
      endDate: '2026-04-30',
      status: 'Active',
      activeProducts: '0',
      publish: false,
    });
    setIsFlashFormOpen(true);
  };

  const openEditFlashDeal = (row) => {
    setEditingFlashId(row.id);
    setFlashForm({
      title: row.title,
      startDate: row.startDate,
      endDate: row.endDate,
      status: row.status,
      activeProducts: String(row.activeProducts),
      publish: row.publish,
    });
    setIsFlashFormOpen(true);
  };

  const closeFlashForm = () => {
    setIsFlashFormOpen(false);
    setEditingFlashId(null);
    setFlashForm(emptyFlashForm);
  };

  const onFlashForm = (key, value) => setFlashForm((previous) => ({ ...previous, [key]: value }));

  const saveFlashDeal = async (event) => {
    event.preventDefault();
    try {
      if (editingFlashId) {
        await flashDealsApi.update(editingFlashId, flashForm);
        toast.success('Flash deal updated');
      } else {
        await flashDealsApi.create(flashForm);
        toast.success('Flash deal created');
      }
      closeFlashForm();
      fetchFlashDeals();
    } catch (error) {
      toast.error('Failed to save flash deal');
    }
  };

  const toggleFlashPublish = async (row) => {
    try {
      await flashDealsApi.togglePublish(row.id);
      fetchFlashDeals();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteFlashDeal = async (id) => {
    if (!confirm('Are you sure you want to delete this flash deal?')) return;
    try {
      await flashDealsApi.delete(id);
      toast.success('Flash deal removed');
      fetchFlashDeals();
    } catch (error) {
      toast.error('Failed to delete flash deal');
    }
  };

  const addFlashProduct = (row) => {
    setSelectedDealId(row.id);
    setIsProductModalOpen(true);
  };

  const handleProductAdd = async (event) => {
    event.preventDefault();
    if (!productAddForm.productId) {
      toast.error('Please select a product');
      return;
    }

    setIsAddingProduct(true);
    try {
      await flashDealsApi.products.add(selectedDealId, {
        product_id: productAddForm.productId,
        discount_amount: productAddForm.discountAmount,
        discount_type: productAddForm.discountType,
      });
      toast.success('Product added to flash deal');
      setIsProductModalOpen(false);
      setProductAddForm({ productId: '', discountAmount: '0', discountType: 'fixed' });
      fetchFlashDeals();
    } catch (error) {
      toast.error('Failed to add product');
    } finally {
      setIsAddingProduct(false);
    }
  };

  const applyProductPrioritySetup = () => {
    setFlashRows((previousRows) => [...previousRows].sort((a, b) => b.activeProducts - a.activeProducts));
  };

  const openCreateOffer = (mode = 'make') => {
    const count = rows.length + 1;
    const baseName = mode === 'new' ? `New ${actionLabel} ${count}` : `${actionLabel} ${count}`;

    setEditingId(null);
    setForm({
      ...emptyForm,
      id: `${moduleKey.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      name: baseName,
      scope: `${actionLabel} campaign`,
      window: 'Apr 10 - Apr 18, 2026',
      updated: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      note: mode === 'new' ? `Fresh ${actionLabel.toLowerCase()} launch` : `Build ${actionLabel.toLowerCase()} campaign`,
    });
    setIsFormOpen(true);
  };

  const openEditOffer = (row) => {
    setEditingId(row.id);
    setForm({ ...row });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const onForm = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const saveOffer = (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      id: form.id || `${moduleKey.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      updated:
        form.updated ||
        new Date().toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    };

    setRows((previousRows) => {
      if (editingId) {
        return previousRows.map((row) => (row.id === editingId ? payload : row));
      }
      return [payload, ...previousRows];
    });

    setSelectedRow(payload);
    closeForm();
  };

  const deleteOffer = (row) => {
    const ok = window.confirm(`Delete "${row.name}"?`);
    if (!ok) return;

    setRows((previousRows) => previousRows.filter((item) => item.id !== row.id));
    setSelectedRow((current) => (current?.id === row.id ? null : current));
    setIsPreviewOpen(false);
  };

  const exportCsv = () => {
    const csv = [
      ['Name', 'Scope', 'Status', 'Window', 'Owner', 'Updated', 'Impact', 'Note'],
      ...filteredRows.map((row) => [row.name, row.scope, row.status, row.window, row.owner, row.updated, row.impact, row.note]),
    ]
      .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${moduleKey}-${new Date().toISOString().split('T')[0]}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: 'name',
      label: 'Offer',
      sortable: true,
      render: (row) => (
        <div className="min-w-[220px]">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-surface-900 dark:text-white">{row.name}</p>
            <Badge variant={statusBadge(row.status)} size="sm">{row.status}</Badge>
          </div>
          <p className="text-xs text-surface-500 mt-1">{row.note}</p>
        </div>
      ),
    },
    {
      key: 'scope',
      label: 'Scope / Rule',
      render: (row) => (
        <div className="min-w-[180px]">
          <p className="font-medium text-surface-700 dark:text-surface-200">{row.scope}</p>
          <p className="text-xs text-surface-500">Owner: {row.owner}</p>
        </div>
      ),
    },
    {
      key: 'window',
      label: 'Window',
      render: (row) => (
        <div className="min-w-[150px] text-xs">
          <p className="font-medium text-surface-700 dark:text-surface-200">{row.window}</p>
          <p className="text-surface-500">Updated {row.updated}</p>
        </div>
      ),
    },
    {
      key: 'impact',
      label: 'Impact',
      render: (row) => (
        <div className="min-w-[130px]">
          <p className="font-semibold text-surface-900 dark:text-white">{row.impact}</p>
          <p className="text-xs text-surface-500">Execution health</p>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex flex-wrap items-center gap-2 min-w-[220px]" onClick={(event) => event.stopPropagation()}>
          <Button size="sm" variant="ghost" icon={Eye} onClick={() => { setSelectedRow(row); setIsPreviewOpen(true); }}>Preview</Button>
          <Button size="sm" variant="secondary" icon={Pencil} onClick={() => openEditOffer(row)}>Edit</Button>
          {row.status === 'Active' ? (
            <Button size="sm" variant="secondary" icon={Clock3} onClick={() => setRowStatus(row.name, 'Paused')}>Pause</Button>
          ) : (
            <Button size="sm" variant="success" icon={CheckCircle2} onClick={() => setRowStatus(row.name, 'Active')}>Run</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <section className="rounded-[2rem] border border-surface-200 dark:border-surface-700 bg-gradient-to-br from-surface-900 via-surface-800 to-admin-primary-700 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(140,167,255,0.16),_transparent_24%)]" />
        <div className="relative p-6 sm:p-8 lg:p-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <Link to="/modules/offers-and-deals" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em] text-white/70 hover:text-white transition-colors">
              <ArrowLeft size={14} />
              Offers and Deals
            </Link>
            <div className="space-y-3">
              <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] ${preset.accent === 'warning' ? 'bg-amber-400/15 text-amber-100' : preset.accent === 'danger' ? 'bg-red-400/15 text-red-100' : preset.accent === 'success' ? 'bg-emerald-400/15 text-emerald-100' : 'bg-white/10 text-white/80'}`}>
                <Sparkles size={14} />
                Dedicated module page
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">{preset.title}</h1>
              <p className="text-sm sm:text-base text-white/75 max-w-2xl">{preset.subtitle}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85">
                <Calendar size={15} className="text-admin-primary-300" />
                {isCouponPage ? 'Active Promotions' : isFlashDealsPage ? 'Burst Campaigns' : 'Apr 07 - Apr 30, 2026'}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85">
                <Megaphone size={15} className="text-admin-primary-300" />
                {stats.active} live
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85">
                <TrendingUp size={15} className="text-admin-primary-300" />
                {isCouponPage ? couponRows.length : stats.scheduled} total
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {(() => {
                const dynamicStats = isCouponPage ? [
                  { label: 'Live Codes', value: couponRows.filter(r => r.status).length, tone: 'success' },
                  { label: 'Redemptions', value: couponRows.reduce((sum, r) => sum + (r.totalUsed || 0), 0), tone: 'primary' },
                  { label: 'Saved Revenue', value: '₹' + couponRows.reduce((sum, r) => sum + (r.totalUsed * (r.discountAmount || 0)), 0).toLocaleString(), tone: 'warning' },
                  { label: 'Expired', value: couponRows.filter(r => !r.status).length, tone: 'danger' },
                ] : isFlashDealsPage ? [
                  { label: 'Live Bursts', value: flashRows.filter(r => r.publish && r.status === 'Active').length, tone: 'warning' },
                  { label: 'Peak CTR', value: '0.0%', tone: 'success' },
                  { label: 'Units Locked', value: flashRows.reduce((sum, r) => sum + (r.activeProducts || 0), 0), tone: 'primary' },
                  { label: 'Ending Soon', value: flashRows.filter(r => {
                    const end = new Date(r.endDate);
                    const now = new Date();
                    const diff = end - now;
                    return diff > 0 && diff < (24 * 60 * 60 * 1000); // Less than 24h
                  }).length, tone: 'danger' },
                ] : preset.stats;

                return dynamicStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm shadow-[0_12px_30px_rgba(15,23,42,0.18)]">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">{stat.label}</p>
                    <p className="mt-2 text-2xl font-black text-white">{stat.value}</p>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-md space-y-4 shadow-[0_20px_50px_rgba(15,23,42,0.28)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/55 font-bold">Campaign focus</p>
                <p className="mt-1 text-lg font-semibold">Execution snapshot</p>
              </div>
              <div className="rounded-full bg-white/10 p-3">
                <LayoutGrid size={18} className="text-admin-primary-300" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {preset.chips.map((chip) => (
                <span key={chip} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">{chip}</span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                className="bg-white text-surface-900 hover:bg-white/90"
                icon={Package}
                onClick={() => (isFlashDealsPage ? openCreateFlashDeal() : openCreateOffer('make'))}
              >
                {isFlashDealsPage ? 'Create Flash Deals' : makeLabel}
              </Button>
              <Button
                variant="secondary"
                className="bg-white text-surface-900 hover:bg-white/90"
                icon={Plus}
                onClick={() => (isFlashDealsPage ? openCreateFlashDeal() : openCreateOffer('new'))}
              >
                {isFlashDealsPage ? 'New Flash Deals' : newLabel}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" icon={Download} onClick={exportCsv}>Export CSV</Button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-surface-900/30 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Checklist</p>
              <div className="mt-3 space-y-2 text-sm text-white/75">
                {preset.checklist.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 text-emerald-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isCouponPage ? (
        <>
          <section ref={couponSetupRef} className="rounded-[1.75rem] bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-surface-500">Coupon setup</p>
                <h2 className="mt-1 text-xl font-extrabold text-surface-900 dark:text-white">Create and configure coupon</h2>
              </div>
              <Badge variant="primary">{couponRows.length} coupons</Badge>
            </div>

            <form onSubmit={submitCoupon} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Coupon type</span>
                <select value={couponForm.couponType} onChange={(event) => onCouponForm('couponType', event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900">
                  <option>Discount on Purchase</option>
                  <option>Free Delivery</option>
                  <option>First Order</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Coupon title</span>
                <input ref={couponTitleInputRef} value={couponForm.couponTitle} onChange={(event) => onCouponForm('couponTitle', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Coupon code</span>
                <div className="flex gap-2">
                  <input value={couponForm.couponCode} onChange={(event) => onCouponForm('couponCode', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900" />
                  <Button type="button" variant="outline" onClick={generateCouponCode}>Generate</Button>
                </div>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Coupon bearer</span>
                <select value={couponForm.couponBearer} onChange={(event) => onCouponForm('couponBearer', event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900">
                  <option>Admin</option>
                  <option>Seller</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Vendor</span>
                <select value={couponForm.vendor} onChange={(event) => onCouponForm('vendor', event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900">
                  <option>All Vendors</option>
                  <option>Vendor A</option>
                  <option>Vendor B</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Customer</span>
                <select value={couponForm.customer} onChange={(event) => onCouponForm('customer', event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900">
                  <option>All Customers</option>
                  <option>New Customers</option>
                  <option>Returning Customers</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Limit per same user</span>
                <input value={couponForm.limitPerUser} onChange={(event) => onCouponForm('limitPerUser', event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Discount type</span>
                <select value={couponForm.discountType} onChange={(event) => onCouponForm('discountType', event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900">
                  <option>Amount</option>
                  <option>Percentage</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Discount amount</span>
                <input value={couponForm.discountAmount} onChange={(event) => onCouponForm('discountAmount', event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Minimum purchase</span>
                <input value={couponForm.minimumPurchase} onChange={(event) => onCouponForm('minimumPurchase', event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Start date</span>
                <input type="date" value={couponForm.startDate} onChange={(event) => onCouponForm('startDate', event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Expire date</span>
                <input type="date" value={couponForm.endDate} onChange={(event) => onCouponForm('endDate', event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900" />
              </label>

              <div className="md:col-span-3 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={resetCouponForm}>Reset</Button>
                <Button type="submit" variant="primary">{editingCouponId ? 'Update Coupon' : 'Submit'}</Button>
              </div>
            </form>
          </section>

          <section className="rounded-[1.75rem] bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-surface-500">Coupon list</p>
                <h2 className="mt-1 text-xl font-extrabold text-surface-900 dark:text-white">Manage created coupons</h2>
              </div>
              <div className="flex items-center gap-4">
                {loading && <Loader2 className="w-5 h-5 text-admin-primary-600 animate-spin" />}
                <div className="relative w-full sm:w-72">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input value={couponSearch} onChange={(event) => setCouponSearch(event.target.value)} placeholder="Search by title or code" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900" />
                </div>
              </div>
            </div>

            <div className="space-y-3 relative min-h-[100px]">
              {loading && couponRows.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-surface-800/50 rounded-xl z-10">
                  <Loader2 className="w-8 h-8 text-admin-primary-600 animate-spin" />
                </div>
              )}
              {filteredCouponRows.length === 0 && !loading && (
                <div className="text-center py-10 text-surface-500">No coupons found</div>
              )}
              {filteredCouponRows.map((row) => (
                <div key={row.id} className="rounded-xl border border-surface-200 dark:border-surface-700 p-4 bg-surface-50 dark:bg-surface-900/40">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-surface-900 dark:text-white">{row.coupon}</p>
                      <p className="text-xs text-surface-500">Code: {row.code} · {row.couponType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCouponStatus(row)}
                        className={`w-10 h-6 rounded-full p-0.5 transition-colors ${row.status ? 'bg-admin-primary-600' : 'bg-surface-300 dark:bg-surface-700'}`}
                      >
                        <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${row.status ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                      <Button size="sm" variant="ghost" onClick={() => editCoupon(row)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => deleteCoupon(row)}>Delete</Button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 p-2">
                      <p className="text-surface-500 uppercase tracking-wider">Duration</p>
                      <p className="mt-1 text-surface-700 dark:text-surface-200">{row.duration}</p>
                    </div>
                    <div className="rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 p-2">
                      <p className="text-surface-500 uppercase tracking-wider">Limit</p>
                      <p className="mt-1 text-surface-700 dark:text-surface-200">{row.limit}</p>
                    </div>
                    <div className="rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 p-2">
                      <p className="text-surface-500 uppercase tracking-wider">Used</p>
                      <p className="mt-1 text-surface-700 dark:text-surface-200">{row.totalUsed}</p>
                    </div>
                    <div className="rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 p-2">
                      <p className="text-surface-500 uppercase tracking-wider">Bearer</p>
                      <p className="mt-1 text-surface-700 dark:text-surface-200">{row.discountBearer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : isFlashDealsPage ? (
      <section className="rounded-[1.75rem] bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-surface-500">Flash Deal Table</p>
            <h2 className="mt-1 text-xl font-extrabold text-surface-900 dark:text-white">Manage flash deal records</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={applyProductPrioritySetup}>Product Priority Setup</Button>
            <Button variant="primary" size="sm" icon={Plus} onClick={openCreateFlashDeal}>Create Flash Deals</Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Badge variant="primary">{filteredFlashRows.length} deals</Badge>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              value={flashSearch}
              onChange={(event) => setFlashSearch(event.target.value)}
              placeholder="Search by title"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-surface-900/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-surface-500">SL</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-surface-500">Title</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-surface-500">Duration</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-surface-500">Status</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-surface-500">Active Products</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-surface-500">Publish</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-surface-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlashRows.map((row, index) => (
                <tr key={row.id} className="border-t border-surface-100 dark:border-surface-800">
                  <td className="px-4 py-3 text-surface-700 dark:text-surface-200">{index + 1}</td>
                  <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{row.title}</td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-300">{row.startDate} - {row.endDate}</td>
                  <td className="px-4 py-3">
                    <Badge variant={row.status === 'Active' ? 'success' : 'danger'} size="sm">{row.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-surface-700 dark:text-surface-200">{row.activeProducts}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleFlashPublish(row)}
                      className={`w-10 h-6 rounded-full p-0.5 transition-colors ${row.publish ? 'bg-admin-primary-600' : 'bg-surface-300 dark:bg-surface-700'}`}
                    >
                      <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${row.publish ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => addFlashProduct(row)}>+ Add Product</Button>
                      <Button size="sm" variant="ghost" icon={Pencil} onClick={() => openEditFlashDeal(row)}>Edit</Button>
                      <Button size="sm" variant="danger" icon={Trash2} onClick={() => deleteFlashDeal(row.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      ) : (
      <section className="rounded-[1.75rem] bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-surface-500">{preset.title} list</p>
            <h2 className="mt-1 text-xl font-extrabold text-surface-900 dark:text-white">Dedicated page for this submodule</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-surface-200 dark:border-surface-700 px-3 py-1.5 text-sm text-surface-600 dark:text-surface-300">
            <Filter size={14} className="text-admin-primary-500" />
            {filteredRows.length} visible
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr_0.6fr] gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search offer, scope, owner, or note"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="px-3 py-3 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Paused">Paused</option>
            <option value="Draft">Draft</option>
            <option value="Expired">Expired</option>
          </select>

          <Button variant="primary" icon={Download} onClick={exportCsv} className="justify-center">Export Filtered</Button>
        </div>

        <Table
          columns={columns}
          data={filteredRows}
          pageSize={6}
          onRowClick={(row) => setSelectedRow(row)}
          emptyState={<p className="text-surface-500 dark:text-surface-400">No {preset.title.toLowerCase()} items match the current filters.</p>}
        />
      </section>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-6 shadow-card">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-extrabold text-surface-900 dark:text-white">Performance snapshot</h3>
              <p className="text-sm text-surface-500">Current list state and execution health.</p>
            </div>
            <Button variant="ghost" size="sm" icon={Eye} onClick={() => selectedRow && setIsPreviewOpen(true)}>Preview</Button>
          </div>

          {selectedRow ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-surface-200 dark:border-surface-700 p-4 bg-surface-50 dark:bg-surface-900/40">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-surface-500">Selected item</p>
                <p className="mt-1 text-lg font-extrabold text-surface-900 dark:text-white">{selectedRow.name}</p>
                <p className="mt-2 text-sm text-surface-500">{selectedRow.scope}</p>
              </div>
              <div className="rounded-2xl border border-surface-200 dark:border-surface-700 p-4 bg-surface-50 dark:bg-surface-900/40">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-surface-500">Status</p>
                <Badge variant={statusBadge(selectedRow.status)} className="mt-2">{selectedRow.status}</Badge>
                <p className="mt-2 text-sm text-surface-500">{selectedRow.window}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-surface-500">Select a row to preview it here.</p>
          )}
        </section>

        <aside className="space-y-5">
          <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-6 shadow-card">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-surface-400 mb-3">Status Mix</p>
            <div className="space-y-3">
              {[
                { label: 'Active', value: stats.active, tone: 'success' },
                { label: 'Scheduled', value: stats.scheduled, tone: 'info' },
                { label: 'Paused', value: stats.paused, tone: 'warning' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-surface-200 dark:border-surface-700 px-4 py-3">
                  <span className="font-medium text-surface-700 dark:text-surface-200">{item.label}</span>
                  <Badge variant={item.tone}>{item.value}</Badge>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-surface-900 to-surface-800 text-white rounded-3xl p-6 shadow-card">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-white/60 mb-3">Execution Tip</p>
            <h3 className="text-xl font-extrabold mb-3">Keep the list focused</h3>
            <p className="text-sm text-white/70 leading-6">
              Use the dedicated page to manage one promotion family at a time. That keeps status updates, deadlines, and creative reviews faster.
            </p>
          </section>
        </aside>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeForm}>
          <div className="w-full max-w-2xl rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">{editingId ? `Edit ${actionLabel}` : `Create ${actionLabel}`}</h3>
              <button onClick={closeForm} className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={saveOffer} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{actionLabel} Name</span>
                <input value={form.name} onChange={(event) => onForm('name', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Scope</span>
                <input value={form.scope} onChange={(event) => onForm('scope', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Status</span>
                <select value={form.status} onChange={(event) => onForm('status', event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
                  <option>Draft</option>
                  <option>Scheduled</option>
                  <option>Active</option>
                  <option>Paused</option>
                  <option>Expired</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Window</span>
                <input value={form.window} onChange={(event) => onForm('window', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Owner</span>
                <input value={form.owner} onChange={(event) => onForm('owner', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Impact</span>
                <input value={form.impact} onChange={(event) => onForm('impact', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Note</span>
                <input value={form.note} onChange={(event) => onForm('note', event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <div className="sm:col-span-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={closeForm}>Cancel</Button>
                <Button type="submit" variant="primary">{editingId ? `Update ${actionLabel}` : `Create ${actionLabel}`}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPreviewOpen && selectedRow && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsPreviewOpen(false)}>
          <div className="w-full max-w-2xl rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 dark:border-surface-700">
              <div>
                <h3 className="text-lg font-bold text-surface-900 dark:text-white">{actionLabel} Preview</h3>
                <p className="text-sm text-surface-500">{selectedRow.name}</p>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-surface-500">Scope</p>
                <p className="font-semibold text-surface-900 dark:text-white">{selectedRow.scope}</p>
              </div>
              <div>
                <p className="text-surface-500">Status</p>
                <Badge variant={statusBadge(selectedRow.status)}>{selectedRow.status}</Badge>
              </div>
              <div>
                <p className="text-surface-500">Window</p>
                <p className="font-semibold text-surface-900 dark:text-white">{selectedRow.window}</p>
              </div>
              <div>
                <p className="text-surface-500">Owner</p>
                <p className="font-semibold text-surface-900 dark:text-white">{selectedRow.owner}</p>
              </div>
              <div>
                <p className="text-surface-500">Impact</p>
                <p className="font-semibold text-surface-900 dark:text-white">{selectedRow.impact}</p>
              </div>
              <div>
                <p className="text-surface-500">Updated</p>
                <p className="font-semibold text-surface-900 dark:text-white">{selectedRow.updated}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-surface-500">Note</p>
                <p className="font-medium text-surface-800 dark:text-surface-200">{selectedRow.note}</p>
              </div>
            </div>

            <div className="px-5 pb-5 flex flex-wrap justify-end gap-2">
              <Button variant="ghost" icon={Pencil} onClick={() => { setIsPreviewOpen(false); openEditOffer(selectedRow); }}>Edit</Button>
              <Button variant="danger" icon={Trash2} onClick={() => deleteOffer(selectedRow)}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {isFlashFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeFlashForm}>
          <div className="w-full max-w-2xl rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">{editingFlashId ? 'Edit Flash Deal' : 'Create Flash Deal'}</h3>
              <button onClick={closeFlashForm} className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={saveFlashDeal} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Title</span>
                <input value={flashForm.title} onChange={(event) => onFlashForm('title', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Start Date</span>
                <input type="date" value={flashForm.startDate} onChange={(event) => onFlashForm('startDate', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">End Date</span>
                <input type="date" value={flashForm.endDate} onChange={(event) => onFlashForm('endDate', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Status</span>
                <select value={flashForm.status} onChange={(event) => onFlashForm('status', event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
                  <option>Active</option>
                  <option>Expired</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Active Products</span>
                <input value={flashForm.activeProducts} onChange={(event) => onFlashForm('activeProducts', event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <label className="space-y-1 sm:col-span-2 flex items-center gap-3">
                <input type="checkbox" checked={flashForm.publish} onChange={(event) => onFlashForm('publish', event.target.checked)} className="w-4 h-4 rounded accent-admin-primary-600" />
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Publish</span>
              </label>

              <div className="sm:col-span-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={closeFlashForm}>Cancel</Button>
                <Button type="submit" variant="primary">{editingFlashId ? 'Update Flash Deal' : 'Create Flash Deal'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Product Selection Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-surface-800 rounded-2xl shadow-2xl overflow-hidden border border-surface-200 dark:border-surface-700 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-surface-100 dark:border-surface-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-surface-900 dark:text-white">Add Product to Flash Deal</h2>
                <p className="text-sm text-surface-500">Select a product and set the discount.</p>
              </div>
              <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-xl text-surface-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProductAdd} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Select Product</label>
                  <select 
                    value={productAddForm.productId}
                    onChange={(e) => setProductAddForm({ ...productAddForm, productId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 outline-none focus:ring-2 focus:ring-admin-primary-500/20 focus:border-admin-primary-500 transition-all dark:text-white"
                  >
                    <option value="">Select a product...</option>
                    {allProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Discount Type</label>
                    <select 
                      value={productAddForm.discountType}
                      onChange={(e) => setProductAddForm({ ...productAddForm, discountType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 outline-none focus:ring-2 focus:ring-admin-primary-500/20 focus:border-admin-primary-500 transition-all dark:text-white"
                    >
                      <option value="fixed">Flat Amount (₹)</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Discount Value</label>
                    <input 
                      type="number"
                      value={productAddForm.discountAmount}
                      onChange={(e) => setProductAddForm({ ...productAddForm, discountAmount: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 outline-none focus:ring-2 focus:ring-admin-primary-500/20 focus:border-admin-primary-500 transition-all dark:text-white"
                      placeholder="e.g. 100 or 10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsProductModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={isAddingProduct}>
                  {isAddingProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add to Deal'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersDealsModulePage;
