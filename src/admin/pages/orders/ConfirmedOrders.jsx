import React from 'react';
import OrderStatusPage from './OrderStatusPage';
import './ConfirmedOrders.css';

const ConfirmedOrders = () => {
  return (
    <div className="order-module-page confirmed-orders-page">
      <OrderStatusPage statusKey="confirmed" pageTitle="Confirmed Orders" />
    </div>
  );
};

export default ConfirmedOrders;
