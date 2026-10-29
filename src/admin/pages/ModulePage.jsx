import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  AlertTriangle,
  Filter,
  Mail,
  LayoutDashboard,
  MessageSquare,
  Phone,
  Ticket,
  CheckCircle2,
  Clock3,
  UserRound,
  FolderOpen,
  Send,
  Trash2,
  Search,
  Plus,
  Download,
  Sparkles,
  CircleCheck,
  Check,
  ChartNoAxesColumn,
  Megaphone,
  Palette,
  Type,
  CircleDot,
  Save,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { getModuleBySlug } from '../constants/navigation';

const hashValue = (str = '') => str.split('').reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0);

const titleFromSlug = (slug = '') =>
  slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const statusPalette = {
  primary: 'text-admin-primary-600 bg-admin-primary-50 dark:bg-admin-primary-900/20',
  success: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  warning: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  danger: 'text-red-600 bg-red-50 dark:bg-red-900/20',
};

const buildRows = (label, seed) =>
  Array.from({ length: 8 }).map((_, idx) => ({
    name: `${label} Item ${idx + 1}`,
    owner: ['Team Alpha', 'Team Growth', 'Team Ops', 'Team Admin'][(seed + idx) % 4],
    status: ['Active', 'Review', 'Draft', 'Published'][(seed + idx * 2) % 4],
    updated: `${(seed + idx * 3) % 28 + 1} Apr 2026`,
  }));

const buildMessages = () => [
  {
    id: 1,
    name: 'Jack',
    contact: { phone: '08897667856', email: 'customer@customer.com' },
    subject: 'Some information',
    time: '12 Oct, 2022 07:23 AM',
    replied: false,
  },
  {
    id: 2,
    name: 'Jhon Doe',
    contact: { phone: '0181111111', email: 'joshef.doe1025822@gmail.com' },
    subject: 'payment system info',
    time: '12 Oct, 2022 04:48 AM',
    replied: true,
  },
  {
    id: 3,
    name: 'Lisa',
    contact: { phone: '0111111111', email: 'lisa@gmail.com' },
    subject: 'information for order the digital product.',
    time: '12 Oct, 2022 04:44 AM',
    replied: true,
  },
];

const buildTickets = () => [
  {
    id: 'TK-1001',
    requester: 'Aarav Mehta',
    email: 'aarav.mehta@gmail.com',
    phone: '+91 98765 43210',
    subject: 'Unable to apply coupon at checkout',
    category: 'Payment',
    priority: 'High',
    status: 'Open',
    updatedAt: '10 Apr 2026, 09:18 AM',
    assignee: 'Support Team A',
    description: 'Customer reports coupon validation error on web checkout for a promotional cart.',
  },
  {
    id: 'TK-1002',
    requester: 'Mia Lopez',
    email: 'mia.lopez@example.com',
    phone: '+44 7700 900123',
    subject: 'Refund not received after return approval',
    category: 'Refund',
    priority: 'Medium',
    status: 'In Progress',
    updatedAt: '10 Apr 2026, 08:42 AM',
    assignee: 'Finance Desk',
    description: 'Refund approved two days ago but the customer has not received the settlement yet.',
  },
  {
    id: 'TK-1003',
    requester: 'Noah Smith',
    email: 'noah.smith@outlook.com',
    phone: '+1 415 222 1199',
    subject: 'Product image not loading in app',
    category: 'App',
    priority: 'Low',
    status: 'Resolved',
    updatedAt: '09 Apr 2026, 07:10 PM',
    assignee: 'Mobile Squad',
    description: 'Product card image renders as blank in one device-specific app session.',
  },
  {
    id: 'TK-1004',
    requester: 'Fatima Khan',
    email: 'fatima.khan@gmail.com',
    phone: '+92 300 1234567',
    subject: 'Delivery partner not updating status',
    category: 'Delivery',
    priority: 'High',
    status: 'Pending SLA',
    updatedAt: '10 Apr 2026, 06:31 AM',
    assignee: 'Ops Queue',
    description: 'Delivery status remains stuck on out for pickup despite partner confirmation.',
  },
];

const getPreset = (slug, moduleItem) => {
  const seed = hashValue(slug);
  const label = moduleItem?.label || titleFromSlug(slug);

  const base = {
    subtitle: `Operate ${label.toLowerCase()} with advanced workflows, automation controls, and clear performance insights.`,
    chips: ['Workflow', 'Automation', 'Audit Trail', 'Approvals', 'Exports'],
    checklist: ['Review pending records', 'Apply updated rules', 'Publish latest changes'],
    stats: [
      { label: 'Total Records', value: (seed % 120) + 24, tone: 'primary' },
      { label: 'In Progress', value: (seed % 18) + 6, tone: 'warning' },
      { label: 'Completed', value: (seed % 40) + 10, tone: 'success' },
      { label: 'Need Attention', value: (seed % 9) + 2, tone: 'danger' },
    ],
    rows: buildRows(label, seed),
  };

  const presetsBySlug = {
    refund: {
      subtitle: 'Manage refund operations end-to-end, from request intake to settlement and closure.',
      chips: ['SLA Monitor', 'Reason Codes', 'Escalation', 'Payout Sync', 'Fraud Checks'],
    },
    'refund-pending': {
      subtitle: 'Track pending refund cases and prioritize reviews based on SLA and customer value.',
      chips: ['Pending Queue', 'Aging Buckets', 'Priority Rules', 'Approver Assignments', 'Customer Notes'],
    },
    'refund-approved': {
      subtitle: 'Execute approved refunds with payout readiness and reconciliation checkpoints.',
      chips: ['Approval Ledger', 'Payout Batches', 'Gateway Status', 'Reconciliation', 'Exports'],
    },
    'refund-refunded': {
      subtitle: 'Review completed refunds with traceable payout references and audit confidence.',
      chips: ['Settlement Logs', 'Gateway IDs', 'Audit Trails', 'CSV Export', 'Customer Timeline'],
    },
    'refund-rejected': {
      subtitle: 'Handle rejected requests consistently with reason taxonomy and communication templates.',
      chips: ['Reason Catalog', 'Policy Checks', 'Appeals', 'Response Templates', 'Quality Review'],
    },
    categories: {
      subtitle: 'Organize storefront taxonomy for discoverability, merchandising, and scalable growth.',
      chips: ['Category Tree', 'SEO Labels', 'Rules', 'Visibility', 'Sort Priority'],
    },
    'sub-categories': {
      subtitle: 'Maintain detailed sub-category structures with precision filtering and storefront alignment.',
      chips: ['Hierarchy', 'Filters', 'Mappings', 'Naming Rules', 'Batch Actions'],
    },
    'product-attributes': {
      subtitle: 'Configure reusable product attributes to power variants and faceted search.',
      chips: ['Attribute Sets', 'Variant Rules', 'Validation', 'Localization', 'Dependencies'],
    },
    'add-new-product': {
      subtitle: 'Launch products quickly with a guided onboarding flow and quality checkpoints.',
      chips: ['Draft Builder', 'Image Uploader', 'Variants', 'Pricing', 'Publish'],
    },
    'limited-stock': {
      subtitle: 'Monitor low inventory in real time and trigger replenishment workflows automatically.',
      chips: ['Low Stock Rules', 'Alerts', 'Thresholds', 'Vendor Queue', 'Reorder'],
    },
    'bulk-import': {
      subtitle: 'Process high-volume catalog uploads with validation previews and rollback safety.',
      chips: ['CSV Mapping', 'Preview', 'Validation', 'Error Logs', 'Rollback'],
    },
    'request-restock-list': {
      subtitle: 'Coordinate restock requests across teams with SLA, ownership, and vendor tracking.',
      chips: ['Request Queue', 'Vendor Sync', 'SLA', 'Approvals', 'Fulfillment'],
    },
    'product-gallery': {
      subtitle: 'Manage media assets with optimized delivery profiles and merchandising consistency.',
      chips: ['Media Library', 'Optimization', 'Tagging', 'Alt Text', 'Collections'],
    },
    'banner-setup': {
      subtitle: 'Build conversion-focused banner experiences with scheduling and campaign targeting.',
      chips: ['Placements', 'Scheduling', 'Campaign Tags', 'Preview', 'AB Test'],
    },
    'offers-and-deals': {
      subtitle: 'Control promotion strategy across campaigns, coupon mechanics, and storefront placement.',
      chips: ['Campaigns', 'Eligibility Rules', 'Budget Caps', 'Priority', 'ROI'],
    },
    coupon: {
      subtitle: 'Issue and govern coupon programs with usage rules, limits, and fraud prevention.',
      chips: ['Coupon Builder', 'Usage Limits', 'Eligibility', 'Stacking Rules', 'Abuse Guard'],
    },
    'flash-deals': {
      subtitle: 'Run high-velocity flash campaigns with scheduling, allocation, and real-time monitoring.',
      chips: ['Countdown', 'Inventory Lock', 'Traffic Shield', 'Discount Rules', 'Live Metrics'],
    },
    'deal-of-the-day': {
      subtitle: 'Merchandise a daily flagship offer with visibility controls and conversion analytics.',
      chips: ['Daily Rotation', 'Featured Placement', 'Pacing', 'Guardrails', 'Insight'],
    },
    'featured-deal': {
      subtitle: 'Showcase premium promotional bundles with strategic placement and narrative design.',
      chips: ['Hero Placement', 'Creative Assets', 'Targeting', 'Scheduling', 'Reporting'],
    },
    'clearance-sale': {
      subtitle: 'Liquidate aging inventory using markdown ladders and controlled campaign windows.',
      chips: ['Markdown Ladder', 'Inventory Aging', 'Pacing', 'Storefront Slots', 'Recovery Metrics'],
    },
    notifications: {
      subtitle: 'Orchestrate omnichannel communication flows with segmentation and delivery tracking.',
      chips: ['Channels', 'Segmentation', 'Templates', 'Schedules', 'Deliverability'],
    },
    'send-notification': {
      subtitle: 'Compose and deliver targeted announcements with live audience previews and timing controls.',
      chips: ['Composer', 'Audience Preview', 'Scheduling', 'A/B Testing', 'Read Tracking'],
    },
    'push-notifications-setup': {
      subtitle: 'Configure push infrastructure, payload standards, and fallback behavior at scale.',
      chips: ['Provider Setup', 'Payload Schema', 'Retry Rules', 'Device Tokens', 'Monitoring'],
    },
    announcement: {
      subtitle: 'Publish company-wide announcements with approval workflows and visibility options.',
      chips: ['Drafts', 'Approvals', 'Audience Scope', 'Scheduling', 'History'],
    },
    message: {
      subtitle: 'Manage direct message streams with smart routing and response performance tools.',
      chips: ['Inbox', 'Routing', 'Templates', 'SLA', 'Escalation'],
    },
    'support-ticket': {
      subtitle: 'Track support cases through triage, escalation, and resolution quality metrics.',
      chips: ['Ticket Queue', 'Priority', 'SLA', 'Resolution Notes', 'CSAT'],
    },
    'earning-reports': {
      subtitle: 'Analyze revenue trends with period comparisons, drilldowns, and finance-ready exports.',
      chips: ['Revenue Trend', 'MoM Comparison', 'Segments', 'Export', 'Audit'],
    },
    'product-report': {
      subtitle: 'Measure catalog performance across engagement, conversion, and stock outcomes.',
      chips: ['SKU Health', 'Conversion', 'Returns', 'Velocity', 'Benchmarks'],
    },
    'order-report': {
      subtitle: 'Evaluate order lifecycle metrics and identify operational bottlenecks proactively.',
      chips: ['Order Funnel', 'Status Mix', 'SLA', 'Failure Analysis', 'Exports'],
    },
    'admin-tax-report': {
      subtitle: 'Maintain tax visibility with accurate summaries, exceptions, and compliance exports.',
      chips: ['Tax Summary', 'Jurisdiction View', 'Exceptions', 'Reconcile', 'Compliance'],
    },
    blog: {
      subtitle: 'Manage editorial operations with SEO support, publishing cadence, and content governance.',
      chips: ['Editorial Calendar', 'SEO Checks', 'Draft Workflow', 'Scheduling', 'Revision History'],
    },
    'blog-add-new': {
      subtitle: 'Create rich blog entries with structure guidance, SEO signals, and media tooling.',
      chips: ['Composer', 'SEO Assistant', 'Media Attachments', 'Preview', 'Publish'],
    },
    'blog-list': {
      subtitle: 'Track all articles by status, owner, and performance to keep content operations sharp.',
      chips: ['Status Filters', 'Ownership', 'Performance', 'Bulk Actions', 'Archive'],
    },
    'customer-reviews': {
      subtitle: 'Moderate and amplify customer sentiment with smart triage and response workflows.',
      chips: ['Moderation', 'Sentiment', 'Flagging', 'Response Templates', 'Insights'],
    },
    'loyalty-points': {
      subtitle: 'Design and operate loyalty mechanics with earn/redeem controls and member segmentation.',
      chips: ['Earning Rules', 'Redeem Rules', 'Tiering', 'Fraud Guard', 'Program Insights'],
    },
    employees: {
      subtitle: 'Coordinate employee operations with role-aware views, ownership, and productivity signals.',
      chips: ['Directory', 'Access Scope', 'Assignments', 'Capacity', 'Performance'],
    },
    'employee-role-setup': {
      subtitle: 'Define role structures with permissions, inheritance, and audit-friendly governance.',
      chips: ['Role Matrix', 'Permission Sets', 'Inheritance', 'Approvals', 'Audit Logs'],
    },
    'tax-gst': {
      subtitle: 'Set and maintain GST rules with region-aware logic and compliance safeguards.',
      chips: ['GST Rules', 'Region Mapping', 'Rates', 'Validation', 'Compliance'],
    },
    'priority-setup': {
      subtitle: 'Configure priority models that route critical operations to the right teams instantly.',
      chips: ['Priority Rules', 'Thresholds', 'Routing', 'Escalation', 'SLA Policy'],
    },
    'pages-media': {
      subtitle: 'Manage storefront pages and media touchpoints with consistent brand delivery.',
      chips: ['Page Builder', 'Media Library', 'Linking', 'Versioning', 'Governance'],
    },
    'business-pages': {
      subtitle: 'Maintain key business pages with structure templates and conversion-ready sections.',
      chips: ['Page Templates', 'Blocks', 'SEO', 'Preview', 'Publishing'],
    },
    'social-media-links': {
      subtitle: 'Centralize social links and ensure consistency across all customer touchpoints.',
      chips: ['Link Registry', 'Validation', 'UTM Tags', 'Placement', 'Monitoring'],
    },
    'login-settings': {
      subtitle: 'Control authentication behavior, session policy, and secure login experience settings.',
      chips: ['Session Policy', 'MFA', 'Password Rules', 'Rate Limits', 'Risk Alerts'],
    },
    'email-template': {
      subtitle: 'Design reusable email templates with brand consistency and campaign-level customization.',
      chips: ['Template Builder', 'Blocks', 'Variables', 'Preview', 'Send Tests'],
    },
    'marketing-tools': {
      subtitle: 'Operate growth tooling with audience targeting, experiments, and impact reporting.',
      chips: ['Audience', 'Experiments', 'Campaign Ops', 'Attribution', 'ROI'],
    },
  };

  return { ...base, ...(presetsBySlug[slug] || {}) };
};

const ModulePage = () => {
  const { moduleSlug } = useParams();
  const moduleItem = getModuleBySlug(moduleSlug);

  const [query, setQuery] = useState('');
  const [automationOn, setAutomationOn] = useState(true);
  const [messages, setMessages] = useState(() => buildMessages());
  const [messageReplyFilter, setMessageReplyFilter] = useState('All');
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageModalMode, setMessageModalMode] = useState('create');
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [messageDraft, setMessageDraft] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    body: '',
    replied: false,
  });
  const [announcementWorkspaceOpen, setAnnouncementWorkspaceOpen] = useState(false);
  const [tickets, setTickets] = useState(() => buildTickets());
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState('All');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('All');
  const [selectedTicketId, setSelectedTicketId] = useState('TK-1001');
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketModalMode, setTicketModalMode] = useState('create');
  const [ticketReply, setTicketReply] = useState('');
  const [ticketDraft, setTicketDraft] = useState({
    requester: '',
    email: '',
    phone: '',
    subject: '',
    category: 'General',
    priority: 'Medium',
    status: 'Open',
    description: '',
    assignee: 'Support Queue',
  });
  const [announcementDraft, setAnnouncementDraft] = useState({
    isActive: false,
    backgroundColor: '#ebebeb',
    textColor: '#000000',
    text: 'Get 50% discount for specific products from June 2024 to December 2024.',
  });
  const [publishedAnnouncement, setPublishedAnnouncement] = useState({
    isActive: false,
    backgroundColor: '#ebebeb',
    textColor: '#000000',
    text: 'Get 50% discount for specific products from June 2024 to December 2024.',
    updatedAt: 'Not published yet',
  });

  const preset = useMemo(() => getPreset(moduleSlug, moduleItem), [moduleSlug, moduleItem]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return preset.rows;

    return preset.rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.owner.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q)
    );
  }, [preset.rows, query]);

  const messageRows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return messages.filter((row) => {
      const matchesQuery =
        !q ||
        row.name.toLowerCase().includes(q) ||
        row.contact.phone.toLowerCase().includes(q) ||
        row.contact.email.toLowerCase().includes(q) ||
        row.subject.toLowerCase().includes(q);

      const matchesReply =
        messageReplyFilter === 'All' ||
        (messageReplyFilter === 'Yes' && row.replied) ||
        (messageReplyFilter === 'No' && !row.replied);

      return matchesQuery && matchesReply;
    });
  }, [messages, query, messageReplyFilter]);

  const activeMessage = useMemo(
    () => messages.find((message) => message.id === activeMessageId) || messageRows[0] || null,
    [messages, activeMessageId, messageRows]
  );

  const ticketRows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesQuery =
        !q ||
        ticket.requester.toLowerCase().includes(q) ||
        ticket.email.toLowerCase().includes(q) ||
        ticket.phone.toLowerCase().includes(q) ||
        ticket.subject.toLowerCase().includes(q) ||
        ticket.id.toLowerCase().includes(q);

      const matchesPriority = ticketPriorityFilter === 'All' || ticket.priority === ticketPriorityFilter;
      const matchesStatus = ticketStatusFilter === 'All' || ticket.status === ticketStatusFilter;

      return matchesQuery && matchesPriority && matchesStatus;
    });
  }, [tickets, query, ticketPriorityFilter, ticketStatusFilter]);

  const selectedTicket = ticketRows.find((ticket) => ticket.id === selectedTicketId) || ticketRows[0] || null;

  if (!moduleItem) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">Module not found</h1>
          <p className="text-sm sm:text-base text-surface-500">The requested module is not available in the sidebar configuration.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-admin-primary-600 text-white font-bold shadow-lg shadow-admin-primary-500/25 hover:bg-admin-primary-700 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const Icon = moduleItem.icon || LayoutDashboard;

  if (moduleSlug === 'announcement') {
    const openAnnouncementWorkspace = () => setAnnouncementWorkspaceOpen(true);
    const closeAnnouncementWorkspace = () => setAnnouncementWorkspaceOpen(false);

    const handlePublish = (event) => {
      event.preventDefault();
      setPublishedAnnouncement({
        ...announcementDraft,
        updatedAt: new Intl.DateTimeFormat([], {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date()),
      });
    };

    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">
            {moduleItem.sectionNumber} {moduleItem.sectionTitle}
          </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">{moduleItem.label}</h1>
            <p className="text-sm sm:text-base text-surface-500 max-w-2xl">{preset.subtitle}</p>
          </div>

          <button type="button" onClick={openAnnouncementWorkspace} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm text-sm font-medium text-surface-600 dark:text-surface-300 hover:border-admin-primary-300 hover:text-admin-primary-600 transition-colors">
            <Save size={16} className="text-admin-primary-500" />
            Announcement workspace
          </button>
        </div>

        <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-card space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Announcement Setup</p>
            <p className="text-sm text-surface-500">Control activation, colors, and message content before publishing the announcement.</p>
          </div>

          <form onSubmit={handlePublish} className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">Status</p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <label className="inline-flex items-center gap-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-3 py-2 text-sm text-surface-600 dark:text-surface-300">
                  <input
                    type="radio"
                    name="announcement-status"
                    checked={announcementDraft.isActive}
                    onChange={() => setAnnouncementDraft((previous) => ({ ...previous, isActive: true }))}
                    className="accent-admin-primary-600"
                  />
                  Active
                </label>
                <label className="inline-flex items-center gap-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-3 py-2 text-sm text-surface-600 dark:text-surface-300">
                  <input
                    type="radio"
                    name="announcement-status"
                    checked={!announcementDraft.isActive}
                    onChange={() => setAnnouncementDraft((previous) => ({ ...previous, isActive: false }))}
                    className="accent-admin-primary-600"
                  />
                  Inactive
                </label>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-surface-700 dark:text-surface-200 flex items-center gap-2">
                  <Palette size={15} />
                  Background color
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-3 py-2.5">
                  <input
                    type="color"
                    value={announcementDraft.backgroundColor}
                    onChange={(event) => setAnnouncementDraft((previous) => ({ ...previous, backgroundColor: event.target.value }))}
                    className="h-8 w-8 rounded border border-surface-200 bg-transparent"
                  />
                  <input
                    type="text"
                    value={announcementDraft.backgroundColor}
                    onChange={(event) => setAnnouncementDraft((previous) => ({ ...previous, backgroundColor: event.target.value }))}
                    className="w-full bg-transparent text-sm text-surface-700 dark:text-surface-200 focus:outline-none"
                  />
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-surface-700 dark:text-surface-200 flex items-center gap-2">
                  <Type size={15} />
                  Text color
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-3 py-2.5">
                  <input
                    type="color"
                    value={announcementDraft.textColor}
                    onChange={(event) => setAnnouncementDraft((previous) => ({ ...previous, textColor: event.target.value }))}
                    className="h-8 w-8 rounded border border-surface-200 bg-transparent"
                  />
                  <input
                    type="text"
                    value={announcementDraft.textColor}
                    onChange={(event) => setAnnouncementDraft((previous) => ({ ...previous, textColor: event.target.value }))}
                    className="w-full bg-transparent text-sm text-surface-700 dark:text-surface-200 focus:outline-none"
                  />
                </div>
              </label>
            </div>

            <label className="space-y-2 block">
              <span className="text-sm font-semibold text-surface-700 dark:text-surface-200 flex items-center gap-2">
                <Megaphone size={15} />
                Text
              </span>
              <textarea
                value={announcementDraft.text}
                onChange={(event) => setAnnouncementDraft((previous) => ({ ...previous, text: event.target.value }))}
                rows={4}
                className="w-full rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-200 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
              />
            </label>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-4">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-surface-400">Preview</p>
                <div
                  className="inline-flex items-center rounded-2xl px-4 py-3 text-sm font-medium"
                  style={{ backgroundColor: announcementDraft.backgroundColor, color: announcementDraft.textColor }}
                >
                  {announcementDraft.text}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${announcementDraft.isActive ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300' : 'bg-surface-100 text-surface-500 dark:bg-surface-700 dark:text-surface-300'}`}>
                  <CircleDot size={12} />
                  {announcementDraft.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-admin-primary-50 text-admin-primary-600 dark:bg-admin-primary-900/20 dark:text-admin-primary-300">
                  <Save size={12} />
                  Ready to publish
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Button type="submit" variant="primary" icon={Save}>
                Publish
              </Button>
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

        {announcementWorkspaceOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeAnnouncementWorkspace}>
            <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-700">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Announcement workspace</p>
                  <h3 className="mt-1 text-lg font-bold text-surface-900 dark:text-white">Live preview and publish state</h3>
                </div>
                <button type="button" onClick={closeAnnouncementWorkspace} className="rounded-xl px-3 py-2 text-sm font-semibold text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800">
                  Close
                </button>
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
                  <div
                    className="inline-flex items-center rounded-2xl px-4 py-3 text-sm font-medium"
                    style={{ backgroundColor: announcementDraft.backgroundColor, color: announcementDraft.textColor }}
                  >
                    {announcementDraft.text}
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={closeAnnouncementWorkspace}>Close</Button>
                  <Button type="button" variant="primary" icon={Save} onClick={handlePublish}>Publish Now</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (moduleSlug === 'message') {
    const openNewMessage = () => {
      setMessageModalMode('create');
      setMessageDraft({
        name: '',
        phone: '',
        email: '',
        subject: '',
        body: '',
        replied: false,
      });
      setActiveMessageId(null);
      setMessageModalOpen(true);
    };

    const openViewMessage = (row) => {
      setMessageModalMode('view');
      setActiveMessageId(row.id);
      setMessageDraft({
        name: row.name,
        phone: row.contact.phone,
        email: row.contact.email,
        subject: row.subject,
        body: row.subject,
        replied: row.replied,
      });
      setMessageModalOpen(true);
    };

    const openDeleteMessage = (row) => {
      setMessageModalMode('delete');
      setActiveMessageId(row.id);
      setMessageModalOpen(true);
    };

    const closeMessageModal = () => {
      setMessageModalOpen(false);
      setActiveMessageId(null);
    };

    const saveMessage = (event) => {
      event.preventDefault();

      const payload = {
        id: activeMessageId || `MSG-${Date.now().toString().slice(-4)}`,
        name: messageDraft.name.trim(),
        contact: {
          phone: messageDraft.phone.trim(),
          email: messageDraft.email.trim(),
        },
        subject: messageDraft.subject.trim(),
        time: new Intl.DateTimeFormat([], {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date()),
        replied: messageDraft.replied,
      };

      setMessages((previousMessages) => {
        if (activeMessageId && previousMessages.some((message) => message.id === activeMessageId)) {
          return previousMessages.map((message) => (message.id === activeMessageId ? payload : message));
        }

        return [payload, ...previousMessages];
      });

      closeMessageModal();
    };

    const confirmDeleteMessage = () => {
      if (!activeMessageId) return;
      setMessages((previousMessages) => previousMessages.filter((message) => message.id !== activeMessageId));
      closeMessageModal();
    };

    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">
              {moduleItem.sectionNumber} {moduleItem.sectionTitle}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">{moduleItem.label}</h1>
            <p className="text-sm sm:text-base text-surface-500 max-w-2xl">{preset.subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm text-sm font-medium text-surface-600 dark:text-surface-300">
              <MessageSquare size={16} className="text-admin-primary-500" />
              Customer messages
            </div>
            <button onClick={openNewMessage} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-admin-primary-600 text-white font-bold shadow-lg shadow-admin-primary-500/20 hover:bg-admin-primary-700 transition-colors">
              <Plus size={16} />
              New Message
            </button>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Total Messages</p>
            <p className="mt-3 text-3xl font-extrabold text-surface-900 dark:text-white">{messages.length}</p>
          </article>
          <article className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Replied</p>
            <p className="mt-3 text-3xl font-extrabold text-surface-900 dark:text-white">{messages.filter((row) => row.replied).length}</p>
          </article>
          <article className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Pending</p>
            <p className="mt-3 text-3xl font-extrabold text-surface-900 dark:text-white">{messages.filter((row) => !row.replied).length}</p>
          </article>
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
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by Name or Mobile No or Email"
                  className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 pl-10 pr-4 py-2.5 text-sm text-surface-700 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
                />
              </div>

              <select
                value={messageReplyFilter}
                onChange={(event) => setMessageReplyFilter(event.target.value)}
                className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
              >
                <option value="All">All Replies</option>
                <option value="Yes">Reply Status: Yes</option>
                <option value="No">Reply Status: No</option>
              </select>

              <Button variant="primary" icon={Filter} className="whitespace-nowrap">
                Filter
              </Button>
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
                {messageRows.map((row, index) => (
                  <tr key={row.id} className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-900/40 transition-colors">
                    <td className="px-5 py-4 text-surface-500 dark:text-surface-400">{index + 1}</td>
                    <td className="px-5 py-4 font-semibold text-surface-900 dark:text-white">{row.name}</td>
                    <td className="px-5 py-4 text-surface-600 dark:text-surface-300">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-2">
                          <Phone size={13} className="text-surface-400" />
                          {row.contact.phone}
                        </div>
                        <div className="inline-flex items-center gap-2 break-all">
                          <Mail size={13} className="text-surface-400" />
                          {row.contact.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-surface-700 dark:text-surface-200 max-w-[18rem]">{row.subject}</td>
                    <td className="px-5 py-4 text-surface-500 dark:text-surface-400 whitespace-nowrap">{row.time}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${row.replied ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300' : 'bg-admin-primary-50 text-admin-primary-600 dark:bg-admin-primary-900/20 dark:text-admin-primary-300'}`}>
                        {row.replied ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openViewMessage(row)} className="inline-flex items-center justify-center rounded-lg border border-admin-primary-200 text-admin-primary-600 hover:bg-admin-primary-50 dark:border-admin-primary-900/40 dark:text-admin-primary-300 dark:hover:bg-admin-primary-950/20 p-2 transition-colors" aria-label={`View ${row.name}`}>
                          <Eye size={15} />
                        </button>
                        <button onClick={() => openDeleteMessage(row)} className="inline-flex items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/20 p-2 transition-colors" aria-label={`Delete ${row.name}`}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {messageRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-14 text-center text-surface-500 dark:text-surface-400">
                      No customer messages match the current search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {messageModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeMessageModal}>
            <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-700">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Customer messages</p>
                  <h3 className="mt-1 text-lg font-bold text-surface-900 dark:text-white">
                    {messageModalMode === 'create' ? 'New Message' : messageModalMode === 'view' ? 'Message Details' : 'Delete Message'}
                  </h3>
                </div>
                <button type="button" onClick={closeMessageModal} className="rounded-xl px-3 py-2 text-sm font-semibold text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800">
                  Close
                </button>
              </div>

              {messageModalMode === 'delete' ? (
                <div className="px-6 py-6 space-y-5">
                  <p className="text-sm text-surface-600 dark:text-surface-300">
                    Delete message from <span className="font-semibold text-surface-900 dark:text-white">{activeMessage?.name || 'this customer'}</span>?
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={closeMessageModal}>Cancel</Button>
                    <Button type="button" variant="danger" icon={Trash2} onClick={confirmDeleteMessage}>Delete</Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={saveMessage} className="px-6 py-6 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Customer Name</span>
                      <input
                        value={messageDraft.name}
                        onChange={(event) => setMessageDraft((previous) => ({ ...previous, name: event.target.value }))}
                        required
                        disabled={messageModalMode === 'view'}
                        className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white disabled:opacity-70"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Mobile No</span>
                      <input
                        value={messageDraft.phone}
                        onChange={(event) => setMessageDraft((previous) => ({ ...previous, phone: event.target.value }))}
                        required
                        disabled={messageModalMode === 'view'}
                        className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white disabled:opacity-70"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Email</span>
                      <input
                        value={messageDraft.email}
                        onChange={(event) => setMessageDraft((previous) => ({ ...previous, email: event.target.value }))}
                        required
                        disabled={messageModalMode === 'view'}
                        className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white disabled:opacity-70"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Reply Status</span>
                      <select
                        value={String(messageDraft.replied)}
                        onChange={(event) => setMessageDraft((previous) => ({ ...previous, replied: event.target.value === 'true' }))}
                        disabled={messageModalMode === 'view'}
                        className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white disabled:opacity-70"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </label>
                  </div>

                  <label className="space-y-2 block">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Subject / Message</span>
                    <textarea
                      value={messageDraft.subject}
                      onChange={(event) => setMessageDraft((previous) => ({ ...previous, subject: event.target.value, body: event.target.value }))}
                      required
                      rows={5}
                      disabled={messageModalMode === 'view'}
                      className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white disabled:opacity-70"
                    />
                  </label>

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-surface-500 dark:text-surface-400">
                      {messageModalMode === 'create' ? 'Create and add this message to the table.' : 'View only mode.'}
                    </p>
                    <div className="flex gap-2">
                      <Button type="button" variant="secondary" onClick={closeMessageModal}>Close</Button>
                      {messageModalMode === 'create' && <Button type="submit" variant="primary" icon={Save}>Save Message</Button>}
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (moduleSlug === 'support-ticket') {
    const openNewTicket = () => {
      setTicketModalMode('create');
      setTicketDraft({
        requester: '',
        email: '',
        phone: '',
        subject: '',
        category: 'General',
        priority: 'Medium',
        status: 'Open',
        description: '',
        assignee: 'Support Queue',
      });
      setSelectedTicketId(null);
      setTicketModalOpen(true);
    };

    const openViewTicket = (ticket) => {
      setTicketModalMode('view');
      setSelectedTicketId(ticket.id);
      setTicketDraft({
        requester: ticket.requester,
        email: ticket.email,
        phone: ticket.phone,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        description: ticket.description,
        assignee: ticket.assignee,
      });
      setTicketModalOpen(true);
    };

    const closeTicketModal = () => {
      setTicketModalOpen(false);
      setTicketModalMode('create');
    };

    const saveTicket = (event) => {
      event.preventDefault();

      const payload = {
        id: selectedTicketId && tickets.some((ticket) => ticket.id === selectedTicketId) ? selectedTicketId : `TK-${Date.now().toString().slice(-4)}`,
        requester: ticketDraft.requester.trim(),
        email: ticketDraft.email.trim(),
        phone: ticketDraft.phone.trim(),
        subject: ticketDraft.subject.trim(),
        category: ticketDraft.category,
        priority: ticketDraft.priority,
        status: ticketDraft.status,
        updatedAt: new Intl.DateTimeFormat([], {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date()),
        assignee: ticketDraft.assignee.trim() || 'Support Queue',
        description: ticketDraft.description.trim(),
      };

      setTickets((previousTickets) => {
        if (selectedTicketId && previousTickets.some((ticket) => ticket.id === selectedTicketId)) {
          return previousTickets.map((ticket) => (ticket.id === selectedTicketId ? payload : ticket));
        }

        return [payload, ...previousTickets];
      });

      setSelectedTicketId(payload.id);
      closeTicketModal();
    };

    const updateTicketStatus = (status) => {
      if (!selectedTicket?.id) return;
      setTickets((previousTickets) => previousTickets.map((ticket) => (
        ticket.id === selectedTicket.id
          ? { ...ticket, status, updatedAt: new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()) }
          : ticket
      )));
    };

    const supportStats = [
      { label: 'Open Tickets', value: tickets.filter((ticket) => ticket.status === 'Open').length, icon: Ticket, tone: 'primary' },
      { label: 'In Progress', value: tickets.filter((ticket) => ticket.status === 'In Progress').length, icon: Clock3, tone: 'warning' },
      { label: 'Resolved', value: tickets.filter((ticket) => ticket.status === 'Resolved').length, icon: CheckCircle2, tone: 'success' },
      { label: 'Pending SLA', value: tickets.filter((ticket) => ticket.status === 'Pending SLA').length, icon: AlertTriangle, tone: 'danger' },
    ];

    const statusBadge = (status) => {
      if (status === 'Resolved') return 'success';
      if (status === 'In Progress') return 'warning';
      if (status === 'Pending SLA') return 'danger';
      return 'primary';
    };

    const priorityBadge = (priority) => {
      if (priority === 'High') return 'danger';
      if (priority === 'Medium') return 'warning';
      return 'info';
    };

    const handleReply = (event) => {
      event.preventDefault();
      if (!ticketReply.trim()) return;
      updateTicketStatus('In Progress');
      setTicketReply('');
    };

    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid gap-4 xl:grid-cols-[16rem_minmax(0,1fr)] xl:items-start">
          <div className="space-y-2 max-w-[16rem] shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">
              {moduleItem.sectionNumber} {moduleItem.sectionTitle}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight leading-tight">{moduleItem.label}</h1>
            <p className="text-sm sm:text-base text-surface-500 leading-6">{preset.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 xl:justify-end xl:self-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm text-sm font-medium text-surface-600 dark:text-surface-300">
              <FolderOpen size={16} className="text-admin-primary-500" />
              Ticket workspace
            </div>
            <Button type="button" variant="primary" icon={Plus} onClick={openNewTicket}>
              New Ticket
            </Button>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {supportStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article key={stat.label} className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700">
                    <Icon size={18} className="text-admin-primary-600" />
                  </div>
                  <Badge variant={stat.tone}>{stat.label}</Badge>
                </div>
                <p className="mt-4 text-3xl font-extrabold text-surface-900 dark:text-white">{stat.value}</p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr] items-start">
          <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl shadow-card overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-surface-100 dark:border-surface-700 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="space-y-1.5 max-w-[16rem] shrink-0">
                  <h2 className="text-lg font-bold text-surface-900 dark:text-white leading-tight">Support Ticket Queue</h2>
                  <p className="text-sm text-surface-500 leading-6">Search, filter, and triage incoming support tickets.</p>
                </div>

                <div className="flex flex-col gap-3 w-full xl:flex-row xl:items-center xl:justify-end xl:flex-nowrap">
                  <div className="relative w-full xl:min-w-[22rem] xl:max-w-[32rem] xl:flex-[1.6]">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search ticket, requester, email, phone"
                      className="w-full rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 pl-11 pr-4 py-3 text-sm text-surface-700 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
                    />
                  </div>

                  <select
                    value={ticketPriorityFilter}
                    onChange={(event) => setTicketPriorityFilter(event.target.value)}
                    className="w-full xl:w-[12rem] rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
                  >
                    <option value="All">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>

                  <select
                    value={ticketStatusFilter}
                    onChange={(event) => setTicketStatusFilter(event.target.value)}
                    className="w-full xl:w-[12rem] rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
                  >
                    <option value="All">All Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Pending SLA">Pending SLA</option>
                  </select>

                  <Button variant="primary" icon={Filter} className="whitespace-nowrap justify-center xl:w-auto w-full rounded-2xl">
                    Filter
                  </Button>
                </div>
              </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-50 dark:bg-surface-900/60 border-b border-surface-200 dark:border-surface-700">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Ticket ID</th>
                    <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Requester</th>
                    <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Subject</th>
                    <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Priority</th>
                    <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Status</th>
                    <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Updated</th>
                    <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-surface-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketRows.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`border-b border-surface-100 dark:border-surface-800 cursor-pointer transition-colors hover:bg-surface-50 dark:hover:bg-surface-900/40 ${selectedTicket?.id === ticket.id ? 'bg-admin-primary-50/60 dark:bg-admin-primary-900/10' : ''}`}
                    >
                      <td className="px-5 py-4 font-semibold text-surface-900 dark:text-white">{ticket.id}</td>
                      <td className="px-5 py-4 text-surface-600 dark:text-surface-300">
                        <div className="space-y-1">
                          <p className="font-semibold text-surface-900 dark:text-white">{ticket.requester}</p>
                          <p className="text-xs text-surface-500">{ticket.category}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-surface-700 dark:text-surface-200 max-w-[20rem]">{ticket.subject}</td>
                      <td className="px-5 py-4"><Badge variant={priorityBadge(ticket.priority)}>{ticket.priority}</Badge></td>
                      <td className="px-5 py-4"><Badge variant={statusBadge(ticket.status)}>{ticket.status}</Badge></td>
                      <td className="px-5 py-4 text-surface-500 dark:text-surface-400 whitespace-nowrap">{ticket.updatedAt}</td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openViewTicket(ticket);
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-admin-primary-200 text-admin-primary-600 hover:bg-admin-primary-50 dark:border-admin-primary-900/40 dark:text-admin-primary-300 dark:hover:bg-admin-primary-950/20 px-3 py-2 transition-colors"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}

                  {ticketRows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-14 text-center text-surface-500 dark:text-surface-400">
                        No tickets match the current search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="space-y-6">
            <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Selected ticket</p>
                  <h3 className="mt-2 text-lg font-bold text-surface-900 dark:text-white">{selectedTicket?.id || 'No ticket selected'}</h3>
                </div>
                {selectedTicket && <Badge variant={statusBadge(selectedTicket.status)}>{selectedTicket.status}</Badge>}
              </div>

              {selectedTicket ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4 space-y-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-surface-400">Requester</p>
                      <p className="mt-1 font-semibold text-surface-900 dark:text-white">{selectedTicket.requester}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm text-surface-600 dark:text-surface-300">
                      <div className="inline-flex items-center gap-2"><Mail size={14} className="text-surface-400" />{selectedTicket.email}</div>
                      <div className="inline-flex items-center gap-2"><Phone size={14} className="text-surface-400" />{selectedTicket.phone}</div>
                      <div className="inline-flex items-center gap-2"><UserRound size={14} className="text-surface-400" />Assigned to {selectedTicket.assignee}</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4 space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-surface-400">Subject</p>
                    <p className="font-semibold text-surface-900 dark:text-white">{selectedTicket.subject}</p>
                    <p className="text-sm text-surface-500 leading-6">{selectedTicket.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4">
                      <p className="text-xs text-surface-500">Priority</p>
                      <p className="mt-1 font-semibold text-surface-900 dark:text-white">{selectedTicket.priority}</p>
                    </div>
                    <div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-4">
                      <p className="text-xs text-surface-500">Category</p>
                      <p className="mt-1 font-semibold text-surface-900 dark:text-white">{selectedTicket.category}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" icon={Clock3}>Snooze</Button>
                    <Button variant="secondary" icon={CheckCircle2}>Resolve</Button>
                    <Button variant="primary" icon={Send}>Reply</Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-surface-500">Select a ticket to view details.</p>
              )}
            </section>

            <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-5 shadow-card space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Internal reply</p>
                <h3 className="mt-2 text-lg font-bold text-surface-900 dark:text-white">Add response note</h3>
              </div>

              <form onSubmit={handleReply} className="space-y-4">
                <textarea
                  value={ticketReply}
                  onChange={(event) => setTicketReply(event.target.value)}
                  rows={5}
                  placeholder="Write a reply or internal note..."
                  className="w-full rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 px-4 py-3 text-sm text-surface-700 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
                />
                <div className="flex items-center justify-end gap-2">
                  <Button type="submit" variant="primary" icon={Send}>Send Reply</Button>
                </div>
              </form>
            </section>
          </aside>
        </section>

        {ticketModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeTicketModal}>
            <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-700">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Support ticket workspace</p>
                  <h3 className="mt-1 text-lg font-bold text-surface-900 dark:text-white">
                    {ticketModalMode === 'create' ? 'New Ticket' : 'Ticket Details'}
                  </h3>
                </div>
                <button type="button" onClick={closeTicketModal} className="rounded-xl px-3 py-2 text-sm font-semibold text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800">
                  Close
                </button>
              </div>

              {ticketModalMode === 'view' ? (
                <div className="px-6 py-6 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2 text-sm">
                    <div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 p-4">
                      <p className="text-xs text-surface-500">Requester</p>
                      <p className="mt-1 font-semibold text-surface-900 dark:text-white">{ticketDraft.requester}</p>
                    </div>
                    <div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 p-4">
                      <p className="text-xs text-surface-500">Status</p>
                      <p className="mt-1 font-semibold text-surface-900 dark:text-white">{ticketDraft.status}</p>
                    </div>
                    <div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 p-4">
                      <p className="text-xs text-surface-500">Priority</p>
                      <p className="mt-1 font-semibold text-surface-900 dark:text-white">{ticketDraft.priority}</p>
                    </div>
                    <div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 p-4">
                      <p className="text-xs text-surface-500">Assignee</p>
                      <p className="mt-1 font-semibold text-surface-900 dark:text-white">{ticketDraft.assignee}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 p-4 space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-surface-400">Description</p>
                    <p className="text-sm text-surface-600 dark:text-surface-300 leading-6">{ticketDraft.description}</p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={closeTicketModal}>Close</Button>
                    <Button type="button" variant="primary" icon={CheckCircle2} onClick={() => { updateTicketStatus('Resolved'); closeTicketModal(); }}>
                      Resolve
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={saveTicket} className="px-6 py-6 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2"><span className="text-sm font-medium text-surface-700 dark:text-surface-300">Requester</span><input value={ticketDraft.requester} onChange={(event) => setTicketDraft((previous) => ({ ...previous, requester: event.target.value }))} required className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white" /></label>
                    <label className="space-y-2"><span className="text-sm font-medium text-surface-700 dark:text-surface-300">Phone</span><input value={ticketDraft.phone} onChange={(event) => setTicketDraft((previous) => ({ ...previous, phone: event.target.value }))} required className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white" /></label>
                    <label className="space-y-2"><span className="text-sm font-medium text-surface-700 dark:text-surface-300">Email</span><input value={ticketDraft.email} onChange={(event) => setTicketDraft((previous) => ({ ...previous, email: event.target.value }))} required className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white" /></label>
                    <label className="space-y-2"><span className="text-sm font-medium text-surface-700 dark:text-surface-300">Category</span><input value={ticketDraft.category} onChange={(event) => setTicketDraft((previous) => ({ ...previous, category: event.target.value }))} required className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white" /></label>
                    <label className="space-y-2"><span className="text-sm font-medium text-surface-700 dark:text-surface-300">Priority</span><select value={ticketDraft.priority} onChange={(event) => setTicketDraft((previous) => ({ ...previous, priority: event.target.value }))} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white"><option>High</option><option>Medium</option><option>Low</option></select></label>
                    <label className="space-y-2"><span className="text-sm font-medium text-surface-700 dark:text-surface-300">Status</span><select value={ticketDraft.status} onChange={(event) => setTicketDraft((previous) => ({ ...previous, status: event.target.value }))} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white"><option>Open</option><option>In Progress</option><option>Resolved</option><option>Pending SLA</option></select></label>
                    <label className="space-y-2"><span className="text-sm font-medium text-surface-700 dark:text-surface-300">Assignee</span><input value={ticketDraft.assignee} onChange={(event) => setTicketDraft((previous) => ({ ...previous, assignee: event.target.value }))} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white" /></label>
                  </div>

                  <label className="space-y-2 block">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Subject</span>
                    <input value={ticketDraft.subject} onChange={(event) => setTicketDraft((previous) => ({ ...previous, subject: event.target.value }))} required className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white" />
                  </label>

                  <label className="space-y-2 block">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Description</span>
                    <textarea value={ticketDraft.description} onChange={(event) => setTicketDraft((previous) => ({ ...previous, description: event.target.value }))} rows={5} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white" />
                  </label>

                  <div className="flex items-center justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={closeTicketModal}>Close</Button>
                    <Button type="submit" variant="primary" icon={Save}>Save Ticket</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-primary-50 dark:bg-admin-primary-900/20 text-admin-primary-600 text-[10px] font-black tracking-[0.3em] uppercase">
            {moduleItem.sectionNumber} {moduleItem.sectionTitle}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">{moduleItem.label}</h1>
            <p className="text-sm sm:text-base text-surface-500 max-w-2xl">{preset.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-admin-primary-600 text-white font-bold shadow-lg shadow-admin-primary-500/20 hover:bg-admin-primary-700 transition-colors">
            <Plus size={16} />
            Create New
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-200 font-bold hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
            <Download size={16} />
            Export
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-200 font-bold hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {preset.stats.map((stat) => (
          <article key={stat.label} className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-surface-400">{stat.label}</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusPalette[stat.tone]}`}>
                +{(hashValue(moduleSlug + stat.label) % 13) + 1}%
              </span>
            </div>
            <p className="text-3xl font-extrabold text-surface-900 dark:text-white">{stat.value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-admin-primary-600 text-white flex items-center justify-center shadow-lg shadow-admin-primary-500/25">
                <Icon size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.35em]">Dedicated Workspace</p>
                <h2 className="text-xl font-extrabold text-surface-900 dark:text-white">{moduleItem.label} Console</h2>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm font-semibold text-surface-600 dark:text-surface-300">
              <input
                type="checkbox"
                checked={automationOn}
                onChange={(e) => setAutomationOn(e.target.checked)}
                className="w-4 h-4 rounded accent-admin-primary-600"
              />
              Automation Mode
            </label>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search records, owners, status..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-admin-primary-500/20"
            />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-surface-400 mb-3">Features</p>
            <div className="flex flex-wrap gap-2">
              {preset.chips.map((chip) => (
                <span key={chip} className="px-3 py-1.5 rounded-full text-xs font-bold bg-admin-primary-50 dark:bg-admin-primary-900/25 text-admin-primary-600">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 dark:bg-surface-900/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-surface-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-surface-500">Owner</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-surface-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-surface-500">Updated</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`${row.name}-${row.updated}`} className="border-t border-surface-100 dark:border-surface-800">
                    <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{row.name}</td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-300">{row.owner}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-200">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{row.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="bg-gradient-to-br from-surface-900 to-surface-800 text-white rounded-3xl p-6 shadow-card">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/60 mb-3">Smart Assistant</p>
            <h3 className="text-xl font-extrabold mb-3">Operational Suggestions</h3>
            <p className="text-sm text-white/70 leading-6 mb-4">
              Dedicated module experience is active with automation support and performance-first controls.
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <Sparkles size={15} />
              Next-level workflow enabled
            </div>
          </section>

          <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-6 shadow-card">
            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-surface-400 mb-4">Checklist</h3>
            <div className="space-y-3">
              {preset.checklist.map((item, idx) => (
                <div key={item} className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-admin-primary-100 text-admin-primary-600' : 'bg-surface-100 dark:bg-surface-700 text-surface-500'}`}>
                    {idx === 0 ? <Check size={12} /> : <Clock3 size={12} />}
                  </div>
                  <p className="text-sm text-surface-700 dark:text-surface-200 leading-6">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-6 shadow-card">
            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-surface-400 mb-4">Module Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-surface-500">Number</span>
                <span className="font-bold text-surface-900 dark:text-white">{moduleItem.number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-500">Section</span>
                <span className="font-bold text-surface-900 dark:text-white">{moduleItem.sectionTitle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-500">Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                  <CircleCheck size={14} /> Active
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <section className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-3xl p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-surface-900 dark:text-white">Performance Snapshot</h3>
            <p className="text-sm text-surface-500">Current module progression and execution health.</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-200 dark:border-surface-700 text-sm font-bold text-surface-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
            <ChartNoAxesColumn size={16} />
            Open Analytics
          </button>
        </div>

        <div className="space-y-3">
          {preset.stats.slice(0, 3).map((stat, idx) => {
            const progress = `${55 + (hashValue(stat.label + idx + moduleSlug) % 35)}%`;
            return (
              <div key={stat.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-semibold text-surface-700 dark:text-surface-200">{stat.label}</span>
                  <span className="text-surface-500">{progress}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-100 dark:bg-surface-700 overflow-hidden">
                  <div className="h-full rounded-full bg-admin-primary-600" style={{ width: progress }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ModulePage;
