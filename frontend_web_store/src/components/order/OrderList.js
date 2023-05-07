import React from "react";
import Order from "./Order";

export default function OrderList({ orders, getOrders, setOrders }) {
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
              orderId={order.orderId}
              orderDetails={order.orderDetails}
              userEmail={order.userEmail}
              orderAmount={order.orderAmount}
              orderStatus={order.orderStatus}
              createTime={order.createTime}
              updateTime={order.updateTime}
              orders={orders}
              getOrders={getOrders}
              setOrders={setOrders}
            />
          ))}
        </div>
      </div>
    </>
  );
}
