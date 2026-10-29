import React, { useMemo, useState } from 'react';
import { CalendarDays, ImagePlus, Sparkles, WandSparkles } from 'lucide-react';
import Button from '../../components/ui/Button';

const languageTabs = ['English', 'Arabic', 'Bangla', 'Hindi'];
const categories = ['News', 'Fitness Tips', 'Product Updates', 'Campaigns'];

const BlogAddNewPage = () => {
  const [category, setCategory] = useState('');
  const [writer, setWriter] = useState('');
  const [publishDate, setPublishDate] = useState('2026-04-10');
  const [activeLanguage, setActiveLanguage] = useState('English');
  const [titleByLanguage, setTitleByLanguage] = useState({ English: '', Arabic: '', Bangla: '', Hindi: '' });
  const [descriptionByLanguage, setDescriptionByLanguage] = useState({ English: '', Arabic: '', Bangla: '', Hindi: '' });
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [seoFlags, setSeoFlags] = useState({
    index: true,
    noIndex: false,
    noFollow: false,
    noArchive: false,
    maxSnippet: false,
    maxVideoPreview: false,
    maxImagePreview: false,
  });
  const [snippetLimit, setSnippetLimit] = useState('-1');
  const [videoPreviewLimit, setVideoPreviewLimit] = useState('-1');
  const [imagePreviewLimit, setImagePreviewLimit] = useState('-1');
  const [thumbnailName, setThumbnailName] = useState('');
  const [metaImageName, setMetaImageName] = useState('');

  const currentTitle = titleByLanguage[activeLanguage];
  const currentDescription = descriptionByLanguage[activeLanguage];

  const titleCount = useMemo(() => currentTitle.length, [currentTitle]);
  const descriptionCount = useMemo(() => currentDescription.length, [currentDescription]);

  const updateTitle = (value) => {
    setTitleByLanguage((previous) => ({ ...previous, [activeLanguage]: value }));
  };

  const updateDescription = (value) => {
    setDescriptionByLanguage((previous) => ({ ...previous, [activeLanguage]: value }));
  };

  const toggleSeoFlag = (key) => {
    setSeoFlags((previous) => ({ ...previous, [key]: !previous[key] }));
  };

  const handleThumbnailUpload = (event) => {
    const file = event.target.files?.[0];
    setThumbnailName(file ? file.name : '');
  };

  const handleMetaImageUpload = (event) => {
    const file = event.target.files?.[0];
    setMetaImageName(file ? file.name : '');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">18 People & Content</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">Create New Blog</h1>
        <p className="text-sm sm:text-base text-surface-500 max-w-2xl">Create localized blog posts with media attachments, AI assist, and SEO controls in one workflow.</p>
      </div>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 sm:p-6 shadow-card grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
            <label className="space-y-2">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100">
                <option value="">Select</option>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <Button type="button" variant="secondary">Manage Category</Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Writer</span>
              <input value={writer} onChange={(event) => setWriter(event.target.value)} placeholder="Ex. Jhon Milar" className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Publish Date</span>
              <div className="relative">
                <CalendarDays size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input type="date" value={publishDate} onChange={(event) => setPublishDate(event.target.value)} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 pr-10 text-sm text-surface-700 dark:text-surface-100" />
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Thumbnail</p>
          <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-900 p-6 min-h-[170px] cursor-pointer hover:border-admin-primary-400 transition-colors">
            <ImagePlus size={22} className="text-admin-primary-500" />
            <span className="text-sm font-semibold text-surface-700 dark:text-surface-200">Click to upload</span>
            <span className="text-xs text-surface-500 text-center">JPG, PNG, WEBP up to 2MB</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
          </label>
          <p className="text-xs text-surface-500 truncate">{thumbnailName || 'No file selected'}</p>
        </div>
      </section>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
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
          <Button type="button" variant="ghost" icon={Sparkles}>Generate</Button>
        </div>

        <label className="space-y-2 block">
          <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Title ({activeLanguage})</span>
          <input value={currentTitle} onChange={(event) => updateTitle(event.target.value)} placeholder="Enter blog title" className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100" />
          <p className="text-xs text-surface-500">{titleCount}/255 characters</p>
        </label>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Description ({activeLanguage})</span>
            <Button type="button" variant="ghost" icon={WandSparkles}>Generate</Button>
          </div>
          <div className="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="px-3 py-2 bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 text-xs text-surface-500">Formatting toolbar placeholder: bold, italic, bullets, links, alignment, media</div>
            <textarea value={currentDescription} onChange={(event) => updateDescription(event.target.value)} rows={7} placeholder="Write your blog content" className="w-full bg-white dark:bg-surface-800 px-4 py-3 text-sm text-surface-700 dark:text-surface-100 resize-y focus:outline-none" />
          </div>
          <p className="text-xs text-surface-500">{descriptionCount} characters</p>
        </div>
      </section>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">SEO Section</h2>
            <p className="text-sm text-surface-500">Add meta tags and crawler controls for search visibility.</p>
          </div>
          <Button type="button" variant="ghost" icon={Sparkles}>Generate</Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-4">
            <label className="space-y-2 block">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Meta Title</span>
              <input value={metaTitle} onChange={(event) => setMetaTitle(event.target.value)} placeholder="Meta title" className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100" />
            </label>
            <label className="space-y-2 block">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Meta Description</span>
              <textarea value={metaDescription} onChange={(event) => setMetaDescription(event.target.value)} rows={4} placeholder="Write a short SEO description" className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100" />
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Meta Image</p>
            <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-900 p-6 min-h-[170px] cursor-pointer hover:border-admin-primary-400 transition-colors">
              <ImagePlus size={22} className="text-admin-primary-500" />
              <span className="text-sm font-semibold text-surface-700 dark:text-surface-200">Click to upload</span>
              <span className="text-xs text-surface-500 text-center">1200 x 630 recommended</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleMetaImageUpload} />
            </label>
            <p className="text-xs text-surface-500 truncate">{metaImageName || 'No file selected'}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4">
            <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200"><input type="checkbox" checked={seoFlags.index} onChange={() => toggleSeoFlag('index')} className="accent-admin-primary-600" />Index</label>
            <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200"><input type="checkbox" checked={seoFlags.noIndex} onChange={() => toggleSeoFlag('noIndex')} className="accent-admin-primary-600" />No Index</label>
            <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200"><input type="checkbox" checked={seoFlags.noFollow} onChange={() => toggleSeoFlag('noFollow')} className="accent-admin-primary-600" />No Follow</label>
            <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200"><input type="checkbox" checked={seoFlags.noArchive} onChange={() => toggleSeoFlag('noArchive')} className="accent-admin-primary-600" />No Archive</label>
          </div>

          <div className="space-y-3 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4">
            <label className="flex items-center justify-between gap-3 text-sm text-surface-700 dark:text-surface-200"><span>Max Snippet</span><input value={snippetLimit} onChange={(event) => setSnippetLimit(event.target.value)} className="w-20 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-800 px-2 py-1 text-sm" /></label>
            <label className="flex items-center justify-between gap-3 text-sm text-surface-700 dark:text-surface-200"><span>Max Video Preview</span><input value={videoPreviewLimit} onChange={(event) => setVideoPreviewLimit(event.target.value)} className="w-20 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-800 px-2 py-1 text-sm" /></label>
            <label className="flex items-center justify-between gap-3 text-sm text-surface-700 dark:text-surface-200"><span>Max Image Preview</span><input value={imagePreviewLimit} onChange={(event) => setImagePreviewLimit(event.target.value)} className="w-20 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-800 px-2 py-1 text-sm" /></label>
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary">Save Draft</Button>
        <Button type="button" variant="primary">Publish Blog</Button>
      </div>
    </div>
  );
};

export default BlogAddNewPage;
