import React, { useMemo, useState } from 'react';
import { CheckCircle2, Clock3, Eye, Filter, FolderOpen, Mail, Phone, Plus, Search, Send, Ticket, UserRound, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const initialTickets = [
  { id: 'TK-1001', requester: 'Aarav Mehta', email: 'aarav.mehta@gmail.com', phone: '+91 98765 43210', subject: 'Unable to apply coupon at checkout', category: 'Payment', priority: 'High', status: 'Open', updatedAt: '10 Apr 2026, 09:18 AM', assignee: 'Support Team A', description: 'Customer reports coupon validation error on web checkout for a promotional cart.' },
  { id: 'TK-1002', requester: 'Mia Lopez', email: 'mia.lopez@example.com', phone: '+44 7700 900123', subject: 'Refund not received after return approval', category: 'Refund', priority: 'Medium', status: 'In Progress', updatedAt: '10 Apr 2026, 08:42 AM', assignee: 'Finance Desk', description: 'Refund approved two days ago but the customer has not received the settlement yet.' },
  { id: 'TK-1003', requester: 'Noah Smith', email: 'noah.smith@outlook.com', phone: '+1 415 222 1199', subject: 'Product image not loading in app', category: 'App', priority: 'Low', status: 'Resolved', updatedAt: '09 Apr 2026, 07:10 PM', assignee: 'Mobile Squad', description: 'Product card image renders as blank in one device-specific app session.' },
  { id: 'TK-1004', requester: 'Fatima Khan', email: 'fatima.khan@gmail.com', phone: '+92 300 1234567', subject: 'Delivery partner not updating status', category: 'Delivery', priority: 'High', status: 'Pending SLA', updatedAt: '10 Apr 2026, 06:31 AM', assignee: 'Ops Queue', description: 'Delivery status remains stuck on out for pickup despite partner confirmation.' },
];

const SupportTicketPage = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [query, setQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedId, setSelectedId] = useState('TK-1001');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [ticketDraft, setTicketDraft] = useState({ requester: '', email: '', phone: '', subject: '', category: 'General', priority: 'Medium', status: 'Open', description: '', assignee: 'Support Queue' });
  const [ticketReply, setTicketReply] = useState('');

  const filteredTickets = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesQuery = !q || ticket.requester.toLowerCase().includes(q) || ticket.email.toLowerCase().includes(q) || ticket.phone.toLowerCase().includes(q) || ticket.subject.toLowerCase().includes(q) || ticket.id.toLowerCase().includes(q);
      const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
      const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
      return matchesQuery && matchesPriority && matchesStatus;
    });
  }, [tickets, query, priorityFilter, statusFilter]);

  const selectedTicket = filteredTickets.find((ticket) => ticket.id === selectedId) || filteredTickets[0] || null;

  const statusBadge = (status) => (status === 'Resolved' ? 'success' : status === 'In Progress' ? 'warning' : status === 'Pending SLA' ? 'danger' : 'primary');
  const priorityBadge = (priority) => (priority === 'High' ? 'danger' : priority === 'Medium' ? 'warning' : 'info');

  const openNew = () => {
    setModalMode('create');
    setTicketDraft({ requester: '', email: '', phone: '', subject: '', category: 'General', priority: 'Medium', status: 'Open', description: '', assignee: 'Support Queue' });
    setSelectedId(null);
    setModalOpen(true);
  };

  const openView = (ticket) => {
    setModalMode('view');
    setSelectedId(ticket.id);
    setTicketDraft({ requester: ticket.requester, email: ticket.email, phone: ticket.phone, subject: ticket.subject, category: ticket.category, priority: ticket.priority, status: ticket.status, description: ticket.description, assignee: ticket.assignee });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMode('create');
  };

  const saveTicket = (event) => {
    event.preventDefault();
    const payload = { id: selectedId && tickets.some((ticket) => ticket.id === selectedId) ? selectedId : `TK-${Date.now().toString().slice(-4)}`, requester: ticketDraft.requester.trim(), email: ticketDraft.email.trim(), phone: ticketDraft.phone.trim(), subject: ticketDraft.subject.trim(), category: ticketDraft.category, priority: ticketDraft.priority, status: ticketDraft.status, updatedAt: new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()), assignee: ticketDraft.assignee.trim() || 'Support Queue', description: ticketDraft.description.trim() };
    setTickets((previous) => (selectedId && previous.some((ticket) => ticket.id === selectedId) ? previous.map((ticket) => (ticket.id === selectedId ? payload : ticket)) : [payload, ...previous]));
    setSelectedId(payload.id);
    closeModal();
  };

  const updateTicketStatus = (status) => {
    if (!selectedTicket?.id) return;
    setTickets((previous) => previous.map((ticket) => (ticket.id === selectedTicket.id ? { ...ticket, status, updatedAt: new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()) } : ticket)));
  };

  const replyTicket = (event) => {
    event.preventDefault();
    if (!ticketReply.trim()) return;
    updateTicketStatus('In Progress');
    setTicketReply('');
  };

  const stats = [
    { label: 'Open Tickets', value: tickets.filter((ticket) => ticket.status === 'Open').length, icon: Ticket, tone: 'primary' },
    { label: 'In Progress', value: tickets.filter((ticket) => ticket.status === 'In Progress').length, icon: Clock3, tone: 'warning' },
    { label: 'Resolved', value: tickets.filter((ticket) => ticket.status === 'Resolved').length, icon: CheckCircle2, tone: 'success' },
    { label: 'Pending SLA', value: tickets.filter((ticket) => ticket.status === 'Pending SLA').length, icon: AlertTriangle, tone: 'danger' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="grid gap-4 xl:grid-cols-[16rem_minmax(0,1fr)] xl:items-start">
        <div className="space-y-2 max-w-[16rem] shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">13 Communication & Support</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight leading-tight">Support Ticket</h1>
          <p className="text-sm sm:text-base text-surface-500 leading-6">Track support cases through triage, escalation, and resolution quality metrics.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end xl:self-start">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm text-sm font-medium text-surface-600 dark:text-surface-300">
            <FolderOpen size={16} className="text-admin-primary-500" />
            Ticket workspace
          </div>
          <Button type="button" variant="primary" icon={Plus} onClick={openNew}>New Ticket</Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card">
              <div className="flex items-center justify-between"><div className="p-2.5 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700"><Icon size={18} className="text-admin-primary-600" /></div><Badge variant={stat.tone}>{stat.label}</Badge></div>
              <p className="mt-4 text-3xl font-extrabold text-surface-900 dark:text-white">{stat.value}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr] items-start">
        <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl shadow-card overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-surface-100 dark:border-surface-700 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-1.5 max-w-[16rem] shrink-0"><h2 className="text-lg font-bold text-surface-900 dark:text-white leading-tight">Support Ticket Queue</h2><p className="text-sm text-surface-500 leading-6">Search, filter, and triage incoming support tickets.</p></div>
            <div className="flex flex-col gap-3 w-full xl:flex-row xl:items-center xl:justify-end xl:flex-nowrap">
              <div className="relative w-full xl:min-w-[22rem] xl:max-w-[32rem] xl:flex-[1.6]"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ticket, requester, email, phone" className="w-full rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 pl-11 pr-4 py-3 text-sm text-surface-700 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20" /></div>
              <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="w-full xl:w-[12rem] rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"><option value="All">All Priorities</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full xl:w-[12rem] rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"><option value="All">All Status</option><option value="Open">Open</option><option value="In Progress">In Progress</option><option value="Resolved">Resolved</option><option value="Pending SLA">Pending SLA</option></select>
              <Button variant="primary" icon={Filter} className="whitespace-nowrap justify-center xl:w-auto w-full rounded-2xl">Filter</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 dark:bg-surface-900/60 border-b border-surface-200 dark:border-surface-700"><tr><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Ticket ID</th><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Requester</th><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Subject</th><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Priority</th><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Status</th><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Updated</th><th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Action</th></tr></thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} onClick={() => setSelectedId(ticket.id)} className={`border-b border-surface-100 dark:border-surface-800 cursor-pointer transition-colors hover:bg-surface-50 dark:hover:bg-surface-900/40 ${selectedTicket?.id === ticket.id ? 'bg-admin-primary-50/60 dark:bg-admin-primary-900/10' : ''}`}>
                    <td className="px-5 py-4 font-semibold text-surface-900 dark:text-white">{ticket.id}</td>
                    <td className="px-5 py-4 text-surface-600 dark:text-surface-300"><div className="space-y-1"><p className="font-semibold text-surface-900 dark:text-white">{ticket.requester}</p><p className="text-xs text-surface-500">{ticket.category}</p></div></td>
                    <td className="px-5 py-4 text-surface-700 dark:text-surface-200 max-w-[20rem]">{ticket.subject}</td>
                    <td className="px-5 py-4"><Badge variant={priorityBadge(ticket.priority)}>{ticket.priority}</Badge></td>
                    <td className="px-5 py-4"><Badge variant={statusBadge(ticket.status)}>{ticket.status}</Badge></td>
                    <td className="px-5 py-4 text-surface-500 dark:text-surface-400 whitespace-nowrap">{ticket.updatedAt}</td>
                    <td className="px-5 py-4"><button type="button" onClick={(event) => { event.stopPropagation(); openView(ticket); }} className="inline-flex items-center gap-2 rounded-xl border border-admin-primary-200 text-admin-primary-600 hover:bg-admin-primary-50 dark:border-admin-primary-900/40 dark:text-admin-primary-300 dark:hover:bg-admin-primary-950/20 px-3 py-2 transition-colors"><Eye size={15} />View</button></td>
                  </tr>
                ))}
                {filteredTickets.length === 0 && <tr><td colSpan={7} className="px-6 py-14 text-center text-surface-500 dark:text-surface-400">No tickets match the current search or filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-6">
          <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card">
            <div className="flex items-center justify-between gap-3 mb-5"><div><p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Selected ticket</p><h3 className="mt-2 text-lg font-bold text-surface-900 dark:text-white">{selectedTicket?.id || 'No ticket selected'}</h3></div>{selectedTicket && <Badge variant={statusBadge(selectedTicket.status)}>{selectedTicket.status}</Badge>}</div>
            {selectedTicket ? <div className="space-y-4"><div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4 space-y-3"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-surface-400">Requester</p><p className="mt-1 font-semibold text-surface-900 dark:text-white">{selectedTicket.requester}</p></div><div className="grid grid-cols-1 gap-2 text-sm text-surface-600 dark:text-surface-300"><div className="inline-flex items-center gap-2"><Mail size={14} className="text-surface-400" />{selectedTicket.email}</div><div className="inline-flex items-center gap-2"><Phone size={14} className="text-surface-400" />{selectedTicket.phone}</div><div className="inline-flex items-center gap-2"><UserRound size={14} className="text-surface-400" />Assigned to {selectedTicket.assignee}</div></div></div><div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4 space-y-2"><p className="text-xs font-black uppercase tracking-[0.2em] text-surface-400">Subject</p><p className="font-semibold text-surface-900 dark:text-white">{selectedTicket.subject}</p><p className="text-sm text-surface-500 leading-6">{selectedTicket.description}</p></div><div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4"><p className="text-xs text-surface-500">Priority</p><p className="mt-1 font-semibold text-surface-900 dark:text-white">{selectedTicket.priority}</p></div><div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4"><p className="text-xs text-surface-500">Category</p><p className="mt-1 font-semibold text-surface-900 dark:text-white">{selectedTicket.category}</p></div></div><div className="flex flex-wrap gap-2"><Button variant="secondary" icon={Clock3}>Snooze</Button><Button variant="secondary" icon={CheckCircle2}>Resolve</Button><Button variant="primary" icon={Send}>Reply</Button></div></div> : <p className="text-sm text-surface-500">Select a ticket to view details.</p>}
          </section>
          <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card space-y-4"><div><p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Internal reply</p><h3 className="mt-2 text-lg font-bold text-surface-900 dark:text-white">Add response note</h3></div><form onSubmit={replyTicket} className="space-y-4"><textarea value={ticketReply} onChange={(event) => setTicketReply(event.target.value)} rows={5} placeholder="Write a reply or internal note..." className="w-full rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20" /><div className="flex items-center justify-end gap-2"><Button type="submit" variant="primary" icon={Send}>Send Reply</Button></div></form></section>
        </aside>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={closeModal}>
          <div
            className="w-full max-w-2xl rounded-3xl border border-surface-200 bg-white shadow-2xl dark:border-surface-700 dark:bg-surface-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-surface-200 px-6 py-4 dark:border-surface-700">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Support ticket workspace</p>
                <h3 className="mt-1 text-lg font-bold text-surface-900 dark:text-white">
                  {modalMode === 'create' ? 'New Ticket' : 'Ticket Details'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                Close
              </button>
            </div>

            {modalMode === 'view' ? (
              <div className="space-y-5 px-6 py-6">
                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                  <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
                    <p className="text-xs text-surface-500">Requester</p>
                    <p className="mt-1 font-semibold text-surface-900 dark:text-white">{ticketDraft.requester}</p>
                  </div>
                  <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
                    <p className="text-xs text-surface-500">Status</p>
                    <p className="mt-1 font-semibold text-surface-900 dark:text-white">{ticketDraft.status}</p>
                  </div>
                  <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
                    <p className="text-xs text-surface-500">Priority</p>
                    <p className="mt-1 font-semibold text-surface-900 dark:text-white">{ticketDraft.priority}</p>
                  </div>
                  <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
                    <p className="text-xs text-surface-500">Assignee</p>
                    <p className="mt-1 font-semibold text-surface-900 dark:text-white">{ticketDraft.assignee}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 space-y-2 dark:border-surface-700 dark:bg-surface-800">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-surface-400">Description</p>
                  <p className="text-sm leading-6 text-surface-600 dark:text-surface-300">{ticketDraft.description}</p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={closeModal}>Close</Button>
                  <Button
                    type="button"
                    variant="primary"
                    icon={CheckCircle2}
                    onClick={() => {
                      updateTicketStatus('Resolved');
                      closeModal();
                    }}
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={saveTicket} className="space-y-5 px-6 py-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Requester</span>
                    <input
                      value={ticketDraft.requester}
                      onChange={(event) => setTicketDraft((previous) => ({ ...previous, requester: event.target.value }))}
                      required
                      className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Phone</span>
                    <input
                      value={ticketDraft.phone}
                      onChange={(event) => setTicketDraft((previous) => ({ ...previous, phone: event.target.value }))}
                      required
                      className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Email</span>
                    <input
                      value={ticketDraft.email}
                      onChange={(event) => setTicketDraft((previous) => ({ ...previous, email: event.target.value }))}
                      required
                      className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Category</span>
                    <input
                      value={ticketDraft.category}
                      onChange={(event) => setTicketDraft((previous) => ({ ...previous, category: event.target.value }))}
                      required
                      className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Priority</span>
                    <select
                      value={ticketDraft.priority}
                      onChange={(event) => setTicketDraft((previous) => ({ ...previous, priority: event.target.value }))}
                      className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Status</span>
                    <select
                      value={ticketDraft.status}
                      onChange={(event) => setTicketDraft((previous) => ({ ...previous, status: event.target.value }))}
                      className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
                    >
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                      <option>Pending SLA</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Assignee</span>
                    <input
                      value={ticketDraft.assignee}
                      onChange={(event) => setTicketDraft((previous) => ({ ...previous, assignee: event.target.value }))}
                      className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
                    />
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Subject</span>
                  <input
                    value={ticketDraft.subject}
                    onChange={(event) => setTicketDraft((previous) => ({ ...previous, subject: event.target.value }))}
                    required
                    className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Description</span>
                  <textarea
                    value={ticketDraft.description}
                    onChange={(event) => setTicketDraft((previous) => ({ ...previous, description: event.target.value }))}
                    rows={5}
                    className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
                  />
                </label>

                <div className="flex items-center justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={closeModal}>Close</Button>
                  <Button type="submit" variant="primary" icon={Save}>Save Ticket</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketPage;
