import React from 'react';
import OrderStatusPage from './OrderStatusPage';
import './PendingOrders.css';

const PendingOrders = () => {
  return (
    <div className="order-module-page pending-orders-page">
      <OrderStatusPage statusKey="pending" pageTitle="Pending Orders" />
    </div>
  );
};

export default PendingOrders;
