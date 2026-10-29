export const ordersData = [
  {
    orderId: '#ORD-001823',
    customer: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0123',
    date: '2024-04-12',
    amount: 4299,
    payment: 'Credit Card',
    paymentStatus: 'Paid',
    status: 'Delivered',
    address: '123 Oak Street, Apt 4B',
    city: 'New York',
    zip: '10001',
    subtotal: 3999,
    shipping: 200,
    tax: 100,
    items: [
      { name: 'Premium Yoga Mat', quantity: 2, price: 1999 },
      { name: 'Resistance Bands Set', quantity: 1, price: 999 },
    ],
    timeline: [
      { title: 'Order Placed', timestamp: 'Apr 12, 2024 - 10:30 AM' },
      { title: 'Order Confirmed', timestamp: 'Apr 12, 2024 - 10:45 AM' },
      { title: 'Packaging Started', timestamp: 'Apr 13, 2024 - 9:00 AM' },
      { title: 'Out for Delivery', timestamp: 'Apr 14, 2024 - 8:30 AM' },
      { title: 'Delivered', timestamp: 'Apr 15, 2024 - 4:20 PM' },
    ],
  },
  {
    orderId: '#ORD-001822',
    customer: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1-555-0124',
    date: '2024-04-11',
    amount: 2199,
    payment: 'PayPal',
    paymentStatus: 'Paid',
    status: 'Confirmed',
    address: '456 Maple Ave, Suite 200',
    city: 'San Francisco',
    zip: '94102',
    subtotal: 1999,
    shipping: 150,
    tax: 50,
    items: [
      { name: 'Smart Watch Pro', quantity: 1, price: 1999 },
    ],
    timeline: [
      { title: 'Order Placed', timestamp: 'Apr 11, 2024 - 2:15 PM' },
      { title: 'Order Confirmed', timestamp: 'Apr 11, 2024 - 2:30 PM' },
    ],
  },
  {
    orderId: '#ORD-001821',
    customer: 'Emma Williams',
    email: 'emma.w@email.com',
    phone: '+1-555-0125',
    date: '2024-04-10',
    amount: 5899,
    payment: 'Debit Card',
    paymentStatus: 'Unpaid',
    status: 'Pending',
    address: '789 Pine Road',
    city: 'Los Angeles',
    zip: '90001',
    subtotal: 5499,
    shipping: 300,
    tax: 100,
    items: [
      { name: 'Home Gym Bundle', quantity: 1, price: 3999 },
      { name: 'Treadmill Pro', quantity: 1, price: 1500 },
    ],
    timeline: [
      { title: 'Order Placed', timestamp: 'Apr 10, 2024 - 11:45 AM' },
    ],
  },
  {
    orderId: '#ORD-001820',
    customer: 'James Taylor',
    email: 'james.taylor@email.com',
    phone: '+1-555-0126',
    date: '2024-04-09',
    amount: 1899,
    payment: 'Apple Pay',
    paymentStatus: 'Paid',
    status: 'Packaging',
    address: '321 Elm Street',
    city: 'Chicago',
    zip: '60601',
    subtotal: 1799,
    shipping: 100,
    tax: 0,
    items: [
      { name: 'Dumbbells Set', quantity: 1, price: 1799 },
    ],
    timeline: [
      { title: 'Order Placed', timestamp: 'Apr 09, 2024 - 8:20 AM' },
      { title: 'Order Confirmed', timestamp: 'Apr 09, 2024 - 8:35 AM' },
      { title: 'Packaging Started', timestamp: 'Apr 09, 2024 - 2:00 PM' },
    ],
  },
  {
    orderId: '#ORD-001819',
    customer: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    phone: '+1-555-0127',
    date: '2024-04-08',
    amount: 3499,
    payment: 'Google Pay',
    paymentStatus: 'Paid',
    status: 'Out for Delivery',
    address: '999 Birch Lane',
    city: 'Houston',
    zip: '77001',
    subtotal: 3299,
    shipping: 200,
    tax: 0,
    items: [
      { name: 'Elliptical Machine', quantity: 1, price: 3299 },
    ],
    timeline: [
      { title: 'Order Placed', timestamp: 'Apr 08, 2024 - 3:45 PM' },
      { title: 'Order Confirmed', timestamp: 'Apr 08, 2024 - 4:00 PM' },
      { title: 'Packaging Started', timestamp: 'Apr 09, 2024 - 10:00 AM' },
      { title: 'Out for Delivery', timestamp: 'Apr 10, 2024 - 9:30 AM' },
    ],
  },
  {
    orderId: '#ORD-001818',
    customer: 'Robert Martinez',
    email: 'robert.m@email.com',
    phone: '+1-555-0128',
    date: '2024-04-07',
    amount: 899,
    payment: 'Credit Card',
    paymentStatus: 'Paid',
    status: 'Returned',
    address: '654 Cedar Lane',
    city: 'Phoenix',
    zip: '85001',
    subtotal: 799,
    shipping: 100,
    tax: 0,
    items: [
      { name: 'Yoga Blocks', quantity: 3, price: 799 },
    ],
    timeline: [
      { title: 'Order Placed', timestamp: 'Apr 07, 2024 - 12:00 PM' },
      { title: 'Order Confirmed', timestamp: 'Apr 07, 2024 - 12:15 PM' },
      { title: 'Delivered', timestamp: 'Apr 10, 2024 - 2:00 PM' },
      { title: 'Return Initiated', timestamp: 'Apr 12, 2024 - 10:00 AM' },
    ],
  },
  {
    orderId: '#ORD-001817',
    customer: 'Karen Wilson',
    email: 'karen.w@email.com',
    phone: '+1-555-0129',
    date: '2024-04-06',
    amount: 2699,
    payment: 'PayPal',
    paymentStatus: 'Pending',
    status: 'Failed',
    address: '147 Willow Street',
    city: 'Philadelphia',
    zip: '19101',
    subtotal: 2599,
    shipping: 100,
    tax: 0,
    items: [
      { name: 'Stationary Bike', quantity: 1, price: 2599 },
    ],
    timeline: [
      { title: 'Order Placed', timestamp: 'Apr 06, 2024 - 5:30 PM' },
      { title: 'Delivery Failed', timestamp: 'Apr 09, 2024 - 11:00 AM' },
    ],
  },
  {
    orderId: '#ORD-001816',
    customer: 'David Brown',
    email: 'david.b@email.com',
    phone: '+1-555-0130',
    date: '2024-04-05',
    amount: 4599,
    payment: 'Credit Card',
    paymentStatus: 'Paid',
    status: 'Canceled',
    address: '258 Ash Avenue',
    city: 'San Antonio',
    zip: '78201',
    subtotal: 4399,
    shipping: 200,
    tax: 0,
    items: [
      { name: 'Premium Weight Set', quantity: 1, price: 2999 },
      { name: 'Bench Press', quantity: 1, price: 1400 },
    ],
    timeline: [
      { title: 'Order Placed', timestamp: 'Apr 05, 2024 - 9:15 AM' },
      { title: 'Order Canceled', timestamp: 'Apr 05, 2024 - 2:00 PM' },
    ],
  },
  {
    orderId: '#ORD-001815',
    customer: 'Jennifer Lee',
    email: 'jennifer.l@email.com',
    phone: '+1-555-0131',
    date: '2024-04-04',
    amount: 1599,
    payment: 'Debit Card',
    paymentStatus: 'Paid',
    status: 'Delivered',
    address: '369 Poplar Court',
    city: 'San Diego',
    zip: '92101',
    subtotal: 1499,
    shipping: 100,
    tax: 0,
    items: [
      { name: 'Yoga Pants Set', quantity: 2, price: 1499 },
    ],
    timeline: [
      { title: 'Order Placed', timestamp: 'Apr 04, 2024 - 1:30 PM' },
      { title: 'Order Confirmed', timestamp: 'Apr 04, 2024 - 1:45 PM' },
      { title: 'Packaging Started', timestamp: 'Apr 05, 2024 - 10:00 AM' },
      { title: 'Out for Delivery', timestamp: 'Apr 06, 2024 - 8:00 AM' },
      { title: 'Delivered', timestamp: 'Apr 07, 2024 - 3:00 PM' },
    ],
  },
  {
    orderId: '#ORD-001814',
    customer: 'Christopher Harris',
    email: 'chris.h@email.com',
    phone: '+1-555-0132',
    date: '2024-04-03',
    amount: 3299,
    payment: 'Apple Pay',
    paymentStatus: 'Paid',
    status: 'Confirmed',
    address: '741 Maple Drive',
    city: 'Dallas',
    zip: '75201',
    subtotal: 3199,
    shipping: 100,
    tax: 0,
    items: [
      { name: 'Gym Locker Organizer', quantity: 5, price: 3199 },
    ],
    timeline: [
      { title: 'Order Placed', timestamp: 'Apr 03, 2024 - 7:00 AM' },
      { title: 'Order Confirmed', timestamp: 'Apr 03, 2024 - 7:15 AM' },
    ],
  },
];

const normalizeStatus = (value = '') => {
  const slug = String(value).toLowerCase().trim().replace(/\s+/g, '-');

  if (slug === 'out-for-delivery') return 'delivery';
  if (slug === 'failed-to-deliver') return 'failed';
  if (slug === 'cancelled') return 'canceled';

  return slug;
};

export const getOrdersByStatus = (status) => {
  if (!status || status === 'all') return ordersData;
  const target = normalizeStatus(status);
  return ordersData.filter((order) => normalizeStatus(order.status) === target);
};

export const getOrdersByPaymentStatus = (paymentStatus) => {
  if (paymentStatus === 'All') return ordersData;
  return ordersData.filter(order => order.paymentStatus === paymentStatus);
};

export const searchOrders = (query, orders = ordersData) => {
  if (!query) return orders;
  const lowerQuery = query.toLowerCase();
  return orders.filter(order =>
    order.orderId.toLowerCase().includes(lowerQuery) ||
    order.customer.toLowerCase().includes(lowerQuery) ||
    order.email.toLowerCase().includes(lowerQuery)
  );
};
