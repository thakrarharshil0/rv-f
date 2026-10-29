import React, { useMemo, useState } from 'react';
import { Eye, Mail, MessageSquare, Phone, Plus, Search, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const initialMessages = [
  { id: 1, name: 'Jack', contact: { phone: '08897667856', email: 'customer@customer.com' }, subject: 'Some information', time: '12 Oct, 2022 07:23 AM', replied: false },
  { id: 2, name: 'Jhon Doe', contact: { phone: '0181111111', email: 'joshef.doe1025822@gmail.com' }, subject: 'payment system info', time: '12 Oct, 2022 04:48 AM', replied: true },
  { id: 3, name: 'Lisa', contact: { phone: '0111111111', email: 'lisa@gmail.com' }, subject: 'information for order the digital product.', time: '12 Oct, 2022 04:44 AM', replied: true },
];

const MessagePage = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [query, setQuery] = useState('');
  const [replyFilter, setReplyFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft] = useState({ name: '', phone: '', email: '', subject: '', replied: false });

  const filteredMessages = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((row) => {
      const matchesQuery = !q || row.name.toLowerCase().includes(q) || row.contact.phone.toLowerCase().includes(q) || row.contact.email.toLowerCase().includes(q) || row.subject.toLowerCase().includes(q);
      const matchesReply = replyFilter === 'All' || (replyFilter === 'Yes' && row.replied) || (replyFilter === 'No' && !row.replied);
      return matchesQuery && matchesReply;
    });
  }, [messages, query, replyFilter]);

  const activeMessage = messages.find((message) => message.id === activeId) || filteredMessages[0] || null;

  const openNew = () => {
    setModalMode('create');
    setDraft({ name: '', phone: '', email: '', subject: '', replied: false });
    setActiveId(null);
    setModalOpen(true);
  };

  const openView = (row) => {
    setModalMode('view');
    setActiveId(row.id);
    setDraft({ name: row.name, phone: row.contact.phone, email: row.contact.email, subject: row.subject, replied: row.replied });
    setModalOpen(true);
  };

  const openDelete = (row) => {
    setModalMode('delete');
    setActiveId(row.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMode('create');
    setActiveId(null);
  };

  const saveMessage = (event) => {
    event.preventDefault();
    const payload = {
      id: activeId || `MSG-${Date.now().toString().slice(-4)}`,
      name: draft.name.trim(),
      contact: { phone: draft.phone.trim(), email: draft.email.trim() },
      subject: draft.subject.trim(),
      time: new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()),
      replied: draft.replied,
    };

    setMessages((previous) => {
      if (activeId && previous.some((message) => message.id === activeId)) {
        return previous.map((message) => (message.id === activeId ? payload : message));
      }
      return [payload, ...previous];
    });
    closeModal();
  };

  const confirmDelete = () => {
    if (!activeId) return;
    setMessages((previous) => previous.filter((message) => message.id !== activeId));
    closeModal();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">12 Communication & Support</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">Message</h1>
          <p className="text-sm sm:text-base text-surface-500 max-w-2xl">Manage direct message streams with smart routing and response performance tools.</p>
        </div>

        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-admin-primary-600 text-white font-bold shadow-lg shadow-admin-primary-500/20 hover:bg-admin-primary-700 transition-colors">
          <Plus size={16} />
          New Message
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Total Messages</p><p className="mt-3 text-3xl font-extrabold text-surface-900 dark:text-white">{messages.length}</p></article>
        <article className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Replied</p><p className="mt-3 text-3xl font-extrabold text-surface-900 dark:text-white">{messages.filter((row) => row.replied).length}</p></article>
        <article className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Pending</p><p className="mt-3 text-3xl font-extrabold text-surface-900 dark:text-white">{messages.filter((row) => !row.replied).length}</p></article>
      </section>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl shadow-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-surface-100 dark:border-surface-700 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Customer Message Table</h2>
            <p className="text-sm text-surface-500">Search and manage incoming customer messages.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-[18rem]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by Name or Mobile No or Email" className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 pl-10 pr-4 py-2.5 text-sm text-surface-700 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20" />
            </div>
            <select value={replyFilter} onChange={(event) => setReplyFilter(event.target.value)} className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20">
              <option value="All">All Replies</option>
              <option value="Yes">Reply Status: Yes</option>
              <option value="No">Reply Status: No</option>
            </select>
            <Button variant="primary" icon={MessageSquare} className="whitespace-nowrap">Filter</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-surface-900/60 border-b border-surface-200 dark:border-surface-700">
              <tr>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">SL</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Customer Name</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Contact Info</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Subject</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Time & Date</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Reply Status</th>
                <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((row, index) => (
                <tr key={row.id} className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-900/40 transition-colors">
                  <td className="px-5 py-4 text-surface-500 dark:text-surface-400">{index + 1}</td>
                  <td className="px-5 py-4 font-semibold text-surface-900 dark:text-white">{row.name}</td>
                  <td className="px-5 py-4 text-surface-600 dark:text-surface-300"><div className="space-y-1"><div className="inline-flex items-center gap-2"><Phone size={13} className="text-surface-400" />{row.contact.phone}</div><div className="inline-flex items-center gap-2 break-all"><Mail size={13} className="text-surface-400" />{row.contact.email}</div></div></td>
                  <td className="px-5 py-4 text-surface-700 dark:text-surface-200 max-w-[18rem]">{row.subject}</td>
                  <td className="px-5 py-4 text-surface-500 dark:text-surface-400 whitespace-nowrap">{row.time}</td>
                  <td className="px-5 py-4"><Badge variant={row.replied ? 'success' : 'primary'}>{row.replied ? 'Yes' : 'No'}</Badge></td>
                  <td className="px-5 py-4"><div className="flex items-center gap-2"><button type="button" onClick={() => openView(row)} className="inline-flex items-center justify-center rounded-lg border border-admin-primary-200 text-admin-primary-600 hover:bg-admin-primary-50 dark:border-admin-primary-900/40 dark:text-admin-primary-300 dark:hover:bg-admin-primary-950/20 p-2 transition-colors" aria-label={`View ${row.name}`}><Eye size={15} /></button><button type="button" onClick={() => openDelete(row)} className="inline-flex items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/20 p-2 transition-colors" aria-label={`Delete ${row.name}`}><Trash2 size={15} /></button></div></td>
                </tr>
              ))}
              {filteredMessages.length === 0 && <tr><td colSpan={7} className="px-6 py-14 text-center text-surface-500 dark:text-surface-400">No customer messages match the current search or filter.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeModal}>
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-700">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Customer messages</p>
                <h3 className="mt-1 text-lg font-bold text-surface-900 dark:text-white">{modalMode === 'create' ? 'New Message' : modalMode === 'view' ? 'Message Details' : 'Delete Message'}</h3>
              </div>
              <button type="button" onClick={closeModal} className="rounded-xl px-3 py-2 text-sm font-semibold text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800">Close</button>
            </div>

            {modalMode === 'delete' ? (
              <div className="px-6 py-6 space-y-5">
                <p className="text-sm text-surface-600 dark:text-surface-300">Delete message from <span className="font-semibold text-surface-900 dark:text-white">{activeMessage?.name || 'this customer'}</span>?</p>
                <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button><Button type="button" variant="danger" icon={Trash2} onClick={confirmDelete}>Delete</Button></div>
              </div>
            ) : (
              <form onSubmit={saveMessage} className="px-6 py-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2"><span className="text-sm font-medium text-surface-700 dark:text-surface-300">Customer Name</span><input value={draft.name} onChange={(event) => setDraft((previous) => ({ ...previous, name: event.target.value }))} required disabled={modalMode === 'view'} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white disabled:opacity-70" /></label>
                  <label className="space-y-2"><span className="text-sm font-medium text-surface-700 dark:text-surface-300">Mobile No</span><input value={draft.phone} onChange={(event) => setDraft((previous) => ({ ...previous, phone: event.target.value }))} required disabled={modalMode === 'view'} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white disabled:opacity-70" /></label>
                  <label className="space-y-2"><span className="text-sm font-medium text-surface-700 dark:text-surface-300">Email</span><input value={draft.email} onChange={(event) => setDraft((previous) => ({ ...previous, email: event.target.value }))} required disabled={modalMode === 'view'} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white disabled:opacity-70" /></label>
                  <label className="space-y-2"><span className="text-sm font-medium text-surface-700 dark:text-surface-300">Reply Status</span><select value={String(draft.replied)} onChange={(event) => setDraft((previous) => ({ ...previous, replied: event.target.value === 'true' }))} disabled={modalMode === 'view'} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white disabled:opacity-70"><option value="false">No</option><option value="true">Yes</option></select></label>
                </div>
                <label className="space-y-2 block"><span className="text-sm font-medium text-surface-700 dark:text-surface-300">Subject / Message</span><textarea value={draft.subject} onChange={(event) => setDraft((previous) => ({ ...previous, subject: event.target.value }))} required rows={5} disabled={modalMode === 'view'} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white disabled:opacity-70" /></label>
                <div className="flex items-center justify-between gap-3"><p className="text-xs text-surface-500 dark:text-surface-400">{modalMode === 'create' ? 'Create and add this message to the table.' : 'View only mode.'}</p><div className="flex gap-2"><Button type="button" variant="secondary" onClick={closeModal}>Close</Button>{modalMode === 'create' && <Button type="submit" variant="primary">Save Message</Button>}</div></div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePage;
