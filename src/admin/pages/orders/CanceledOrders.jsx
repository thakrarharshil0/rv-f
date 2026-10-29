import React from 'react';
import OrderStatusPage from './OrderStatusPage';
import './CanceledOrders.css';

const CanceledOrders = () => {
  return (
    <div className="order-module-page canceled-orders-page">
      <OrderStatusPage statusKey="canceled" pageTitle="Canceled Orders" />
    </div>
  );
};

export default CanceledOrders;
