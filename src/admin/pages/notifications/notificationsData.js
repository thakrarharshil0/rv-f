const hashValue = (str = '') =>
  str.split('').reduce((accumulator, character, index) => accumulator + character.charCodeAt(0) * (index + 1), 0);

const buildRows = (prefix, slug, channels, statuses) => {
  const seed = hashValue(slug);

  return Array.from({ length: 8 }).map((_, index) => ({
    id: `${prefix.slice(0, 3).toUpperCase()}-${String(seed + index).slice(-4)}`,
    title: `${prefix} ${index + 1}`,
    channel: channels[(seed + index) % channels.length],
    audience: ['All Users', 'New Users', 'Returning Users', 'VIP Users'][(seed + index * 2) % 4],
    status: statuses[(seed + index) % statuses.length],
    schedule: `Apr ${((seed + index * 3) % 20) + 8}, 2026`,
    owner: ['Comms Team', 'Lifecycle Team', 'CRM Ops', 'Growth Team'][(seed + index) % 4],
    ctr: `${((seed + index * 7) % 9) + 1}.${(seed + index) % 10}%`,
  }));
};

const presets = {
  notifications: {
    title: 'Notifications',
    subtitle: 'Manage multi-channel notification operations, scheduling, and delivery performance in one place.',
    chips: ['Composer', 'Audience Segments', 'Templates', 'Schedules', 'Deliverability'],
    stats: [
      { label: 'Queued', value: 18 },
      { label: 'Sent Today', value: 42 },
      { label: 'Avg CTR', value: '4.2%' },
      { label: 'Failed', value: 3 },
    ],
    rows: buildRows('Notification', 'notifications', ['Push', 'Email', 'SMS', 'In-App'], ['Active', 'Scheduled', 'Paused', 'Draft']),
  },
  'send-notification': {
    title: 'Send Notification',
    subtitle: 'Compose and launch targeted announcements with audience-aware controls and timing precision.',
    chips: ['Campaign Drafts', 'Audience Preview', 'Schedule', 'A/B Variant', 'Delivery Logs'],
    stats: [
      { label: 'Drafts', value: 11 },
      { label: 'Scheduled', value: 9 },
      { label: 'Open Rate', value: '32%' },
      { label: 'Pending Approval', value: 2 },
    ],
    rows: buildRows('Send Notification', 'send-notification', ['Push', 'Email', 'In-App'], ['Scheduled', 'Draft', 'Active', 'Paused']),
  },
  'push-notifications-setup': {
    title: 'Push Notifications Setup',
    subtitle: 'Configure push delivery settings, payload standards, retries, and provider readiness.',
    chips: ['Providers', 'Payload Rules', 'Retry Policy', 'Token Health', 'Monitoring'],
    stats: [
      { label: 'Providers', value: 3 },
      { label: 'Healthy Tokens', value: '98.3%' },
      { label: 'Retries', value: 14 },
      { label: 'Alerts', value: 1 },
    ],
    rows: buildRows('Push Setup', 'push-notifications-setup', ['Android Push', 'iOS Push', 'Web Push'], ['Active', 'Scheduled', 'Paused', 'Draft']),
  },
};

export const getNotificationPreset = (moduleKey) => presets[moduleKey] || presets.notifications;

export const notificationStatusVariant = {
  Active: 'success',
  Scheduled: 'info',
  Paused: 'warning',
  Draft: 'primary',
};
