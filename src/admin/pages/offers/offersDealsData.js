const hashValue = (str = '') =>
  str.split('').reduce((accumulator, character, index) => accumulator + character.charCodeAt(0) * (index + 1), 0);

const buildRows = (prefix, slug, statuses, scopes) => {
  const seed = hashValue(slug);

  return Array.from({ length: 8 }).map((_, index) => {
    const status = statuses[(seed + index) % statuses.length];
    const scope = scopes[(seed + index * 2) % scopes.length];
    const windowStart = ((seed + index * 3) % 20) + 1;
    const windowEnd = windowStart + 5 + ((seed + index) % 6);

    return {
      id: `${prefix}-${String(seed + index).slice(-4)}`,
      name: `${prefix} ${index + 1}`,
      scope,
      status,
      window: `Apr ${windowStart} - Apr ${windowEnd}, 2026`,
      owner: ['Growth Team', 'Campaign Ops', 'Merchandising', 'Lifecycle Team'][(seed + index) % 4],
      updated: `${((seed + index * 4) % 28) + 1} Apr 2026`,
      impact: `${((seed + index * 7) % 80) + 18}% lift`,
      note: ['High reach', 'Targeted burst', 'Inventory-led', 'Retention play'][(seed + index) % 4],
    };
  });
};

const statusVariant = {
  Active: 'success',
  Scheduled: 'info',
  Paused: 'warning',
  Draft: 'primary',
  Expired: 'danger',
};

const presets = {
  'offers-and-deals': {
    title: 'Offers and Deals',
    subtitle: 'Centralize every promotional motion with one overview for campaigns, launch windows, and execution health.',
    accent: 'primary',
    chips: ['Campaign Library', 'Launch Calendar', 'Inventory Guard', 'Audience Targeting', 'Performance Tracking'],
    stats: [
      { label: 'Active Campaigns', value: 12, tone: 'success' },
      { label: 'Scheduled Launches', value: 5, tone: 'info' },
      { label: 'Avg. Lift', value: '28%', tone: 'primary' },
      { label: 'At Risk', value: 2, tone: 'danger' },
    ],
    checklist: ['Review live campaign windows', 'Validate discount caps', 'Align inventory thresholds', 'Publish the next launch batch'],
    rows: buildRows('Campaign', 'offers-and-deals', ['Active', 'Scheduled', 'Paused', 'Draft'], ['Seasonal push', 'Retention offer', 'Category promo', 'Member exclusive']),
  },
  coupon: {
    title: 'Coupon',
    subtitle: 'Issue, validate, and monitor coupon codes with clear limits, usage rules, and fraud-safe controls.',
    accent: 'primary',
    chips: ['Code Builder', 'Usage Limits', 'Eligibility Rules', 'Stacking Control', 'Abuse Guard'],
    stats: [
      { label: 'Live Codes', value: 24, tone: 'success' },
      { label: 'Redemptions', value: '1.8K', tone: 'primary' },
      { label: 'Saved Revenue', value: '$42K', tone: 'warning' },
      { label: 'Expired', value: 6, tone: 'danger' },
    ],
    checklist: ['Check redemption limits', 'Review category eligibility', 'Audit stacking rules', 'Schedule the next code drop'],
    rows: buildRows('Coupon', 'coupon', ['Active', 'Scheduled', 'Paused', 'Expired'], ['New users', 'Returning users', 'VIP members', 'Cart recovery']),
  },
  'flash-deals': {
    title: 'Flash Deals',
    subtitle: 'Run time-bound bursts with countdown pressure, stock-aware controls, and real-time execution monitoring.',
    accent: 'warning',
    chips: ['Countdown', 'Stock Lock', 'Traffic Shield', 'Timer Rules', 'Live Metrics'],
    stats: [
      { label: 'Live Bursts', value: 8, tone: 'warning' },
      { label: 'Peak CTR', value: '6.4%', tone: 'success' },
      { label: 'Units Locked', value: '920', tone: 'primary' },
      { label: 'Ending Soon', value: 3, tone: 'danger' },
    ],
    checklist: ['Confirm stock reservations', 'Validate countdown clocks', 'Throttle paid traffic', 'Watch for sellout signals'],
    rows: buildRows('Flash', 'flash-deals', ['Active', 'Scheduled', 'Paused', 'Draft'], ['Hero takeover', 'App burst', 'Category strip', 'Push notification']),
  },
  'deal-of-the-day': {
    title: 'Deal of the Day',
    subtitle: 'Operate the daily flagship offer with clean handoff rules and a predictable rhythm for merchandising.',
    accent: 'success',
    chips: ['Daily Rotation', 'Hero Placement', 'Pacing', 'Budget Guard', 'Merchandising Slot'],
    stats: [
      { label: 'Today Live', value: 1, tone: 'success' },
      { label: 'Clicks', value: '3.2K', tone: 'primary' },
      { label: 'Revenue', value: '$18K', tone: 'warning' },
      { label: 'Tomorrow Ready', value: 2, tone: 'info' },
    ],
    checklist: ['Lock today’s hero slot', 'Prepare tomorrow’s creative', 'Review pacing targets', 'Confirm budget carryover'],
    rows: buildRows('Deal', 'deal-of-the-day', ['Active', 'Scheduled', 'Paused', 'Draft'], ['Hero slot', 'Homepage card', 'App banner', 'Email highlight']),
  },
  'featured-deal': {
    title: 'Featured Deal',
    subtitle: 'Highlight premium bundles and high-value promos with elevated placement and richer creative storytelling.',
    accent: 'primary',
    chips: ['Premium Placement', 'Creative Assets', 'Audience Targeting', 'Publish Window', 'Reporting'],
    stats: [
      { label: 'Featured Now', value: 4, tone: 'primary' },
      { label: 'Engagement', value: '4.8K', tone: 'success' },
      { label: 'Bundle Value', value: '$61K', tone: 'warning' },
      { label: 'Needs Refresh', value: 1, tone: 'danger' },
    ],
    checklist: ['Review flagship assets', 'Align upsell inventory', 'Confirm premium slotting', 'Refresh stale promos'],
    rows: buildRows('Feature', 'featured-deal', ['Active', 'Scheduled', 'Paused', 'Draft'], ['Homepage hero', 'Category hero', 'Member spotlight', 'App takeover']),
  },
  'clearance-sale': {
    title: 'Clearance Sale',
    subtitle: 'Move slow inventory faster with markdown logic, floor-price control, and clear campaign timing.',
    accent: 'danger',
    chips: ['Markdown Ladder', 'Aging Stock', 'Floor Price', 'Sell-through', 'Exit Plan'],
    stats: [
      { label: 'Markdowns', value: 9, tone: 'danger' },
      { label: 'Stock Cleared', value: '74%', tone: 'success' },
      { label: 'Recovery', value: '$31K', tone: 'primary' },
      { label: 'Urgent', value: 2, tone: 'warning' },
    ],
    checklist: ['Check aging inventory', 'Validate markdown floor', 'Route clearance slots', 'Stop expired promos'],
    rows: buildRows('Clearance', 'clearance-sale', ['Active', 'Scheduled', 'Paused', 'Draft', 'Expired'], ['Warehouse lot', 'Seasonal exit', 'Category cleanup', 'Last chance']),
  },
};

export const getOffersDealsPreset = (moduleKey) => presets[moduleKey] || presets['offers-and-deals'];

export const offersDealsStatusVariant = statusVariant;
