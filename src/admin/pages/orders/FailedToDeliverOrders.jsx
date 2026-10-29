import React from 'react';
import OrderStatusPage from './OrderStatusPage';
import './FailedToDeliverOrders.css';

const FailedToDeliverOrders = () => {
  return (
    <div className="order-module-page failed-to-deliver-orders-page">
      <OrderStatusPage statusKey="failed" pageTitle="Failed to Deliver" />
    </div>
  );
};

export default FailedToDeliverOrders;
