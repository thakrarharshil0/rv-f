import React from 'react';
import OrderStatusPage from './OrderStatusPage';
import './PackagingOrders.css';

const PackagingOrders = () => {
  return (
    <div className="order-module-page packaging-orders-page">
      <OrderStatusPage statusKey="packaging" pageTitle="Packaging Orders" />
    </div>
  );
};

export default PackagingOrders;
