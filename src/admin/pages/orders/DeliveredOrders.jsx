import React from 'react';
import OrderStatusPage from './OrderStatusPage';
import './DeliveredOrders.css';

const DeliveredOrders = () => {
  return (
    <div className="order-module-page delivered-orders-page">
      <OrderStatusPage statusKey="delivered" pageTitle="Delivered Orders" />
    </div>
  );
};

export default DeliveredOrders;
