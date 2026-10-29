import React, { useState } from 'react';
import { Megaphone, Palette, Save, Type } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const AnnouncementPage = () => {
  const [announcementDraft, setAnnouncementDraft] = useState({
    isActive: false,
    backgroundColor: '#ebebeb',
    textColor: '#000000',
    text: 'Get 50% discount for specific products from June 2024 to December 2024.',
  });
  const [publishedAnnouncement, setPublishedAnnouncement] = useState({
    isActive: false,
    updatedAt: 'Not published yet',
    text: 'Get 50% discount for specific products from June 2024 to December 2024.',
  });
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const publish = (event) => {
    event.preventDefault();
    setPublishedAnnouncement({
      ...announcementDraft,
      updatedAt: new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()),
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">
            11 Communication & Support
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">Announcement</h1>
          <p className="text-sm sm:text-base text-surface-500 max-w-2xl">Publish company-wide announcements with approval workflows and visibility options.</p>
        </div>

        <button type="button" onClick={() => setWorkspaceOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm text-sm font-medium text-surface-600 dark:text-surface-300 hover:border-admin-primary-300 hover:text-admin-primary-600 transition-colors">
          <Save size={16} className="text-admin-primary-500" />
          Announcement workspace
        </button>
      </div>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-card space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Announcement Setup</p>
          <p className="text-sm text-surface-500">Control activation, colors, and message content before publishing the announcement.</p>
        </div>

        <form onSubmit={publish} className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">Status</p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <label className="inline-flex items-center gap-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-3 py-2 text-sm text-surface-600 dark:text-surface-300">
                <input type="radio" name="announcement-status" checked={announcementDraft.isActive} onChange={() => setAnnouncementDraft((previous) => ({ ...previous, isActive: true }))} className="accent-admin-primary-600" />
                Active
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-3 py-2 text-sm text-surface-600 dark:text-surface-300">
                <input type="radio" name="announcement-status" checked={!announcementDraft.isActive} onChange={() => setAnnouncementDraft((previous) => ({ ...previous, isActive: false }))} className="accent-admin-primary-600" />
                Inactive
              </label>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-surface-700 dark:text-surface-200 flex items-center gap-2"><Palette size={15} />Background color</span>
              <div className="flex items-center gap-3 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-3 py-2.5">
                <input type="color" value={announcementDraft.backgroundColor} onChange={(event) => setAnnouncementDraft((previous) => ({ ...previous, backgroundColor: event.target.value }))} className="h-8 w-8 rounded border border-surface-200 bg-transparent" />
                <input type="text" value={announcementDraft.backgroundColor} onChange={(event) => setAnnouncementDraft((previous) => ({ ...previous, backgroundColor: event.target.value }))} className="w-full bg-transparent text-sm text-surface-700 dark:text-surface-200 focus:outline-none" />
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-surface-700 dark:text-surface-200 flex items-center gap-2"><Type size={15} />Text color</span>
              <div className="flex items-center gap-3 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-3 py-2.5">
                <input type="color" value={announcementDraft.textColor} onChange={(event) => setAnnouncementDraft((previous) => ({ ...previous, textColor: event.target.value }))} className="h-8 w-8 rounded border border-surface-200 bg-transparent" />
                <input type="text" value={announcementDraft.textColor} onChange={(event) => setAnnouncementDraft((previous) => ({ ...previous, textColor: event.target.value }))} className="w-full bg-transparent text-sm text-surface-700 dark:text-surface-200 focus:outline-none" />
              </div>
            </label>
          </div>

          <label className="space-y-2 block">
            <span className="text-sm font-semibold text-surface-700 dark:text-surface-200 flex items-center gap-2"><Megaphone size={15} />Text</span>
            <textarea value={announcementDraft.text} onChange={(event) => setAnnouncementDraft((previous) => ({ ...previous, text: event.target.value }))} rows={4} className="w-full rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-200 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20" />
          </label>

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-4">
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-surface-400">Preview</p>
              <div className="inline-flex items-center rounded-2xl px-4 py-3 text-sm font-medium" style={{ backgroundColor: announcementDraft.backgroundColor, color: announcementDraft.textColor }}>
                {announcementDraft.text}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={announcementDraft.isActive ? 'success' : 'primary'} dot>{announcementDraft.isActive ? 'Active' : 'Inactive'}</Badge>
              <Badge variant="info" dot>Ready to publish</Badge>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button type="submit" variant="primary" icon={Save}>Publish</Button>
          </div>
        </form>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Published state</p>
          <p className="mt-3 text-lg font-extrabold text-surface-900 dark:text-white">{publishedAnnouncement.isActive ? 'Active' : 'Inactive'}</p>
        </article>
        <article className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Last updated</p>
          <p className="mt-3 text-lg font-extrabold text-surface-900 dark:text-white">{publishedAnnouncement.updatedAt}</p>
        </article>
        <article className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Saved message</p>
          <p className="mt-3 text-sm font-semibold text-surface-900 dark:text-white line-clamp-2 leading-6">{publishedAnnouncement.text}</p>
        </article>
      </section>

      {workspaceOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setWorkspaceOpen(false)}>
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-700">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Announcement workspace</p>
                <h3 className="mt-1 text-lg font-bold text-surface-900 dark:text-white">Live preview and publish state</h3>
              </div>
              <button type="button" onClick={() => setWorkspaceOpen(false)} className="rounded-xl px-3 py-2 text-sm font-semibold text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800">Close</button>
            </div>
            <div className="px-6 py-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <article className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-surface-400">Status</p>
                  <p className="mt-2 font-semibold text-surface-900 dark:text-white">{announcementDraft.isActive ? 'Active' : 'Inactive'}</p>
                </article>
                <article className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-surface-400">Background</p>
                  <p className="mt-2 font-semibold text-surface-900 dark:text-white">{announcementDraft.backgroundColor}</p>
                </article>
                <article className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-surface-400">Text color</p>
                  <p className="mt-2 font-semibold text-surface-900 dark:text-white">{announcementDraft.textColor}</p>
                </article>
              </div>
              <div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 p-4 space-y-3">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-surface-400">Preview</p>
                <div className="inline-flex items-center rounded-2xl px-4 py-3 text-sm font-medium" style={{ backgroundColor: announcementDraft.backgroundColor, color: announcementDraft.textColor }}>
                  {announcementDraft.text}
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setWorkspaceOpen(false)}>Close</Button>
                <Button type="button" variant="primary" icon={Save} onClick={publish}>Publish Now</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementPage;
