import React from "react";
import OrderOrderDetail from "./OrderOrderDetail";

export default function OrderOrderDetailList({ orderOrderDetails }) {
  return (
    <>
      <div className="mt-3">
        <div
          className="row row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
          id="order-order-details-row"
        >
          {orderOrderDetails.map((orderOrderDetail, idx) => (
            <OrderOrderDetail
              key={idx}
              id={orderOrderDetail.orderDetailId}
              code={orderOrderDetail.productCode}
              price={orderOrderDetail.productPrice}
              quantity={orderOrderDetail.quantity}
            />
          ))}
        </div>
      </div>
    </>
  );
}
