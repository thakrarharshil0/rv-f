import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BadgePercent,
  BarChart3,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  Eye,
  Filter,
  Gauge,
  ImagePlus,
  Layers3,
  LayoutGrid,
  Megaphone,
  MousePointerClick,
  PauseCircle,
  PlayCircle,
  Save,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Trash2,
  X,
  Plus,
  UploadCloud,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import api from '../../../lib/api';
import { toast } from 'sonner';

const loadBanners = []; // Will be populated from API

const emptyForm = {
  title: '',
  placement: 'Homepage Hero',
  channel: 'Web',
  audience: 'All Visitors',
  format: 'Hero Image',
  status: 'Scheduled',
  priority: 1,
  startDate: '',
  endDate: '',
  ctaText: 'Shop Now',
  cover: '',
};

const quickTemplates = [
  {
    id: 'seasonal-hero',
    title: 'Seasonal Hero Push',
    description: 'High-impact homepage takeover for major seasonal drops.',
    defaults: {
      placement: 'Homepage Hero',
      channel: 'Both',
      audience: 'All Visitors',
      format: 'Hero Image',
      status: 'Scheduled',
      priority: 1,
      ctaText: 'Shop the Drop',
      cover: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200',
    },
  },
  {
    id: 'retarget-strip',
    title: 'Retargeting Strip',
    description: 'Compact banner for repeat visitors and cart recovery.',
    defaults: {
      placement: 'Category Top Strip',
      channel: 'App',
      audience: 'Returning Users',
      format: 'Promo Strip',
      status: 'Active',
      priority: 2,
      ctaText: 'Finish Your Order',
      cover: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=1200',
    },
  },
  {
    id: 'product-carousel',
    title: 'Product Carousel Spotlight',
    description: 'Flexible creative for collections and category refreshes.',
    defaults: {
      placement: 'Product Listing Mid',
      channel: 'Web',
      audience: 'New Visitors',
      format: 'Carousel',
      status: 'Draft',
      priority: 3,
      ctaText: 'Explore Collection',
      cover: 'https://images.unsplash.com/photo-1506629905607-d9f9a7fd5d1b?auto=format&fit=crop&q=80&w=1200',
    },
  },
];

const statusOptions = ['All', 'Active', 'Scheduled', 'Paused', 'Draft'];
const channelOptions = ['All', 'Web', 'App', 'Both'];
const audienceOptions = ['All Visitors', 'New Visitors', 'Returning Users', 'Members', 'Cart Abandoners'];
const formatOptions = ['Hero Image', 'Split Banner', 'Carousel', 'Promo Strip'];
const placementOptionsSeed = ['Homepage Hero', 'Category Top Strip', 'Product Listing Mid', 'Checkout Side'];

const computeCtr = (item) => (item.impressions ? ((item.clicks / item.impressions) * 100).toFixed(2) : '0.00');

const computeQualityScore = (item) => {
  let score = 40;

  if (item.cover) score += 15;
  if (item.ctaText) score += 10;
  if (item.startDate && item.endDate) score += 10;
  if (item.audience && item.audience !== 'All Visitors') score += 10;
  if (item.format && item.format !== 'Hero Image') score += 5;
  if (item.status === 'Active') score += 10;

  return Math.min(score, 100);
};

const formatDateLabel = (dateValue) => {
  if (!dateValue) return 'Not set';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue));
};

const isDateWithinRange = (startDate, endDate, referenceDate = new Date()) => {
  if (!startDate || !endDate) return false;

  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return today >= start && today <= end;
};

const BannerSetup = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [placementFilter, setPlacementFilter] = useState('All');
  const [channelFilter, setChannelFilter] = useState('All');
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [selectedBannerRows, setSelectedBannerRows] = useState([]);
  const [tableResetKey, setTableResetKey] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // This is the ID BNR-XXX
  const [dbId, setDbId] = useState(null); // Actual DB ID
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await api.banners.list();
      setBanners(res.items || []);
    } catch (error) {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!selectedBannerId && banners[0]) {
      setSelectedBannerId(banners[0].id);
      return;
    }

    if (selectedBannerId && !banners.some((item) => item.id === selectedBannerId)) {
      setSelectedBannerId(banners[0]?.id || null);
    }
  }, [banners, selectedBannerId]);

  const placements = useMemo(() => {
    const values = [...placementOptionsSeed, ...banners.map((item) => item.placement)];
    return ['All', ...new Set(values)];
  }, [banners]);

  const selectedBanner = useMemo(
    () => banners.find((item) => item.id === selectedBannerId) || null,
    [banners, selectedBannerId]
  );

  const filteredBanners = useMemo(() => {
    const q = query.trim().toLowerCase();

    return banners.filter((item) => {
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.placement.toLowerCase().includes(q) ||
        item.channel.toLowerCase().includes(q) ||
        item.audience.toLowerCase().includes(q) ||
        item.format.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesPlacement = placementFilter === 'All' || item.placement === placementFilter;
      const matchesChannel = channelFilter === 'All' || item.channel === channelFilter;

      return matchesQuery && matchesStatus && matchesPlacement && matchesChannel;
    });
  }, [banners, query, statusFilter, placementFilter, channelFilter]);

  const stats = useMemo(() => {
    const totalImpressions = banners.reduce((sum, item) => sum + item.impressions, 0);
    const totalClicks = banners.reduce((sum, item) => sum + item.clicks, 0);
    const ctr = totalImpressions ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
    const activeNow = banners.filter((item) => item.status === 'Active' && isDateWithinRange(item.startDate, item.endDate)).length;
    const scheduledSoon = banners.filter((item) => item.status === 'Scheduled').length;
    const averageScore = Math.round(banners.reduce((sum, item) => sum + computeQualityScore(item), 0) / Math.max(banners.length, 1));

    return {
      total: banners.length,
      activeNow,
      scheduledSoon,
      ctr,
      averageScore,
      totalClicks,
      totalImpressions,
    };
  }, [banners]);

  const featuredBanner = useMemo(() => {
    if (banners.length === 0) return null;

    return [...banners].sort((left, right) => computeQualityScore(right) - computeQualityScore(left))[0];
  }, [banners]);

  const topCtrBanner = useMemo(() => {
    if (banners.length === 0) return null;

    return [...banners].sort((left, right) => Number(computeCtr(right)) - Number(computeCtr(left)))[0];
  }, [banners]);

  const expiringBanner = useMemo(() => {
    const now = new Date();
    const items = banners
      .filter((item) => item.endDate)
      .map((item) => ({
        ...item,
        daysLeft: Math.ceil((new Date(item.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      }))
      .filter((item) => item.daysLeft >= 0)
      .sort((left, right) => left.daysLeft - right.daysLeft);

    return items[0] || null;
  }, [banners]);

  const statusBadge = (status) => {
    if (status === 'Active') return 'success';
    if (status === 'Paused') return 'warning';
    if (status === 'Scheduled') return 'info';
    if (status === 'Draft') return 'primary';
    return 'primary';
  };

  const updateBannerStatus = async (id, status, actualDbId) => {
    try {
      await api.banners.update(actualDbId, { status });
      toast.success(`Banner ${status}`);
      fetchBanners();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openCreateFromTemplate = (template) => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      ...template.defaults,
      title: template.title,
    });
    setIsFormOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setDbId(row.dbId);
    setForm({
      title: row.title,
      placement: row.placement,
      channel: row.channel,
      audience: row.audience,
      format: row.format,
      status: row.status,
      priority: row.priority,
      startDate: row.startDate || '',
      endDate: row.endDate || '',
      ctaText: row.ctaText,
      cover: row.cover,
    });
    setImageFile(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const onForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const saveBanner = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', form.title || 'Untitled Banner');
    formData.append('placement', form.placement);
    formData.append('channel', form.channel);
    formData.append('audience', form.audience);
    formData.append('format', form.format);
    formData.append('status', form.status);
    formData.append('priority', form.priority);
    formData.append('startDate', form.startDate);
    formData.append('endDate', form.endDate);
    formData.append('ctaText', form.ctaText);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (dbId) {
        console.log("Updating banner with DB ID:", dbId);
        formData.append('_method', 'PATCH');
        await api.banners.update(dbId, formData);
        toast.success("Banner updated");
      } else {
        await api.banners.create(formData);
        toast.success("Banner created");
      }
      fetchBanners();
      closeForm();
    } catch (error) {
      toast.error("Failed to save banner");
    }
  };

  const duplicateBanner = (row) => {
    const copy = {
      ...row,
      id: `BNR-${Math.floor(1200 + Math.random() * 900)}`,
      title: `${row.title} (Copy)`,
      status: 'Draft',
      clicks: 0,
      impressions: 0,
    };

    setBanners((prev) => [copy, ...prev]);
    setSelectedBannerId(copy.id);
    setTableResetKey((key) => key + 1);
  };

  const deleteBanner = async (row) => {
    const ok = window.confirm(`Delete banner "${row.title}"?`);
    if (!ok) return;

    try {
      await api.banners.delete(row.dbId);
      toast.success("Deleted successfully");
      fetchBanners();
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  const applyBulkStatus = (status) => {
    if (selectedBannerRows.length === 0) return;

    const selectedIds = new Set(selectedBannerRows.map((item) => item.id));
    setBanners((prev) => prev.map((item) => (selectedIds.has(item.id) ? { ...item, status } : item)));
    setTableResetKey((key) => key + 1);
    setSelectedBannerRows([]);
  };

  const bulkDuplicate = () => {
    if (selectedBannerRows.length === 0) return;

    const duplicated = selectedBannerRows.map((row) => ({
      ...row,
      id: `BNR-${Math.floor(1200 + Math.random() * 900)}`,
      title: `${row.title} (Copy)`,
      status: 'Draft',
      clicks: 0,
      impressions: 0,
    }));

    setBanners((prev) => [...duplicated, ...prev]);
    setSelectedBannerId(duplicated[0].id);
    setTableResetKey((key) => key + 1);
    setSelectedBannerRows([]);
  };

  const bulkDelete = () => {
    if (selectedBannerRows.length === 0) return;

    const ok = window.confirm(`Delete ${selectedBannerRows.length} selected banner(s)?`);
    if (!ok) return;

    const selectedIds = new Set(selectedBannerRows.map((item) => item.id));
    setBanners((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    setSelectedBannerId((currentId) => {
      if (!selectedIds.has(currentId)) return currentId;
      return banners.find((item) => !selectedIds.has(item.id))?.id || null;
    });
    setTableResetKey((key) => key + 1);
    setSelectedBannerRows([]);
  };

  const exportCsv = (rows = filteredBanners, label = 'filtered') => {
    const csv = [
      ['ID', 'Title', 'Placement', 'Channel', 'Audience', 'Format', 'Status', 'Priority', 'Start', 'End', 'CTR%', 'Score'],
      ...rows.map((item) => [
        item.id,
        item.title,
        item.placement,
        item.channel,
        item.audience,
        item.format,
        item.status,
        item.priority,
        item.startDate,
        item.endDate,
        computeCtr(item),
        computeQualityScore(item),
      ]),
    ]
      .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `banner-setup-${label}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setQuery('');
    setStatusFilter('All');
    setPlacementFilter('All');
    setChannelFilter('All');
  };

  const columns = [
    {
      key: 'title',
      label: 'Banner',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3 min-w-[260px]">
          <img
            src={row.cover}
            alt={row.title}
            className="w-16 h-12 object-cover rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-surface-900 dark:text-white leading-tight">{row.title}</p>
              <Badge variant={statusBadge(row.status)} size="sm">{row.status}</Badge>
            </div>
            <p className="text-xs text-surface-500 mt-0.5">{row.id} · {row.ctaText}</p>
          </div>
        </div>
      ),
    },
    { key: 'placement', label: 'Placement', sortable: true },
    {
      key: 'segment',
      label: 'Targeting',
      render: (row) => (
        <div className="space-y-1 min-w-[140px]">
          <p className="text-sm font-medium text-surface-700 dark:text-surface-200">{row.audience}</p>
          <p className="text-xs text-surface-500">{row.format}</p>
        </div>
      ),
    },
    { key: 'channel', label: 'Channel' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={statusBadge(row.status)}>{row.status}</Badge>,
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (row) => <span className="inline-flex items-center rounded-full bg-surface-100 dark:bg-surface-700 px-2.5 py-1 text-xs font-semibold text-surface-700 dark:text-surface-200">#{row.priority}</span>,
    },
    {
      key: 'performance',
      label: 'Performance',
      render: (row) => (
        <div className="text-xs space-y-1 min-w-[150px]">
          <p className="text-surface-700 dark:text-surface-300 inline-flex items-center gap-1 font-medium">
            <MousePointerClick size={13} />
            {row.clicks.toLocaleString()} clicks
          </p>
          <p className="text-surface-500">CTR {computeCtr(row)}% · Score {computeQualityScore(row)}</p>
        </div>
      ),
    },
    {
      key: 'dates',
      label: 'Schedule',
      render: (row) => (
        <div className="text-xs min-w-[130px]">
          <p className="text-surface-700 dark:text-surface-300 font-medium">{formatDateLabel(row.startDate)}</p>
          <p className="text-surface-500">to {formatDateLabel(row.endDate)}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2 flex-wrap min-w-[240px]" onClick={(event) => event.stopPropagation()}>
          <Button size="sm" variant="ghost" icon={Eye} onClick={() => {
            setSelectedBannerId(row.id);
            // Scroll to preview on mobile
            if (window.innerWidth < 1280) {
              document.querySelector('aside')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}>
            Preview
          </Button>
          <Button size="sm" variant="ghost" icon={Plus} onClick={() => openEdit(row)}>
            Edit
          </Button>
          {row.status === 'Active' ? (
            <Button size="sm" variant="secondary" icon={PauseCircle} onClick={() => updateBannerStatus(row.id, 'Paused', row.dbId)}>
              Pause
            </Button>
          ) : (
            <Button size="sm" variant="success" icon={PlayCircle} onClick={() => updateBannerStatus(row.id, 'Active', row.dbId)}>
              Run
            </Button>
          )}
        </div>
      ),
    },
  ];

  const insightCards = [
    { label: 'Total Banners', value: stats.total, icon: LayoutGrid, tone: 'primary', detail: `${filteredBanners.length} visible` },
    { label: 'Active Now', value: stats.activeNow, icon: Target, tone: 'success', detail: 'Within date window' },
    { label: 'Scheduled', value: stats.scheduledSoon, icon: CalendarDays, tone: 'info', detail: 'Queued for launch' },
    { label: 'Average CTR', value: `${stats.ctr}%`, icon: TrendingUp, tone: 'primary', detail: `${stats.totalClicks.toLocaleString()} clicks` },
    { label: 'Creative Score', value: stats.averageScore, icon: Gauge, tone: 'warning', detail: 'Quality heuristic' },
    { label: 'Impressions', value: stats.totalImpressions.toLocaleString(), icon: BadgePercent, tone: 'success', detail: 'All campaigns' },
  ];

  const selectedSummary = selectedBannerRows.length > 0 ? `${selectedBannerRows.length} selected` : 'No bulk selection';
  const statusCounts = useMemo(
    () => [
      { label: 'Active', value: banners.filter((item) => item.status === 'Active').length },
      { label: 'Scheduled', value: banners.filter((item) => item.status === 'Scheduled').length },
      { label: 'Draft', value: banners.filter((item) => item.status === 'Draft').length },
    ],
    [banners]
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <section className="relative overflow-hidden rounded-[2rem] border border-surface-200 dark:border-surface-700 bg-gradient-to-br from-surface-900 via-surface-800 to-admin-primary-700 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.14),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.24),_transparent_22%)]" />
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-admin-primary-500/20 blur-3xl" />
        <div className="absolute left-12 bottom-10 h-28 w-28 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] p-6 sm:p-8 lg:p-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
              <Sparkles size={14} />
              Campaign Command Center
            </div>

            <div className="space-y-3 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                Banner <span className="text-admin-primary-300">Setup</span> for higher conversion velocity.
              </h1>
              <p className="text-sm sm:text-base text-white/75 max-w-xl">
                Design, schedule, target, and measure all promotional banners from one workspace. The page now includes quick templates, bulk actions, local persistence, and a stronger live preview flow.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85">
                <Calendar size={15} className="text-admin-primary-300" />
                Campaign Console
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85">
                <Megaphone size={15} className="text-admin-primary-300" />
                {stats.activeNow} live placements
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85">
                <BarChart3 size={15} className="text-admin-primary-300" />
                CTR {stats.ctr}%
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {insightCards.slice(0, 3).map((card) => (
                <div key={card.label} className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm p-4 shadow-[0_12px_30px_rgba(15,23,42,0.18)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-white/55 font-bold">{card.label}</p>
                      <p className="mt-2 text-2xl font-black text-white">{card.value}</p>
                    </div>
                    <card.icon size={18} className="text-admin-primary-300" />
                  </div>
                  <p className="mt-2 text-sm text-white/60">{card.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-surface-900/25 p-5 backdrop-blur-md shadow-[0_20px_50px_rgba(15,23,42,0.28)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Priority Spotlight</p>
                <p className="mt-1 text-lg font-semibold">Best creative by score</p>
              </div>
              <div className="rounded-full bg-white/10 p-3">
                <ArrowUpRight size={18} className="text-admin-primary-300" />
              </div>
            </div>

            {featuredBanner ? (
              <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-surface-900/45">
                <img src={featuredBanner.cover} alt={featuredBanner.title} className="h-40 w-full object-cover" />
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">{featuredBanner.title}</p>
                      <p className="text-xs text-white/60">{featuredBanner.placement} · {featuredBanner.audience}</p>
                    </div>
                    <Badge variant={statusBadge(featuredBanner.status)}>{featuredBanner.status}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-white/10 p-2">
                      <p className="text-white/55 uppercase tracking-wider">Score</p>
                      <p className="mt-1 text-white font-bold">{computeQualityScore(featuredBanner)}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-2">
                      <p className="text-white/55 uppercase tracking-wider">CTR</p>
                      <p className="mt-1 text-white font-bold">{computeCtr(featuredBanner)}%</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-2">
                      <p className="text-white/55 uppercase tracking-wider">Priority</p>
                      <p className="mt-1 text-white font-bold">#{featuredBanner.priority}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-sm text-white/70">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 size={14} />
                      {formatDateLabel(featuredBanner.startDate)} - {formatDateLabel(featuredBanner.endDate)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 size={14} />
                      {featuredBanner.ctaText}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/70">No banners available yet.</p>
            )}

            {topCtrBanner && topCtrBanner.id !== featuredBanner.id && (
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/55 font-bold">CTR leader</p>
                    <p className="mt-1 font-semibold text-white">{topCtrBanner.title}</p>
                  </div>
                  <Badge variant="info">{computeCtr(topCtrBanner)}%</Badge>
                </div>
                <p className="mt-2 text-sm text-white/65">{topCtrBanner.placement} · {topCtrBanner.audience}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" icon={ImagePlus} onClick={openCreate} className="bg-white text-surface-900 hover:bg-white/90">
                New Banner
              </Button>
              <Button variant="outline" icon={Download} onClick={() => exportCsv(selectedBannerRows.length ? selectedBannerRows : filteredBanners, selectedBannerRows.length ? 'selection' : 'filtered')} className="border-white/20 text-white hover:bg-white/10">
                Export CSV
              </Button>
            </div>

            {expiringBanner && (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-50 shadow-[0_12px_30px_rgba(217,119,6,0.12)]">
                <p className="font-semibold inline-flex items-center gap-2">
                  <Filter size={14} />
                  Upcoming expiry alert
                </p>
                <p className="mt-1 text-amber-50/80">
                  {expiringBanner.title} ends in {expiringBanner.daysLeft} day(s). Review the creative before it drops.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
        {insightCards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card p-4 hover:shadow-card-hover transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-surface-500">{card.label}</p>
                <p className="mt-1 text-2xl font-extrabold text-surface-900 dark:text-white">{card.value}</p>
              </div>
              <card.icon size={18} className="text-admin-primary-500" />
            </div>
            <p className="mt-2 text-xs text-surface-500">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[1.75rem] bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-card p-5 space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-4 items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-surface-500">Banner workspace</p>
                <h2 className="mt-1 text-xl font-extrabold text-surface-900 dark:text-white">Manage the full list in one view</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-surface-200 dark:border-surface-700 px-3 py-1.5 text-sm text-surface-600 dark:text-surface-300">
                <Filter size={14} className="text-admin-primary-500" />
                {filteredBanners.length} visible
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr] gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search title, id, audience, or placement"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="px-3 py-3 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'All' ? 'All Status' : option}
                  </option>
                ))}
              </select>

              <select
                value={placementFilter}
                onChange={(event) => setPlacementFilter(event.target.value)}
                className="px-3 py-3 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
              >
                {placements.map((item) => (
                  <option key={item} value={item}>
                    {item === 'All' ? 'All Placements' : item}
                  </option>
                ))}
              </select>

              <select
                value={channelFilter}
                onChange={(event) => setChannelFilter(event.target.value)}
                className="px-3 py-3 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
              >
                {channelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'All' ? 'All Channels' : option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-surface-500">Quick templates</span>
              {quickTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => openCreateFromTemplate(template)}
                  className="inline-flex items-center gap-2 rounded-full border border-surface-200 dark:border-surface-700 px-3 py-1.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-900 transition-colors"
                >
                  <Sparkles size={14} className="text-admin-primary-500" />
                  {template.title}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-surface-500">Actions</p>
                <p className="text-sm font-semibold text-surface-900 dark:text-white">Create, export, or clean up</p>
              </div>
              <Badge variant="primary" size="sm">{selectedSummary}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" icon={Download} onClick={() => exportCsv(filteredBanners)} className="w-full justify-center">
                Export
              </Button>
              <Button variant="primary" icon={ImagePlus} onClick={openCreate} className="w-full justify-center">
                New Banner
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {statusCounts.map((item) => (
                <div key={item.label} className="rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 px-3 py-2 text-center">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-surface-500">{item.label}</p>
                  <p className="mt-1 text-lg font-extrabold text-surface-900 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 px-3 py-2 text-xs text-surface-500">
              <span>{filteredBanners.length} banners match the current filters</span>
              <button onClick={clearFilters} className="font-semibold text-admin-primary-600 hover:text-admin-primary-700">
                Reset all
              </button>
            </div>
          </div>
        </div>

        {(selectedBannerRows.length > 0 || query || statusFilter !== 'All' || placementFilter !== 'All' || channelFilter !== 'All') && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
              <span className="inline-flex items-center gap-2 font-semibold text-surface-800 dark:text-surface-100">
                <Filter size={14} />
                {selectedSummary}
              </span>
              {(query || statusFilter !== 'All' || placementFilter !== 'All' || channelFilter !== 'All') && (
                <span className="text-surface-500">{filteredBanners.length} matching banner(s)</span>
              )}
            </div>

            {selectedBannerRows.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                <Button variant="success" size="sm" icon={PlayCircle} onClick={() => applyBulkStatus('Active')}>
                  Activate
                </Button>
                <Button variant="secondary" size="sm" icon={PauseCircle} onClick={() => applyBulkStatus('Paused')}>
                  Pause
                </Button>
                <Button variant="ghost" size="sm" icon={Copy} onClick={bulkDuplicate}>
                  Duplicate
                </Button>
                <Button variant="danger" size="sm" icon={Trash2} onClick={bulkDelete}>
                  Delete
                </Button>
              </div>
            ) : (
              <div className="text-xs text-surface-500 inline-flex items-center gap-2">
                <Filter size={12} />
                Refine the workspace or clear filters to see the full campaign set.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white dark:bg-surface-800 rounded-[1.75rem] border border-surface-200 dark:border-surface-700 shadow-card overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/60">
            <div>
              <h3 className="text-base font-bold text-surface-900 dark:text-white">Banner list</h3>
              <p className="text-sm text-surface-500">Sortable table with preview, status actions, and bulk selection</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-surface-500">
              <Badge variant="primary" size="sm">{filteredBanners.length} shown</Badge>
              <Badge variant="info" size="sm">{selectedBannerRows.length} selected</Badge>
            </div>
          </div>
          <Table
            key={tableResetKey}
            columns={columns}
            data={filteredBanners}
            onRowClick={(row) => setSelectedBannerId(row.id)}
            pageSize={6}
            selectable={true}
            onSelectRows={setSelectedBannerRows}
            rowClassName={(row) =>
              row.id === selectedBannerId
                ? 'bg-admin-primary-50/70 dark:bg-admin-primary-900/15 border-l-4 border-l-admin-primary-500'
                : row.status === 'Active'
                  ? 'bg-emerald-50/35 dark:bg-emerald-900/10'
                  : ''
            }
            emptyState={
              <div className="py-16 text-center">
                <Layers3 size={48} className="mx-auto mb-4 text-surface-300 dark:text-surface-700" />
                <p className="text-lg font-semibold text-surface-900 dark:text-white mb-2">No banners found</p>
                <p className="text-surface-600 dark:text-surface-400">Try adjusting filters or create a new campaign template.</p>
              </div>
            }
          />
        </div>

        <aside className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card p-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-surface-500">Live Preview</h2>
            <span className="text-xs text-surface-400">Placement snapshot</span>
          </div>

          {selectedBanner ? (
            <>
              <div className="rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900">
                <img src={selectedBanner.cover} alt={selectedBanner.title} className="w-full h-44 object-cover" />
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-surface-900 dark:text-white">{selectedBanner.title}</p>
                      <p className="text-xs text-surface-500">
                        {selectedBanner.placement} • {selectedBanner.channel} • {selectedBanner.audience}
                      </p>
                    </div>
                    <Badge variant={statusBadge(selectedBanner.status)}>{selectedBanner.status}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary" size="sm">{selectedBanner.format}</Badge>
                    <Badge variant="info" size="sm">Priority #{selectedBanner.priority}</Badge>
                  </div>

                  <Button variant="primary" size="sm" icon={Megaphone}>
                    {selectedBanner.ctaText}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => openEdit(selectedBanner)}
                  className="p-2.5 rounded-xl border border-surface-200 dark:border-surface-700 text-sm hover:bg-surface-50 dark:hover:bg-surface-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => duplicateBanner(selectedBanner)}
                  className="p-2.5 rounded-xl border border-surface-200 dark:border-surface-700 text-sm hover:bg-surface-50 dark:hover:bg-surface-900 inline-flex items-center justify-center gap-1"
                >
                  <Copy size={14} />
                  Duplicate
                </button>
                <button
                  onClick={() => updateBannerStatus(selectedBanner.id, selectedBanner.status === 'Active' ? 'Paused' : 'Active', selectedBanner.dbId)}
                  className="p-2.5 rounded-xl border border-surface-200 dark:border-surface-700 text-sm hover:bg-surface-50 dark:hover:bg-surface-900"
                >
                  {selectedBanner.status === 'Active' ? 'Pause Campaign' : 'Activate Campaign'}
                </button>
                <button
                  onClick={() => deleteBanner(selectedBanner)}
                  className="p-2.5 rounded-xl border border-red-300 text-red-600 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 inline-flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>

              <div className="space-y-3 rounded-xl bg-surface-50 dark:bg-surface-900/40 border border-surface-200 dark:border-surface-700 p-3">
                <div>
                  <p className="text-xs uppercase font-semibold text-surface-500 mb-1">Performance</p>
                  <p className="text-sm text-surface-700 dark:text-surface-300 inline-flex items-center gap-1">
                    <BarChart3 size={14} />
                    {selectedBanner.clicks.toLocaleString()} clicks / {selectedBanner.impressions.toLocaleString()} impressions
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg bg-white dark:bg-surface-800 p-2 border border-surface-200 dark:border-surface-700">
                    <p className="text-surface-500 uppercase tracking-wider">CTR</p>
                    <p className="mt-1 font-bold text-surface-900 dark:text-white">{computeCtr(selectedBanner)}%</p>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-surface-800 p-2 border border-surface-200 dark:border-surface-700">
                    <p className="text-surface-500 uppercase tracking-wider">Score</p>
                    <p className="mt-1 font-bold text-surface-900 dark:text-white">{computeQualityScore(selectedBanner)}</p>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-surface-800 p-2 border border-surface-200 dark:border-surface-700">
                    <p className="text-surface-500 uppercase tracking-wider">Status</p>
                    <p className="mt-1 font-bold text-surface-900 dark:text-white">{selectedBanner.status}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-surface-500">Select a banner to preview.</p>
          )}
        </aside>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeForm}>
          <div
            className="w-full max-w-3xl bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">
                {editingId ? 'Edit Banner Campaign' : 'Create Banner Campaign'}
              </h3>
              <button onClick={closeForm} className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={saveBanner} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Banner Title</span>
                <input
                  required
                  value={form.title}
                  onChange={(event) => onForm('title', event.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Placement</span>
                <select
                  value={form.placement}
                  onChange={(event) => onForm('placement', event.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                >
                  {placementOptionsSeed.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Channel</span>
                <select
                  value={form.channel}
                  onChange={(event) => onForm('channel', event.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                >
                  {channelOptions.filter((option) => option !== 'All').map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Audience</span>
                <select
                  value={form.audience}
                  onChange={(event) => onForm('audience', event.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                >
                  {audienceOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Creative Format</span>
                <select
                  value={form.format}
                  onChange={(event) => onForm('format', event.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                >
                  {formatOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Status</span>
                <select
                  value={form.status}
                  onChange={(event) => onForm('status', event.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                >
                  {statusOptions.filter((option) => option !== 'All').map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Priority</span>
                <input
                  type="number"
                  min="1"
                  value={form.priority}
                  onChange={(event) => onForm('priority', event.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Start Date</span>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(event) => onForm('startDate', event.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">End Date</span>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(event) => onForm('endDate', event.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">CTA Text</span>
                <input
                  value={form.ctaText}
                  onChange={(event) => onForm('ctaText', event.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                />
              </label>

              <div className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Banner Image</span>
                <div className="relative aspect-video rounded-2xl border-2 border-dashed border-surface-200 dark:border-surface-700 overflow-hidden flex items-center justify-center bg-surface-50 dark:bg-surface-900 group">
                  {imageFile || form.cover ? (
                    <>
                      <img
                        src={imageFile ? URL.createObjectURL(imageFile) : form.cover}
                        alt="Banner"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="p-3 bg-white text-admin-primary-600 rounded-full cursor-pointer shadow-lg transform hover:scale-110 transition-transform">
                          <Plus size={24} />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                          />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full hover:bg-surface-100 transition-colors">
                      <UploadCloud size={40} className="text-surface-300 mb-2" />
                      <span className="text-sm font-medium text-surface-600">Upload Banner Image</span>
                      <span className="text-xs text-surface-400 mt-1">Recommended: 1200x400 (3:1)</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-600 dark:text-surface-300 inline-flex items-center gap-2">
                <Sparkles size={14} className="text-admin-primary-500" />
                Tip: keep one active hero banner per placement and use audience-specific creatives for better CTR.
              </div>

              <div className="sm:col-span-2 flex flex-wrap justify-end gap-2">
                <Button type="button" variant="secondary" onClick={closeForm}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" icon={Save}>
                  {editingId ? 'Update Banner' : 'Create Banner'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerSetup;
