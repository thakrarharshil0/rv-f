import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Filter,
  Megaphone,
  Plus,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import { getNotificationPreset, notificationStatusVariant } from './notificationsData';

const emptyForm = {
  id: '',
  title: '',
  channel: 'Push',
  audience: 'All Users',
  status: 'Draft',
  schedule: '',
  owner: 'Comms Team',
  ctr: '0.0%',
};

const NotificationsModulePage = ({ moduleKey }) => {
  const preset = useMemo(() => getNotificationPreset(moduleKey), [moduleKey]);
  const [rows, setRows] = useState(preset.rows);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRow, setSelectedRow] = useState(rows[0] || null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesQuery =
        !q ||
        row.title.toLowerCase().includes(q) ||
        row.channel.toLowerCase().includes(q) ||
        row.audience.toLowerCase().includes(q) ||
        row.owner.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [rows, query, statusFilter]);

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((row) => row.status === 'Active').length,
    scheduled: rows.filter((row) => row.status === 'Scheduled').length,
  }), [rows]);

  const statusBadge = (status) => notificationStatusVariant[status] || 'primary';

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      id: `${moduleKey.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      title: `${preset.title} ${rows.length + 1}`,
      schedule: 'Apr 20, 2026',
      ctr: '0.0%',
    });
    setIsFormOpen(true);
  };

  const openEdit = (row) => {
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

  const saveItem = (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      id: form.id || `${moduleKey.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
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

  const exportCsv = () => {
    const csv = [
      ['Title', 'Channel', 'Audience', 'Status', 'Schedule', 'Owner', 'CTR'],
      ...filteredRows.map((row) => [row.title, row.channel, row.audience, row.status, row.schedule, row.owner, row.ctr]),
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
      key: 'title',
      label: 'Notification',
      sortable: true,
      render: (row) => (
        <div className="min-w-[220px]">
          <p className="font-semibold text-surface-900 dark:text-white">{row.title}</p>
          <p className="text-xs text-surface-500">Owner: {row.owner}</p>
        </div>
      ),
    },
    { key: 'channel', label: 'Channel' },
    { key: 'audience', label: 'Audience' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={statusBadge(row.status)}>{row.status}</Badge>,
    },
    { key: 'schedule', label: 'Schedule' },
    { key: 'ctr', label: 'CTR' },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
          <Button size="sm" variant="ghost" icon={Eye} onClick={() => setSelectedRow(row)}>View</Button>
          <Button size="sm" variant="secondary" icon={Plus} onClick={() => openEdit(row)}>Edit</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <section className="rounded-[2rem] border border-surface-200 dark:border-surface-700 bg-gradient-to-br from-surface-900 via-surface-800 to-admin-primary-700 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_30%)]" />
        <div className="relative p-6 sm:p-8 lg:p-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <Link to="/modules/notifications" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em] text-white/70 hover:text-white transition-colors">
              <ArrowLeft size={14} />
              Notifications
            </Link>
            <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] bg-white/10 text-white/80">
              <Sparkles size={14} />
              Dedicated module page
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">{preset.title}</h1>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl">{preset.subtitle}</p>

            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85"><Calendar size={15} className="text-admin-primary-300" />Apr 07 - Apr 30, 2026</div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85"><Megaphone size={15} className="text-admin-primary-300" />{stats.active} active</div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85"><Clock3 size={15} className="text-admin-primary-300" />{stats.scheduled} scheduled</div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-md space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="bg-white text-surface-900 hover:bg-white/90" icon={Plus} onClick={openCreate}>Make {preset.title}</Button>
              <Button variant="secondary" className="bg-white text-surface-900 hover:bg-white/90" icon={CheckCircle2} onClick={openCreate}>New {preset.title}</Button>
            </div>
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" icon={Download} onClick={exportCsv}>Export CSV</Button>

            <div className="grid grid-cols-2 gap-2">
              {preset.stats.map((item) => (
                <div key={item.label} className="rounded-xl bg-white/10 p-3 border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/60">{item.label}</p>
                  <p className="mt-1 text-lg font-extrabold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, channel, audience, owner"
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
          </select>

          <Button variant="primary" icon={Download} onClick={exportCsv} className="justify-center">Export Filtered</Button>
        </div>

        <Table
          columns={columns}
          data={filteredRows}
          pageSize={6}
          onRowClick={(row) => setSelectedRow(row)}
          emptyState={<p className="text-surface-500 dark:text-surface-400">No {preset.title.toLowerCase()} items match current filters.</p>}
        />
      </section>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeForm}>
          <div className="w-full max-w-2xl rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">{editingId ? `Edit ${preset.title}` : `Create ${preset.title}`}</h3>
              <button onClick={closeForm} className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={saveItem} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Title</span>
                <input value={form.title} onChange={(event) => onForm('title', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Channel</span>
                <input value={form.channel} onChange={(event) => onForm('channel', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Audience</span>
                <input value={form.audience} onChange={(event) => onForm('audience', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Status</span>
                <select value={form.status} onChange={(event) => onForm('status', event.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
                  <option>Draft</option>
                  <option>Scheduled</option>
                  <option>Active</option>
                  <option>Paused</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Schedule</span>
                <input value={form.schedule} onChange={(event) => onForm('schedule', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Owner</span>
                <input value={form.owner} onChange={(event) => onForm('owner', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">CTR</span>
                <input value={form.ctr} onChange={(event) => onForm('ctr', event.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800" />
              </label>

              <div className="sm:col-span-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={closeForm}>Cancel</Button>
                <Button type="submit" variant="primary">{editingId ? `Update ${preset.title}` : `Create ${preset.title}`}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsModulePage;
