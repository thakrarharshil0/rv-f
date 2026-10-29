import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Filter, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import Button from '../../components/ui/Button';

const languageTabs = ['English', 'Arabic', 'Bangla', 'Hindi'];
const categoryOptions = ['All', 'Trends', 'Guide', 'Comparison', 'Success'];
const mockRows = [
  { id: '#100001', category: 'Trends', title: 'AI in E-commerce: Transforming the Customer Experience', writer: 'Jhon Milar', publishDate: '11 Feb, 25', active: true },
  { id: '#100002', category: 'Guide', title: 'The Rise of Mobile-First Shoppers: Optimizing Your E-commerce Strategy', writer: 'Jhon Doe', publishDate: '12 Feb, 25', active: true },
  { id: '#100003', category: 'Guide', title: 'How E-commerce Brands are Combating Cart Abandonment', writer: 'Willian Carter', publishDate: '12 Feb, 25', active: true },
  { id: '#100004', category: 'Guide', title: 'How to Use Google Analytics for E-commerce Success', writer: 'Willian Carter', publishDate: '12 Feb, 25', active: true },
  { id: '#100005', category: 'Comparison', title: 'eCommerce vs. rCommerce: Which Platform is Better for Your Business?', writer: 'Mamunur Rashid', publishDate: '12 Feb, 25', active: true },
  { id: '#100006', category: 'Comparison', title: 'eCommerce vs. Traditional Retail: Which One Is More Profitable?', writer: 'Mamunur Rashid', publishDate: '12 Feb, 25', active: false },
];

const ToggleSwitch = ({ checked, onChange, label }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="inline-flex items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary-500/40"
    >
      <span className={`relative h-7 w-14 rounded-full border transition-colors ${checked ? 'bg-emerald-500/20 border-emerald-400/70 dark:bg-emerald-500/20 dark:border-emerald-600/60' : 'bg-surface-100 border-surface-300 dark:bg-surface-800 dark:border-surface-600'}`}>
        <span className={`absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm transition-all ${checked ? 'translate-x-8 bg-emerald-600' : 'translate-x-0.5 bg-surface-400 dark:bg-surface-500'}`}>
          {checked ? <Check size={12} /> : <X size={12} />}
        </span>
      </span>
    </button>
  );
};

const BlogListPage = () => {
  const [blogActive, setBlogActive] = useState(true);
  const [activeLanguage, setActiveLanguage] = useState('English');
  const [introTitle, setIntroTitle] = useState({ English: '', Arabic: '', Bangla: '', Hindi: '' });
  const [introSubtitle, setIntroSubtitle] = useState({ English: '', Arabic: '', Bangla: '', Hindi: '' });
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDate, setFilterDate] = useState('');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState(mockRows);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const categoryMatch = filterCategory === 'All' || row.category === filterCategory;
      const dateMatch = !filterDate || row.publishDate === filterDate;
      const searchMatch = !q || row.title.toLowerCase().includes(q) || row.id.toLowerCase().includes(q) || row.writer.toLowerCase().includes(q);
      return categoryMatch && dateMatch && searchMatch;
    });
  }, [rows, filterCategory, filterDate, search]);

  const resetFilters = () => {
    setFilterCategory('All');
    setFilterDate('');
    setSearch('');
  };

  const toggleRowStatus = (id) => {
    setRows((previous) => previous.map((row) => (row.id === id ? { ...row, active: !row.active } : row)));
  };

  const currentTitle = introTitle[activeLanguage];
  const currentSubtitle = introSubtitle[activeLanguage];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">18 People & Content</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">Blog</h1>
        <p className="text-sm sm:text-base text-surface-500 max-w-2xl">Manage blog visibility, intro section content, and published article entries in one workspace.</p>
      </div>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-xl px-4 py-2 text-sm font-semibold bg-admin-primary-600 text-white">Blog Page</button>
            <button type="button" className="rounded-xl px-4 py-2 text-sm font-semibold bg-surface-100 text-surface-600 dark:bg-surface-900 dark:text-surface-300">App Download Setup</button>
            <button type="button" className="rounded-xl px-4 py-2 text-sm font-semibold bg-surface-100 text-surface-600 dark:bg-surface-900 dark:text-surface-300">Priority Setup</button>
          </div>

          <div className="inline-flex items-center gap-3 text-sm font-semibold text-surface-700 dark:text-surface-300">
            <span>Activate Blog</span>
            <ToggleSwitch checked={blogActive} onChange={() => setBlogActive((previous) => !previous)} label="Toggle blog activation" />
            <span className={`text-xs font-bold uppercase tracking-wider ${blogActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-500 dark:text-surface-400'}`}>
              {blogActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
        <div>
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">Intro Section</h2>
          <p className="text-sm text-surface-500">Configure localized title and subtitle shown on the blog landing area.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {languageTabs.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLanguage(lang)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${activeLanguage === lang ? 'bg-admin-primary-600 text-white shadow-md shadow-admin-primary-500/20' : 'bg-surface-100 text-surface-600 hover:text-surface-900 dark:bg-surface-900 dark:text-surface-300 dark:hover:text-white'}`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          <label className="space-y-2">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Title ({activeLanguage})</span>
            <input
              value={currentTitle}
              onChange={(event) => setIntroTitle((previous) => ({ ...previous, [activeLanguage]: event.target.value }))}
              placeholder="Enter title"
              className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Sub Title ({activeLanguage})</span>
            <textarea
              value={currentSubtitle}
              onChange={(event) => setIntroSubtitle((previous) => ({ ...previous, [activeLanguage]: event.target.value }))}
              placeholder="Enter subtitle"
              rows={3}
              className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100"
            />
          </label>
        </div>
      </section>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
        <h2 className="text-lg font-bold text-surface-900 dark:text-white">Filter Blog</h2>
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto]">
          <select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)} className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100">
            {categoryOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <input type="text" value={filterDate} onChange={(event) => setFilterDate(event.target.value)} placeholder="Publish Date" className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100" />
          <Button type="button" variant="secondary" onClick={resetFilters}>Reset</Button>
          <Button type="button" variant="primary" icon={Filter}>Filter</Button>
        </div>
      </section>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl shadow-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-surface-100 dark:border-surface-700 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Blog List</h2>
            <p className="text-sm text-surface-500">{filteredRows.length} blog entr{filteredRows.length === 1 ? 'y' : 'ies'} shown.</p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative w-full lg:w-[16rem]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title" className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 pl-10 pr-4 py-2.5 text-sm text-surface-700 dark:text-surface-100" />
            </div>
            <Link to="/modules/blog-add-new">
              <Button type="button" variant="primary" icon={Plus}>Create Blog</Button>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-surface-50 dark:bg-surface-900/60 border-b border-surface-200 dark:border-surface-700">
              <tr>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">SL</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">ID</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Category</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Title</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Writer</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Publish Date</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Status</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={row.id} className="border-b border-surface-100 dark:border-surface-800">
                  <td className="px-5 py-4 text-surface-500">{index + 1}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.id}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.category}</td>
                  <td className="px-5 py-4 font-semibold text-surface-900 dark:text-white max-w-[26rem]">{row.title}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.writer}</td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200">{row.publishDate}</td>
                  <td className="px-5 py-4">
                    <ToggleSwitch
                      checked={row.active}
                      onChange={() => toggleRowStatus(row.id)}
                      label={`Toggle status for ${row.id}`}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button type="button" className="inline-flex items-center justify-center rounded-lg border border-admin-primary-200 text-admin-primary-600 hover:bg-admin-primary-50 dark:border-admin-primary-900/40 dark:text-admin-primary-300 dark:hover:bg-admin-primary-950/20 p-2 transition-colors" aria-label={`Edit ${row.id}`}>
                        <Pencil size={14} />
                      </button>
                      <button type="button" className="inline-flex items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/20 p-2 transition-colors" aria-label={`Delete ${row.id}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-surface-500 dark:text-surface-400">No blog entries match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default BlogListPage;
