export const refundRequests = [
  {
    refundId: '#RFD-1001',
    orderId: '#ORD-001823',
    customer: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    requestedOn: '2026-04-01',
    amount: 1899,
    reason: 'Damaged product received',
    paymentMethod: 'UPI',
    priority: 'High',
    status: 'Pending',
    assignee: 'Priya S.',
  },
  {
    refundId: '#RFD-1002',
    orderId: '#ORD-001820',
    customer: 'James Taylor',
    email: 'james.taylor@email.com',
    requestedOn: '2026-03-30',
    amount: 799,
    reason: 'Wrong size delivered',
    paymentMethod: 'Credit Card',
    priority: 'Medium',
    status: 'Approved',
    assignee: 'Rohan P.',
  },
  {
    refundId: '#RFD-1003',
    orderId: '#ORD-001819',
    customer: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    requestedOn: '2026-03-29',
    amount: 3499,
    reason: 'Product not as described',
    paymentMethod: 'Net Banking',
    priority: 'High',
    status: 'Refunded',
    assignee: 'Maya K.',
  },
  {
    refundId: '#RFD-1004',
    orderId: '#ORD-001816',
    customer: 'David Brown',
    email: 'david.b@email.com',
    requestedOn: '2026-03-28',
    amount: 4599,
    reason: 'Duplicate payment issue',
    paymentMethod: 'Credit Card',
    priority: 'Low',
    status: 'Rejected',
    assignee: 'Aman V.',
  },
  {
    refundId: '#RFD-1005',
    orderId: '#ORD-001815',
    customer: 'Jennifer Lee',
    email: 'jennifer.l@email.com',
    requestedOn: '2026-03-27',
    amount: 1299,
    reason: 'Late delivery',
    paymentMethod: 'UPI',
    priority: 'Medium',
    status: 'Pending',
    assignee: 'Priya S.',
  },
  {
    refundId: '#RFD-1006',
    orderId: '#ORD-001814',
    customer: 'Christopher Harris',
    email: 'chris.h@email.com',
    requestedOn: '2026-03-26',
    amount: 2199,
    reason: 'Incomplete package',
    paymentMethod: 'Debit Card',
    priority: 'High',
    status: 'Approved',
    assignee: 'Rohan P.',
  },
  {
    refundId: '#RFD-1007',
    orderId: '#ORD-001822',
    customer: 'Michael Chen',
    email: 'michael.chen@email.com',
    requestedOn: '2026-03-25',
    amount: 999,
    reason: 'Defective accessory',
    paymentMethod: 'PayPal',
    priority: 'Low',
    status: 'Refunded',
    assignee: 'Maya K.',
  },
  {
    refundId: '#RFD-1008',
    orderId: '#ORD-001821',
    customer: 'Emma Williams',
    email: 'emma.w@email.com',
    requestedOn: '2026-03-24',
    amount: 1599,
    reason: 'Used item delivered',
    paymentMethod: 'Debit Card',
    priority: 'High',
    status: 'Rejected',
    assignee: 'Aman V.',
  },
];

export const normalizeRefundStatus = (status = '') => String(status).toLowerCase().trim();

export const getRefundsByStatus = (status, refunds = refundRequests) => {
  if (!status || status === 'all') return refunds;
  const target = normalizeRefundStatus(status);
  return refunds.filter((refund) => normalizeRefundStatus(refund.status) === target);
};

export const searchRefunds = (query, refunds = refundRequests) => {
  if (!query) return refunds;
  const lowerQuery = query.toLowerCase();
  return refunds.filter(
    (refund) =>
      refund.refundId.toLowerCase().includes(lowerQuery) ||
      refund.orderId.toLowerCase().includes(lowerQuery) ||
      refund.customer.toLowerCase().includes(lowerQuery) ||
      refund.reason.toLowerCase().includes(lowerQuery)
  );
};
