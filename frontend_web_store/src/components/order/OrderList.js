import React from "react";
import Order from "./Order";

export default function OrderList({ orders, getOrders, setOrders }) {
  return (
    <>
      <div className="container mt-3 mb-3">
        <div
          className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4
        "
          id="categories-row"
        >
          {orders.map((order) => (
            <Order
              key={order.orderId}
              orderId={order.orderId}
              orderDetails={order.orderDetails}
              userEmail={order.userEmail}
              orderAmount={order.orderAmount}
              orderStatus={order.orderStatus}
              createTime={order.createTime}
              updateTime={order.updateTime}
              getOrders={getOrders}
              setOrders={setOrders}
            />
          ))}
        </div>
      </div>
    </>
  );
}
