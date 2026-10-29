import React from 'react';
import OrderStatusPage from './OrderStatusPage';
import './OutForDeliveryOrders.css';

const OutForDeliveryOrders = () => {
  return (
    <div className="order-module-page out-for-delivery-orders-page">
      <OrderStatusPage statusKey="delivery" pageTitle="Out for Delivery" />
    </div>
  );
};

export default OutForDeliveryOrders;
