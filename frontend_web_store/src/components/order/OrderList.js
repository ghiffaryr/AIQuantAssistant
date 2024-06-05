import React from 'react';
import Order from './Order';

export default function OrderList({ orders, setOrders }) {
  return (
    <>
      <div className="container mb-3">
        <div
          className="row row-cols-1 g-4
        "
          id="categories-row"
        >
          {orders.map((order, idx) => (
            <Order
              key={idx}
              id={order.orderId}
              details={order.orderDetails}
              userEmail={order.userEmail}
              amount={order.orderAmount}
              status={order.orderStatus}
              createTime={order.createTime}
              updateTime={order.updateTime}
              orders={orders}
              setOrders={setOrders}
            />
          ))}
        </div>
      </div>
    </>
  );
}
