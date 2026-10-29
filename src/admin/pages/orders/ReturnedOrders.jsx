import React from 'react';
import OrderStatusPage from './OrderStatusPage';
import './ReturnedOrders.css';

const ReturnedOrders = () => {
  return (
    <div className="order-module-page returned-orders-page">
      <OrderStatusPage statusKey="returned" pageTitle="Returned Orders" />
    </div>
  );
};

export default ReturnedOrders;
